from app.io import download_and_extract_from_filecoin, get_doc_from_url, hook, notify_action, LiteConverstionResult
from app.utils import estimate_ip_from_distance, is_valid_schema

from .models import (
    EmbeddingModel, 
    InsertInputSchema, 
    InsertResponse, 
    QueryInputSchema, 
    QueryResult,
    EmbeddedItem,
    GraphEmbeddedItem,
    APIStatus,
    ResponseMessage,
    FilecoinData,
    InsertProgressCallback,
    CollectionInspection,
    InsertionCounter
)
import requests
import subprocess
import os
import aiofiles
import asyncio
import json
import os
import shutil
import subprocess

from docling.datamodel.base_models import InputFormat, DocItemLabel
import json

import logging
from docling.chunking import HybridChunker
from typing import List, Union, Optional
import random

from . import constants as const
from .embedding import get_embedding_models, get_default_embedding_model, get_tokenizer
from pymilvus import MilvusClient, FieldSchema, CollectionSchema, DataType
from .wrappers import milvus_kit, redis_kit
from .graph_handlers import get_gk, Triplet
import httpx
from .utils import (
    async_batching, 
    get_content_checksum,
    sync2async,
    limit_asyncio_concurrency, 
    get_tmp_directory,
    batching,
    retry
)
import json
import os
import shutil
import asyncio
from typing import AsyncGenerator
from .state import get_insertion_request_handler
import schedule
import traceback
from pathlib import Path as PathL

logger = logging.getLogger(__name__)

GATEWAY_IPFS_PREFIX = "https://gateway.lighthouse.storage/ipfs"

@limit_asyncio_concurrency(const.DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT)
async def mk_cog_embedding(text: Union[str, List[str]], model_use: EmbeddingModel) -> List[List[float]]:
    url = model_use.base_url

    headers = {
        # 'Authorization': 'Bearer {}'.format(get_embedding_model_api_key(model_use))
    }
    
    if isinstance(text, str):
        text = [text]
    
    data = {
        'input': {
            "texts": text, 
            "dimension": model_use.dimension
        },
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url + '/predictions',
            headers=headers,
            json=data,
            timeout=httpx.Timeout(60.0 * 5),
        )

    if response.status_code != 200:
        raise ValueError(f"Failed to get embedding from {url}; Reason: {response.text}")

    response_json = response.json()
    return response_json['output']['result']

async def url_chunking(url: str, model_use: EmbeddingModel) -> AsyncGenerator:
    try:
        doc: LiteConverstionResult = await get_doc_from_url(url) 
    except Exception as e:
        fmt_exec = traceback.format_exc(limit=8)
        msg = '''
<strong>Error while reading file from {file_url}</strong>
<strong>Reason:</strong> {reason}
<strong>Traceback:</strong>
<pre>
{traceback}
</pre>
'''.format(
    file_url=f'<a href="{url}">{PathL(url).name}</a>',
    reason=str(e),
    traceback=fmt_exec
)
        await notify_action(msg)
        logger.error(f"Failed to convert document from {url} to docling format. Reason: {str(e)}")
        traceback.print_exc()
        return

    is_html = doc.input.format == InputFormat.HTML
    chunker = HybridChunker(
        tokenizer=get_tokenizer(model_use), 
        max_tokens=512
    )

    if not is_html:
        captured_items = [
            DocItemLabel.PARAGRAPH, DocItemLabel.TEXT, DocItemLabel.TITLE, DocItemLabel.LIST_ITEM, DocItemLabel.CODE
        ]
    else:
        captured_items = [
            DocItemLabel.PARAGRAPH, DocItemLabel.TITLE, DocItemLabel.LIST_ITEM, DocItemLabel.CODE
        ]

    for item in await sync2async(chunker.chunk)(dl_doc=doc.document):
        item_labels = list(map(lambda x: x.label, item.meta.doc_items))
        text = item.text
        
        if len(get_tokenizer(model_use).tokenize(text, max_length=None)) >= const.MIN_CHUNK_SIZE \
            and any([k in item_labels for k in captured_items]):
            yield text


