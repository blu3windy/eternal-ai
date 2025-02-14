from app.utils import estimate_ip_from_distance

from .models import (
    EmbeddingModel, 
    InsertInputSchema, 
    UpdateInputSchema,
    InsertResponse, 
    QueryInputSchema, 
    QueryResult,
    EmbeddedItem,
    GraphEmbeddedItem,
    APIStatus,
    ResponseMessage,
    FilecoinData,
    InsertProgressCallback,
    CollectionInspection
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
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.backend.docling_parse_v2_backend import DoclingParseV2DocumentBackend
import json

import logging
from docling.chunking import HybridChunker
from docling.document_converter import DocumentConverter, FormatOption, ConversionResult
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline
from typing import List, Union, Optional
import random

from . import constants as const
from .embedding import get_embedding_models, get_default_embedding_model, get_tokenizer, get_embedding_model_api_key
from pymilvus import MilvusClient, FieldSchema, CollectionSchema, DataType, Collection
from .wrappers import milvus_kit, redis_kit
from .graph_handlers import GRAPH_KNOWLEDGE as GK
import httpx
from .utils import (
    async_batching, 
    get_content_checksum,
    sync2async,
    limit_asyncio_concurrency, 
    get_tmp_directory,
    batching,
    get_hash
)
import json
import os
import numpy as np
import zipfile 
import shutil
import asyncio
from typing import AsyncGenerator
from .state import get_insertion_request_handler
from .wrappers import telegram_kit
import schedule
import traceback
from pathlib import Path as PathL
import re

logger = logging.getLogger(__name__)

SUPORTED_DOCUMENT_FORMATS = [
    InputFormat.XLSX,
    InputFormat.DOCX,
    InputFormat.PPTX,
    InputFormat.MD,
    InputFormat.ASCIIDOC,
    InputFormat.HTML,
    InputFormat.XML_USPTO,
    InputFormat.XML_PUBMED,
    InputFormat.PDF
]
GATEWAY_IPFS_PREFIX = "https://gateway.lighthouse.storage/ipfs"

DOCUMENT_FORMAT_OPTIONS = {
    InputFormat.PDF: FormatOption(
        pipeline_cls=StandardPdfPipeline, 
        backend=DoclingParseV2DocumentBackend,
        pipeline_options=PdfPipelineOptions(
            do_table_structure=True, 
            do_ocr=False
        )
    )
}

async def hook(
    resp: ResponseMessage[Union[InsertResponse, InsertProgressCallback]],
):
    body: dict = resp.model_dump()
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            const.ETERNALAI_RESULT_HOOK_URL,
            json=body
        )

    msg = '''
Callback <a href="{hook_url}">{hook_url}</a>:

Request:
<pre>
{json_log}
</pre>

Response:
<pre>
{response}
</pre>
'''.format(
    hook_url=const.ETERNALAI_RESULT_HOOK_URL,
    json_log=json.dumps(body, indent=2),
    response=response.text
)

    telegram_kit.send_message(
        msg, 
        room=const.TELEGRAM_ROOM,
        schedule=True
    )

    if response.status_code != 200:
        logger.error(f"Failed to send hook response: {response.text}")
        return False
    
    return True

@limit_asyncio_concurrency(const.DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT)
async def mk_embedding(text: str, model_use: EmbeddingModel) -> List[float]:
    url = model_use.base_url
    headers = {
        'Authorization': 'Bearer {}'.format(get_embedding_model_api_key(model_use))
    }

    data = {
        'input': text,
        'model': model_use.name
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url + '/v1/embeddings',
            headers=headers,
            json=data,
            timeout=httpx.Timeout(60.0),
        )
        
        
    if response.status_code != 200:
        raise ValueError(f"Failed to get embedding from {url}; Reason: {response.text}")

    response_json = response.json()
    response_json['data'][0]['embedding'] = response_json['data'][0]['embedding'][:model_use.dimension]

    if model_use.normalize:
        x = np.array(response_json['data'][0]['embedding']) 
        x /= np.linalg.norm(x)
        return x.tolist()

    return response_json['data'][0]['embedding'] 

