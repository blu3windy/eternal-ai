from app.handlers import download_filecoin_item, logger
from app.models import FilecoinData, InsertInputSchema, InsertProgressCallback, InsertResponse, QueryInputSchema, ResponseMessage, UpdateInputSchema
from app.utils import limit_asyncio_concurrency, sync2async, sync2async_in_subprocess
from app.wrappers import milvus_kit, telegram_kit
from typing import List, Union
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