async def url_graph_chunking(url_or_texts: str, model_use: EmbeddingModel) -> AsyncGenerator:
    gk = get_gk()

    async for item in url_chunking(url_or_texts, model_use):
        graph_result = await gk.construct_graph_from_chunk(item)

        if graph_result.status != APIStatus.OK:
            shortened_item = item[:100].replace('\n', '\\n')
            logger.error(f"Failed to construct graph from {shortened_item}. Reason: {graph_result.error}")
        else:
            for triplet in graph_result.result:
                yield item, triplet

async def insert_to_collection(
    inputs: List[GraphEmbeddedItem], 
    model_use: EmbeddingModel, 
    metadata: dict
):
    assert (
        all([k in metadata for k in ['kb', 'reference']]), 
        "Missing required fields in metadata"
    )
    
    logger.info(f"inserting {len(inputs)} entities to {model_use.identity()}")

    vectors = [e.embedding for e in inputs]
    raw_texts = [e.raw_text for e in inputs]
    heads = [e.head for e in inputs]
    tails = [e.tail for e in inputs]
    kb_postfixes = [e.kb_postfix for e in inputs]
    kb = metadata.pop('kb')

    futures = [
        asyncio.ensure_future(sync2async(get_content_checksum)(text))
        for text in raw_texts
    ]

    hashs = await asyncio.gather(*futures, return_exceptions=True)

    for i in range(len(hashs)):
        if isinstance(hashs[i], Exception):
            hashs[i] = "0" * 64

    data = [
        {
            **metadata,
            'kb': kb + kb_postfix,
            'head': head,
            'tail': tail,
            'content': text,
            'hash': await sync2async(get_content_checksum)(text),
            'embedding': vec
        }
        for vec, text, head, tail, kb_postfix 
        in zip(vectors, raw_texts, heads, tails, kb_postfixes)
    ]

    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)

    res = await sync2async(cli.insert)(
        collection_name=model_use.identity(),
        data=data
    )

    insert_cnt = res['insert_count']
    logger.info(f"Successfully inserted {insert_cnt} items to {kb} (collection: {model_use.identity()});")
    return insert_cnt


mk_cog_embedding_retry_wrapper = retry(
    mk_cog_embedding, 
    max_retry=2,
    first_interval=2, 
    interval_multiply=2
)

async def embedd_triplet(
    chunk: str, 
    triplet: Triplet, 
    model_use: EmbeddingModel, 
) -> Optional[tuple]:
    global mk_cog_embedding_retry_wrapper

    head_e, tail_e, relation_e = await mk_cog_embedding_retry_wrapper(
        [triplet.s1, triplet.s2, triplet.fact()], 
        model_use
    )

    head_h, tail_h = hash(triplet.s1), hash(triplet.s2)

    return (
        GraphEmbeddedItem(
            embedding=head_e, 
            raw_text=chunk,
            kb_postfix=const.ENTITY_SUFFIX,
            head = head_h,
            tail = tail_h
        ), GraphEmbeddedItem(
            embedding=tail_e, 
            raw_text=chunk,
            kb_postfix=const.ENTITY_SUFFIX,
            head = tail_h,
            tail = head_h
        ), GraphEmbeddedItem(
            embedding=relation_e, 
            raw_text=chunk,
            kb_postfix=const.RELATION_SUFFIX,
            head = head_h,
            tail = tail_h
        )
    )