@limit_asyncio_concurrency(const.DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT)
async def mk_cog_embedding(text: str, model_use: EmbeddingModel) -> List[float]:
    url = model_use.base_url

    headers = {
        # 'Authorization': 'Bearer {}'.format(get_embedding_model_api_key(model_use))
    }
    
    data = {
        'input': {"texts": [text], "dimension": 256},
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
    response_json['output']['result'][0] = response_json['output']['result'][0][:model_use.dimension]

    return response_json['output']['result'][0] 

@limit_asyncio_concurrency(2)
async def get_doc_from_url(url):
    return await sync2async(
        DocumentConverter(
            allowed_formats=SUPORTED_DOCUMENT_FORMATS,
            format_options=DOCUMENT_FORMAT_OPTIONS
        ).convert
    )(source=url)

async def url_chunking(url: str, model_use: EmbeddingModel) -> AsyncGenerator:
    try:
        doc: ConversionResult = await get_doc_from_url(url) 
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
    chunker = HybridChunker(tokenizer=get_tokenizer(model_use), max_tokens=512)

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
    async for item in url_chunking(url_or_texts, model_use):
        try:
            graph_result, err = await GK.construct_graph_from_chunk(item)
            if err is None:
                _, triplets = graph_result
                for idx, triplet in enumerate(triplets):
                    if len(triplet) == 3:
                        yield item, triplet
        except Exception as e:
            logger.error(f"Failed to construct graph from {item}. Reason: {e}")
            traceback.print_exc()
            return

async def inserting(_data: Optional[Union[List[EmbeddedItem], List[tuple]]], model_use: EmbeddingModel, metadata: dict):
    assert all([k in metadata for k in ['kb', 'reference']]), "Missing required fields"

    d = []
    for item in _data:
        if isinstance(item, tuple):
            head, tail, relation = item
            for obj in [head, tail, relation]:
                if obj.error is None:
                    d.append(obj)
        else:
            if item.error is None:
                d.append(item)

    if len(d) == 0:
        logger.error("No valid data to insert")
        return 0

    vectors = [e.embedding for e in d]
    raw_texts = [e.raw_text for e in d]
    heads = [0 or e.head for e in d]
    tails = [0 or e.tail for e in d]
    kb_postfixes = ["" or e.kb_postfix for e in d]
    print("Total items to insert: ", len(vectors))
    kb = metadata.pop('kb')
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
        for vec, text, head, tail, kb_postfix in zip(vectors, raw_texts, heads, tails, kb_postfixes)
    ]

    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)
    res = await sync2async(cli.insert)(
        collection_name=model_use.identity(),
        data=data
    )

    insert_cnt = res['insert_count']
    logger.info(f"Successfully inserted {insert_cnt} items to {kb} (collection: {model_use.identity()});")
    return insert_cnt

async def chunking_and_embedding(url_or_texts: Union[str, List[str]], model_use: EmbeddingModel) -> AsyncGenerator:
    to_retry = []   

    if isinstance(url_or_texts, str):
        async for item in url_graph_chunking(url_or_texts, model_use):
            try:
                chunk, triplet = item
                relation = ' '.join(triplet)
                head, _, tail = triplet
                yield (GraphEmbeddedItem(
                    embedding=await mk_cog_embedding(head, model_use), 
                    raw_text=chunk,
                    kb_postfix="-entities",
                    head = hash(head),
                    tail = hash(tail)
                ), GraphEmbeddedItem(
                    embedding=await mk_cog_embedding(tail, model_use), 
                    raw_text=chunk,
                    kb_postfix="-entities",
                    head = hash(tail),
                    tail = hash(head)
                ), GraphEmbeddedItem(
                    embedding=await mk_cog_embedding(relation, model_use), 
                    raw_text=chunk,
                    kb_postfix="-relations",
                    head = hash(tail),
                    tail = hash(head)
                ))
            except Exception as e:
                logger.error(f"Failed to get embedding, Reason: {str(e)}")
                to_retry.append(item)

        for item in to_retry:
            try:
                yield EmbeddedItem(
                    embedding=await mk_cog_embedding(item, model_use), 
                    raw_text=item
                )
            except Exception as e:
                logger.error(f"(again) Failed to get embedding for {item[:100] + '...'!r} Reason: {str(e)}")
                yield EmbeddedItem(
                    embedding=None,
                    raw_text=item,
                    error=str(e)
                )
    elif isinstance(url_or_texts, list):
        for item in url_or_texts:
            try:
                yield EmbeddedItem(
                    embedding=await mk_cog_embedding(item, model_use), 
                    raw_text=item
                )
            except Exception as e:
                logger.error(f"Failed to get embedding for {item[:100] + '...'!r} Reason: {str(e)}")
                to_retry.append(item)

        for item in to_retry:
            try:
                yield EmbeddedItem(
                    embedding=await mk_cog_embedding(item, model_use), 
                    raw_text=item
                )
            except Exception as e:
                logger.error(f"(again) Failed to get embedding for {item[:100] + '...'!r} Reason: {str(e)}")
                yield EmbeddedItem(
                    embedding=None,
                    raw_text=item,
                    error=str(e)
                )
    else:
        raise ValueError("Invalid input type; Expecting str or list of str, got {}".format(type(url_or_texts)))

