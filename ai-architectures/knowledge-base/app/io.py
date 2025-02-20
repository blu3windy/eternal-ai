from app.models import FilecoinData, InsertInputSchema, InsertProgressCallback, InsertResponse, QueryInputSchema, ResponseMessage, UpdateInputSchema
from app.utils import limit_asyncio_concurrency, sync2async, sync2async_in_subprocess
from app.wrappers import milvus_kit, telegram_kit
from typing import List, Union, Optional, AsyncGenerator
import httpx
from pymilvus import MilvusClient
import json
import logging
import os
import zipfile
from . import constants as const
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.document_converter import DocumentConverter, FormatOption
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline
import numpy as np
import logging
from docling.document_converter import ConversionResult
from pydantic import BaseModel
from docling.datamodel.base_models import InputFormat
import re
import aiofiles
import subprocess
import asyncio
from pathlib import Path
import html
import traceback

class LiteInputDocument(BaseModel):
    format: InputFormat

class LiteConverstionResult(ConversionResult):
    input: LiteInputDocument

logger = logging.getLogger(__name__)

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
    scanned = 0

    while True:
        batch = await sync2async(it.next)()

        if len(batch) == 0:
            break
        
        scanned += len(batch)

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

        logger.info(f"Exported {len(hashes)} (over {scanned}; {100 * len(hashes) / scanned:.2f}%)...")

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

from docling.datamodel.base_models import InputFormat

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

DOCUMENT_FORMAT_OPTIONS = {
    InputFormat.PDF: FormatOption(
        pipeline_cls=StandardPdfPipeline,
        backend=PyPdfiumDocumentBackend,
        pipeline_options=PdfPipelineOptions(
            do_table_structure=False,
            do_ocr=False
        )
    )
}


def docling_document_conversion_wrapper(source):
    res = DocumentConverter(
        allowed_formats=SUPORTED_DOCUMENT_FORMATS,
        format_options=DOCUMENT_FORMAT_OPTIONS
    ).convert(source=source)
    
    if res is None:
        raise Exception("Failed to convert document to docling format")

    return res.model_dump()

@limit_asyncio_concurrency(2)
async def get_doc_from_url(url) -> LiteConverstionResult:
    res = await sync2async_in_subprocess(docling_document_conversion_wrapper)(source=url)
    return LiteConverstionResult.model_validate(res)


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



@limit_asyncio_concurrency(4)
async def download_file(
    session: httpx.AsyncClient, url: str, path: str
):
    async with session.stream("GET", url) as response:
        response.raise_for_status()

        async with aiofiles.open(path, 'wb') as f:
            async for chunk in response.aiter_bytes(8192):
                await f.write(chunk)

    logger.info(f"Downloaded {path}")
    
async def unescape_html_file(s: str):
    if not s.endswith('html'):
        return s
    
    with open(s, 'r') as f:
        content = f.read()

    with open(s, 'w') as f:
        f.write(await sync2async(html.unescape)(content))
        
    return s

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
            part_url = f"{const.GATEWAY_IPFS_PREFIX}/{part['hash']}"
            part_path = Path(tmp_dir) / part['name']
            tasks.append(download_file(session, part_url, part_path))
            zip_parts.append(part_path)

        await asyncio.gather(*tasks)

        name = metadata['name']
        destination = Path(tmp_dir) / name
        command = f"cat {tmp_dir}/{name}.zip.part-* | pigz -p 2 -d | tar -xf - -C {tmp_dir}"

        await sync2async(subprocess.run)(
            command, shell=True, check=True
        )

        logger.info(f"Successfully extracted files to {destination}")
        afiles = []

        for root, dirs, files in os.walk(destination):
            for file in files:
                fpath = os.path.join(root, file)
                await unescape_html_file(str(fpath))
                afiles.append(fpath)

        if len(afiles) > 0:
            return FilecoinData(
                identifier=identifier,
                address=afiles[0]
            )

        logger.warning(f"No files extracted from {destination}")

    else:
        url = f"{const.GATEWAY_IPFS_PREFIX}/{metadata['files'][0]['hash']}"
        path = Path(tmp_dir) / metadata['files'][0]['name']

        await download_file(session, url, path)
        await unescape_html_file(str(path))

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

@limit_asyncio_concurrency(4)
async def call_docling_server(
    file_path: str, 
    embedding_model_name: str, 
    min_chunk_size=10, 
    max_chunk_size=512,
    retry=5
) -> List[str]:  
    assert os.path.exists(file_path), f"File not found: {file_path}"

    for i in range(1 + retry):
        try:
            async with httpx.AsyncClient() as cli:
                with open(file_path, 'rb') as fp:
                    resp = await cli.post(
                        const.DOCLING_SERVER_URL + "/chunks",
                        files={
                            'file': fp
                        },
                        params={
                            "min_chunk_size": min_chunk_size,
                            "max_chunk_size": max_chunk_size,
                            "tokenizer": embedding_model_name
                        },
                        timeout=httpx.Timeout(120)
                    )

            if resp.status_code == 200:
                resp_json = resp.json()
                return resp_json['chunks']      

            else:
                logger.error(f"Failed to chunk file: {resp.text}")
                
        except Exception as err:
            traceback.print_exc()
            logger.error("Failed while communicating to docling server: {}".format(err))

        await asyncio.sleep(2 ** i)

    raise Exception(f"Chunking failed after all {retry} attempts")