async def chunking_and_embedding(
    url_or_texts: Union[str, List[str]], 
    model_use: EmbeddingModel,     
    counter: Optional[InsertionCounter]=None
) -> AsyncGenerator:
    futures = []
    counter = counter or InsertionCounter()

    if isinstance(url_or_texts, str):
        async for chunk, triplet in url_graph_chunking(url_or_texts, model_use):
            futures.append(asyncio.ensure_future(embedd_triplet(chunk, triplet, model_use)))

    elif isinstance(url_or_texts, list):
        gk = get_gk()

        for item in url_or_texts:
            resp = await gk.construct_graph_from_chunk(item)

            if resp.status != APIStatus.OK:
                logger.error(f"Failed to get embedding for {item[:100] + '...'!r} Reason: {resp.error}")

            else:
                futures.extend([
                    asyncio.ensure_future(embedd_triplet(item, e, model_use))
                    for e in resp.result
                ])

    else:
        raise ValueError("Invalid input type; Expecting str or list of str, got {}".format(type(url_or_texts)))

    counter.total = len(futures) * 3

    for future in asyncio.as_completed(futures):
        try:
            item = await future
            for element in item:
                yield element
        except Exception as err:
            counter.fails += 1
            logger.error(f"Exception raised while embedding triplet: {err}")

_running_tasks = set([])

async def smaller_task(
    url_or_texts: Union[List[str], str], 
    kb: str, 
    model_use: EmbeddingModel, 
    file_identifier:str = "",
    request_identifier: Optional[str] = None
):
    if isinstance(url_or_texts, str) and request_identifier is not None:
        await hook(
            ResponseMessage[InsertProgressCallback](
                result=InsertProgressCallback(
                    ref=request_identifier,
                    kb=kb,
                    identifier=file_identifier,
                    message=f"Start processing file {file_identifier}",
                ),
                status=APIStatus.PROCESSING
            )
        )

    counter = InsertionCounter()
    async for data in async_batching(
        chunking_and_embedding(
            url_or_texts, 
            model_use,
            counter
        ), 
        const.DEFAULT_MILVUS_INSERT_BATCH_SIZE
    ):
        data: List[EmbeddedItem]

        inserted = await insert_to_collection(
            inputs=data, 
            model_use=model_use, 
            metadata = {
                'kb': kb, 
                'reference': file_identifier
            }
        )

        counter.fails += len(data) - inserted

    logger.info(f"Total: {counter.total} (chunks); Fail: {counter.fails} (chunks)")

    if isinstance(url_or_texts, str) and request_identifier is not None:
        n_inserted_chunks = counter.total - counter.fails

        status = APIStatus.OK if n_inserted_chunks > 0 else APIStatus.ERROR
        reason = "" if status == APIStatus.OK else "No data read from the provided file"

        await hook(
            ResponseMessage[InsertProgressCallback](
                result=InsertProgressCallback(
                    ref=request_identifier,
                    message=(
                        f"Completed processing file {file_identifier}" 
                        if n_inserted_chunks > 0 else 
                        f"Failed to process file {file_identifier} (Reason: {reason})"
                    ),
                    kb=kb,
                    identifier=file_identifier
                ),
                status=status
            )
        )

    return (counter.total, counter.fails)

@limit_asyncio_concurrency(4)
async def download_file(
    session: httpx.AsyncClient, url: str, path: str
):
    async with session.stream("GET", url) as response:
        async with aiofiles.open(path, 'wb') as f:
            async for chunk in response.aiter_bytes(8192):
                await f.write(chunk)

    logger.info(f"Downloaded {path}")
    