async def export_collection_data(
    collection: str, 
    workspace_directory: str, 
    filter_expr='', 
    include_embedding=True, 
    include_identity=False
) -> str:
    fields_output = ['content', 'reference', 'hash']

    if include_embedding:   
        fields_output.append('embedding')
  
    if include_identity:
        fields_output.append('kb')

    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)

    if not cli.has_collection(collection):
        raise Exception(f"Collection {collection } not found")

    logger.info(f"Exporting {filter_expr} from {collection} to {workspace_directory}...")

    it = cli.query_iterator(
        collection, 
        filter=filter_expr,
        output_fields=fields_output,
        batch_size=100
    )

    meta, vec = [], []
    hashes = set([])

    while True:
        batch = await sync2async(it.next)()

        if len(batch) == 0:
            break
        
        h = [e['hash'] for e in batch]
        mask = [True] * len(batch)
        removed = 0
        
        for i, item in enumerate(h):
            _h = item if not include_identity else f"{item}{batch[i]['kb']}"

            if _h in hashes:
                removed += 1
                mask[i] = False 
            else:
                hashes.add(_h)

        if removed == len(batch):
            continue

        if include_embedding:
            vec.extend([
                item['embedding'] 
                for i, item in enumerate(batch) 
                if mask[i]
            ])

        meta.extend([
            {
                'content': item['content'],
                'reference': item['reference'] if len(item['reference']) else None,
                **({'kb': item['kb']} if include_identity else {}),
            } 
            for i, item in enumerate(batch)
            if mask[i]
        ])

        logger.info(f"Exported {len(hashes)}...")

    if include_embedding:
        vec = np.array(vec)

    logging.info(f"Export {filter_expr} from {collection}: Making meta.json")
    with open(os.path.join(workspace_directory, 'meta.json'), 'w') as fp:
        await sync2async(json.dump)(meta, fp)

    if include_embedding:
        logging.info(f"Export {filter_expr} from {collection}: Making vec.npy")
        await sync2async(np.save)(os.path.join(workspace_directory, 'vec.npy'), vec)

    destination_file = f"{workspace_directory}/data.zip"
    logging.info(f"Export {filter_expr} from {collection}: Making {destination_file}")
    with zipfile.ZipFile(destination_file, 'w') as z:
        await sync2async(z.write)(os.path.join(workspace_directory, 'meta.json'), 'meta.json')
    
        if include_embedding:
            await sync2async(z.write)(os.path.join(workspace_directory, 'vec.npy'), 'vec.npy')

    logging.info(f"Export {filter_expr} from {collection}: Done (filesize: {os.path.getsize(destination_file) / 1024 / 1024:.2f} MB)")
    return destination_file

_running_tasks = set([])


async def smaller_task(
    url_or_texts: Union[List[str], str], 
    kb: str, 
    model_use: EmbeddingModel, 
    file_identifier:str = "",
    request_identifier: Optional[str] = None
):
    n_inserted_chunks, fails_count = 0, 0

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

    async for data in async_batching(
        chunking_and_embedding(url_or_texts, model_use), 
        const.DEFAULT_MILVUS_INSERT_BATCH_SIZE
    ):
        data: Optional[Union[List[EmbeddedItem], List[tuple]]]
        n_inserted_chunks += await inserting(
            _data=data, 
            model_use=model_use, 
            metadata = {
                'kb': kb, 
                'reference': file_identifier
            }
        )

        for item in data:
            if isinstance(item, tuple):
                fails_count += sum(1 for obj in item if obj.error is not None)
            else:
                if item.error is not None:
                    fails_count += 1

    if isinstance(url_or_texts, str) and request_identifier is not None:
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

    return (n_inserted_chunks + fails_count, fails_count)

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