async def download_filecoin_item(
    metadata: dict, 
    tmp_dir: str, 
    session: httpx.AsyncClient,
    identifier: str
) -> Optional[FilecoinData]:
    
    if metadata["is_part"]:
        parts = sorted(metadata["files"], key=lambda x: x["index"])
        zip_parts, tasks = [], []

        for part in parts:
            part_url = f"{GATEWAY_IPFS_PREFIX}/{part['hash']}"
            part_path = PathL(tmp_dir) / part['name']
            tasks.append(download_file(session, part_url, part_path))
            zip_parts.append(part_path)

        await asyncio.gather(*tasks)

        name = metadata['name']
        destination = PathL(tmp_dir) / name
        command = f"cat {tmp_dir}/{name}.zip.part-* | pigz -p 2 -d | tar -xf - -C {tmp_dir}"

        await sync2async(subprocess.run)(
            command, shell=True, check=True
        )

        logger.info(f"Successfully extracted files to {destination}")
        afiles = []

        for root, dirs, files in os.walk(destination):
            for file in files:
                afiles.append(os.path.join(root, file))

        if len(afiles) > 0:
            return FilecoinData(
                identifier=identifier,
                address=afiles[0]
            )

        logger.warning(f"No files extracted from {destination}")

    else:
        url = f"{GATEWAY_IPFS_PREFIX}/{metadata['files'][0]['hash']}"
        path = PathL(tmp_dir) / metadata['files'][0]['name']
        await download_file(session, url, path)

        return FilecoinData(
            identifier=identifier,
            address=path
        )
        
    return None

async def inspect_by_file_identifier(file_identifier: str) -> CollectionInspection:
    milvus_cli = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)

    it = milvus_cli.query_iterator(
        collection_name=get_default_embedding_model().identity(),
        filter=f"reference == {file_identifier!r}",
        output_fields=["hash"]
    )
    
    hashs = set([])

    while True:
        batch = await sync2async(it.next)()

        if len(batch) == 0:
            break

        for item in batch:
            hashs.add(item['hash'])

    return CollectionInspection(
        file_ref=file_identifier,
        message=f"Has {len(hashs)} unique chunk(s)",
        status=APIStatus.OK if len(hashs) > 0 else APIStatus.ERROR
    )         

@limit_asyncio_concurrency(1)
async def process_data(req: InsertInputSchema, model_use: EmbeddingModel):
    if req.id in _running_tasks:
        return

    # tmp dir preparation
    tmp_dir = get_tmp_directory()
    os.makedirs(tmp_dir, exist_ok=True)

    try:

        _running_tasks.add(req.id)
        kb = req.kb
        n_chunks, fails_count = 0, 0

        verbosed_info_for_logging = {
            k: (v if k not in ['texts', 'file_urls'] else f'List of {len(v)} items')
            for k, v in req.model_dump().items()
        }

        logger.info(f"Received {json.dumps(verbosed_info_for_logging, indent=2)};\nStart handling task: {req.id}")

        futures = []
        sqrt_length_texts = int(len(req.texts) ** 0.5)
        filecoin_files = []
        identifers = []

        if req.filecoin_metadata_url is not None:
            filecoin_files = await download_and_extract_from_filecoin(req.filecoin_metadata_url, tmp_dir)

        for fc_file in filecoin_files:
            futures.append(asyncio.ensure_future(
                smaller_task(
                    fc_file.address, kb, model_use, 
                    file_identifier=fc_file.identifier, 
                    request_identifier=req.ref
                )
            ))
            identifers.append(fc_file.identifier)

        if len(req.texts) > 0:
            for chunk_of_texts in batching(req.texts, sqrt_length_texts):
                futures.append(asyncio.ensure_future(
                    smaller_task(
                        chunk_of_texts, kb, model_use, 
                        file_identifier="",
                        request_identifier=req.ref
                    )
                ))

        for url in req.file_urls:
            futures.append(asyncio.ensure_future(
                smaller_task(
                    url, kb, model_use, 
                    file_identifier=url,
                    request_identifier=req.ref
                )
            ))
            identifers.append(url)

        if len(futures) > 0:
            results = await asyncio.gather(*futures)

            n_chunks = sum([r[0] for r in results])
            fails_count = sum([r[1] for r in results])

        logger.info(f"(overall) Inserted {n_chunks - fails_count} items to {kb} (collection: {model_use.identity()});")

        if req.hook is not None:
            hook_result = await hook(
                ResponseMessage[InsertResponse](
                    result=InsertResponse(
                        ref=req.ref,
                        message=f"Inserted {n_chunks - fails_count} (chunks); Failed {fails_count} (chunks); Total: {n_chunks} (chunks); {len(req.file_urls) + len(filecoin_files)} (files).",
                        kb=kb,
                        details=[
                            await inspect_by_file_identifier(identifier) 
                            for identifier in identifers
                        ]
                    ),
                    status=APIStatus.OK if (n_chunks - fails_count) > 0 or len(futures) == 0 else APIStatus.ERROR
                )
            )

            logger.info(f"Hook status: {hook_result};")

        await sync2async(get_insertion_request_handler().delete)(req.id)
        return n_chunks

    finally:
        _running_tasks.remove(req.id)
        shutil.rmtree(tmp_dir, ignore_errors=True)
        logger.info(f"Completed handling task: {req.id}")

@schedule.every(5).minutes.do
def resume_pending_tasks():
    if len(_running_tasks) > 0:
        return

    logger.info("Scanning for pending tasks...")
    handler = get_insertion_request_handler()
    
    logger.info(f"Found {len(handler.get_all())} pending tasks")
    pending_tasks = handler.get_all()

    for task in pending_tasks:
        if task.id in _running_tasks:
            continue

        # TODO: change this
        logger.info(f"Resuming task {task.id}")
        requests.post(
            "http://localhost:8000/api/insert", 
            json={
                **task.model_dump(),
                "is_re_submit": True
            }
        )
        break

async def get_collection_num_entities(collection_name: str) -> int:
    cli = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)
    res = await sync2async(cli.query)(collection_name=collection_name, output_fields=["count(*)"])
    return res[0]["count(*)"]

def prepare_milvus_collection():
    models = get_embedding_models()
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)

    logger.info(f"Checking and creating collections for {len(models)} models")

    for model in models:
        identity = model.identity()
        collection_schema = CollectionSchema(
            fields=[
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=1024 * 8),
                FieldSchema(name="hash", dtype=DataType.VARCHAR, max_length=64), 
                FieldSchema(name="head", dtype=DataType.INT64, Default=-1),
                FieldSchema(name="tail", dtype=DataType.INT64, Default=-1),
                FieldSchema(name="reference", dtype=DataType.VARCHAR, max_length=1024), 
                FieldSchema(name="kb", dtype=DataType.VARCHAR, max_length=64),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=model.dimension),
            ]
        )

        if cli.has_collection(identity):
            if is_valid_schema(identity, collection_schema):
                logger.info(f"Collection {model.identity()} is ready")
                continue
            else:
                logger.info(f"Collection {model.identity()} has invalid schema. Dropping it")
                cli.drop_collection(identity)

        index_params = MilvusClient.prepare_index_params(
            field_name="embedding",
            index_type="IVF_FLAT",
            metric_type=model.prefer_metric.value,
            nlist=128
        )

        cli.create_collection(
            collection_name=model.identity(),
            schema=collection_schema,
            index_params=index_params      
        )

        logger.info(f"Collection {model.identity()} created")

    logger.info("All collections are ready")

def deduplicate_task():
    models = get_embedding_models()
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)
    fields_output = ['hash', 'id', 'kb', 'head', 'tail', 'reference']

    for model in models:
        identity = model.identity()
        
        if not cli.has_collection(identity):
            logger.error(f"Collection {identity} not found")
            continue

        first_observation = {}
        to_remove_ids = [] 

        it = cli.query_iterator(
            identity, 
            output_fields=fields_output,
            batch_size=1000 * 10
        )

        while True:
            batch = it.next()

            if len(batch) == 0:
                break

            for item in batch:
                item_key = "{hash}_{head}_{tail}_{ref}_{kb}".format(
                    hash=item["hash"],
                    kb=item["kb"],
                    head=item["head"],
                    tail=item["tail"],
                    ref=item["ref"]
                )

                if item_key not in first_observation:
                    first_observation[item_key] = item

                else:
                    to_remove_ids.append(item["id"])

        if len(to_remove_ids) > 0:
            logger.info(f"Removing {len(to_remove_ids)} duplications in {identity}")
            cli.delete(
                collection_name=identity, 
                ids=to_remove_ids
            )

        logger.info(f"Deduplication for {identity} done")    