async def download_and_extract_from_filecoin(
    url: str, tmp_dir: str, ignore_inserted: bool=True
) -> List[FilecoinData]:
    list_files: List[FilecoinData] = []

    pat = re.compile(r"ipfs/(.+)")
    cid = pat.search(url).group(1)
    
    if not cid:
        raise ValueError(f"Invalid filecoin url: {url}")

    async with httpx.AsyncClient() as session:
        response = await session.get(url)

        if response.status_code != 200:
            raise ValueError(f"Failed to get metadata from {url}; Reason: {response.text}")

        list_metadata = json.loads(response.content)

        for file_index, metadata in enumerate(list_metadata):
            metadata: dict
            logger.info(metadata)
            
            if ignore_inserted and metadata.get("is_inserted", False):
                continue

            fcdata = await download_filecoin_item(
                metadata, 
                tmp_dir, 
                session, 
                identifier=f"{cid}/{file_index}"
            )
            
            if fcdata is not None:
                list_files.append(fcdata)

    logger.info(f"List of files to be processed: {list_files}")
    return list_files

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

@limit_asyncio_concurrency(4)
async def process_data(req: InsertInputSchema, model_use: EmbeddingModel):
    if req.id in _running_tasks:
        return

    try:
        # tmp dir preparation
        tmp_dir = get_tmp_directory()
        os.makedirs(tmp_dir, exist_ok=True)

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
        shutil.rmtree(tmp_dir, ignore_errors=True)
        _running_tasks.remove(req.id)
        logger.info(f"Completed handling task: {req.id}")

@schedule.every(5).minutes.do
def resume_pending_tasks():
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

def get_collection_num_entities(collection_name: str) -> int:
    cli = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST)
    res = cli.query(collection_name=collection_name, output_fields=["count(*)"])
    return res[0]["count(*)"]