@redis_kit.cache_for(interval_seconds=300 // 5) # seconds
async def get_sample(kb: str, k: int) -> List[QueryResult]:
    if k <= 0:
        return []

    fields_output = ['content', 'reference', 'hash']

    embedding_model = get_default_embedding_model()
    model_identity = embedding_model.identity()
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST) 

    relational_kb = kb + const.RELATION_SUFFIX

    results = await sync2async(cli.query)(
        model_identity,
        filter=f"kb == {relational_kb!r}", 
        output_fields=fields_output
    )

    results = list({
        item['hash']: item 
        for item in results
    }.values())

    results_random_k = random.sample(results, min(k, len(results)))

    return [
        QueryResult(
            content=item['content'],
            reference=item['reference'],
            score=1
        )
        for item in results_random_k
    ]
    
async def drop_kb(kb: str):
    models = get_embedding_models()
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)

    removed_count = 0

    for model in models:
        identity = model.identity()

        if not cli.has_collection(identity):
            logger.error(f"Collection {identity} not found")
            continue

        resp: dict = cli.delete(
            collection_name=identity,
            filter=f"kb == {kb!r}"
        )

        removed_count += resp['delete_count']

    logger.info(f"Deleted all data for kb {kb}")
    return removed_count

@redis_kit.cache_for(interval_seconds=300 // 5) # seconds
async def run_query(req: QueryInputSchema) -> List[QueryResult]:
    if len(req.kb) == 0 or req.top_k <= 0:
        return []

    embedding_model = get_default_embedding_model()
    model_identity = embedding_model.identity()
    query_embedding = await mk_cog_embedding(req.query, embedding_model)
    
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST) 
    row_count = await get_collection_num_entities(model_identity)

    if row_count == 0:
        return []

    entity_kb = [
        kb + const.ENTITY_SUFFIX 
        for kb in req.kb
    ]

    relational_kb = [
        kb + const.RELATION_SUFFIX 
        for kb in req.kb
    ]

    nodes = []

    # Extract named entities from the query
    resp  = await get_gk().extract_named_entities(req.query)
    
    if resp.status != APIStatus.OK:
        logger.warning(f"No entities extracted from the given query. Message: {resp.error}")

    ner_query_list = resp.result or []

    if len(ner_query_list) > 0:
        res = await sync2async(cli.search)(
            collection_name=model_identity,
            data=await mk_cog_embedding(ner_query_list, embedding_model),
            kb_filter=f"kb in {entity_kb}",
            anns_field="embedding",
            output_fields=["head", "tail"],
            search_params={"params": {"radius": req.threshold}}
        )

        for ee in res:
            for e in ee:
                nodes.extend([
                    e['entity']['head'], 
                    e['entity']['tail']
                ])

    filter_str = f"kb in {relational_kb}"

    if len(nodes) > 0:
        nodes = list(set(nodes))
        filter_str += f" and (head in {nodes} or tail in {nodes})"

    res = await sync2async(cli.search)(
        collection_name=model_identity,
        data=query_embedding,
        filter=filter_str,
        limit=min(req.top_k, row_count),
        anns_field="embedding",
        output_fields=["id", "content", "reference", "hash"],
        search_params={"params": {"radius": req.threshold}},
    )

    hits = list(
        {
            item['entity']['hash']: item 
            for item in res[0]
        }.values()
    )

    for i in range(len(hits)):
        hits[i]['score'] = estimate_ip_from_distance(
            hits[i]['distance'], 
            embedding_model
        )

    hits = sorted(
        hits, 
        key=lambda e: e['score'], 
        reverse=True
    )

    return [
        QueryResult(
            content=hit['entity']['content'],
            reference=hit['entity']['reference'],
            score=hit['score']
        )
        for hit in hits
    ]

    