def is_valid_schema(collection_name: str, required_schema: CollectionSchema):
    collection = Collection(collection_name)
    schema = collection.schema
    return schema == required_schema

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
    fields_output = ['hash', 'id', 'kb']

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
                item_key = "{hash}_{kb}".format(
                    hash=item["hash"],
                    kb=item["kb"]
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

async def get_sample(kb: str, k: int) -> List[QueryResult]:
    if k <= 0:
        return []

    fields_output = ['content', 'reference', 'hash']

    embedding_model = get_default_embedding_model()
    model_identity = embedding_model.identity()
    cli: MilvusClient = milvus_kit.get_reusable_milvus_client(const.MILVUS_HOST) 

    results = cli.query(
        model_identity,
        filter=f"kb == {kb!r}", 
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
    row_count = get_collection_num_entities(model_identity)
    
    entity_kb = [kb + "-entities" for kb in req.kb]
    relation_kb = [kb + "-relations" for kb in req.kb]
    entities_res = []

    # Extract named entities from the query
    ner_query_list, _ = await GK.extract_named_entities(req.query)
    if len(ner_query_list) > 0:
        query_ner_embeddings = [
            await mk_cog_embedding(ner_query, embedding_model) for ner_query in ner_query_list
        ]
        entities_res = cli.search(
            collection_name=model_identity,
            data=query_ner_embeddings,
            kb_filter=f"kb in {entity_kb}",
            limit=min(req.top_k, row_count),
            anns_field="embedding",
            output_fields=["id", "content", "head", "tail", "reference", "hash"],
            search_params={"params": {"radius": req.threshold}},
        )

    relations_res = cli.search(
        collection_name=model_identity,
        data=[query_embedding],
        filter=f"kb in {relation_kb}",
        limit=min(req.top_k, row_count),
        anns_field="embedding",
        output_fields=["id", "content", "head", "tail", "reference", "hash"],
        search_params={"params": {"radius": req.threshold}},
    )

    contents = []
    scores = []
    original_nodes = []
    min_score = 1.0

    for ner_entities_result in entities_res:
        for result in ner_entities_result:
            entity = result["entity"]
            score = result["distance"]
            head = entity["head"]
            tail = entity["tail"]
            content = entity["content"]
            if score < min_score:
                min_score = score
            if head not in original_nodes:
                original_nodes.append(head)
            if content not in contents:
                scores.append(score)
                contents.append(content)
            
    for relation_result in relations_res:
        for result in relation_result:
            entity = result["entity"]
            score = result["distance"]
            head = entity["head"]
            tail = entity["tail"]
            content = entity["content"]
            if head not in original_nodes:
                original_nodes.append(head)
            if tail not in original_nodes:
                original_nodes.append(tail)
            if score < min_score:
                min_score = score
            if content not in contents:
                scores.append(score)
                contents.append(content)

    if len(entities_res) > 0:
        expanded_entities_res = cli.query(
            collection_name=model_identity,
            filter=f"kb in {entity_kb} and (head in {original_nodes} or tail in {original_nodes})",
            output_fields=["content"]
        )
        for entity in expanded_entities_res:
            content = entity["content"]
            if content not in contents:
                contents.append(content)
                scores.append(min_score)
    
    if len(relations_res) > 0:
        expanded_relations_res = cli.query(
            collection_name=model_identity,
            filter=f"kb in {relation_kb} and (head in {original_nodes} or tail in {original_nodes})",
            output_fields=["content"]
        )
        for relation in expanded_relations_res:
            content = relation["content"]
            if content not in contents:
                contents.append(content)
                scores.append(min_score)

    print(len(contents), len(scores))
    pairs = [(contents[i], scores[i]) for i in range(len(contents))]
    hits = sorted(pairs, key=lambda x: x[1], reverse=True)[:req.top_k]
    
    return [
        QueryResult(
            content=hit[0],
            score=hit[1]
        )
        for hit in hits
    ]

async def notify_action(req: Union[InsertInputSchema, UpdateInputSchema, QueryInputSchema, str]):
    if isinstance(req, InsertInputSchema):
        msg = '''<strong>Received a request to insert:</strong>\n
<i>
<b>ID:</b> {id}
<b>Texts:</b> {texts} (items)
<b>Files:</b> {files} (files)
<b>Filecoin metadata url:</b> {filecoin_metadata_url}
<b>Knowledge Base:</b> {kb}
<b>Reference:</b> {ref}
<b>Hook:</b> <a href="{hook}">{hook}</a>
</i>
'''.format(
        id=req.id,
        texts=len(req.texts),
        files=len(req.file_urls),
        filecoin_metadata_url=req.filecoin_metadata_url,
        kb=req.kb,
        ref=req.ref,
        hook=req.hook
    )
    
    elif isinstance(req, UpdateInputSchema):
        msg = '''<strong>Received a request to update:</strong>\n
<i>
<b>ID:</b> {id}
<b>Texts:</b> {texts} (items)
<b>Files:</b> {files} (files)
<b>Filecoin metadata url:</b> {filecoin_metadata_url}
<b>Knowledge Base:</b> {kb}
<b>Reference:</b> {ref}
<b>Hook:</b> <a href="{hook}">{hook}</a>
</i>
'''.format(
        id=req.id,
        texts=len(req.texts),
        files=len(req.file_urls),
        filecoin_metadata_url=req.filecoin_metadata_url,
        kb=req.kb,
        ref=req.ref,
        hook=req.hook
    )

    elif isinstance(req, QueryInputSchema):
        url = 'https://rag-api.eternalai.org/api/query?query={}&top_k={}&kb={}&threshold={}'.format(
            req.query, req.top_k, req.kb, req.threshold
        )

        msg = '''<strong>Received a request to query:</strong>\n
<i> 
<b>Query:</b> {query}
<b>Top_K:</b> {top_k}
<b>KB:</b> {kb}
<b>Threshold:</b> {threshold}
</i>
'''.format(
        query=req.query,
        top_k=req.top_k,
        kb=req.kb,
        threshold=req.threshold
    )

    elif isinstance(req, str):
        msg = req
        
    else:
        logger.error("Unsupported type for notification: {}".format(type(req)))
        return

    await sync2async(telegram_kit.send_message)(
        msg,
        room=const.TELEGRAM_ROOM,
        fmt='HTML',
        schedule=True,
        preview_opt={
            "is_disabled": True,
        }
    )
    
