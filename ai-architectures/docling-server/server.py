import logging

logging.basicConfig(level=logging.DEBUG if __debug__ else logging.INFO)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("requests").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

import asyncio
import uvicorn
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.document_converter import FormatOption, DocumentConverter
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline
from docling.datamodel.base_models import InputFormat
from pydantic import BaseModel
from docling.document_converter import ConversionResult
from starlette.concurrency import run_in_threadpool
from typing import Callable, AsyncGenerator
from functools import partial, wraps
from asyncio import Semaphore as AsyncSemaphore
import traceback
from pathlib import Path
from docling.chunking import HybridChunker
from transformers import AutoTokenizer    
from docling.datamodel.base_models import InputFormat, DocItemLabel
import aiofiles
import tempfile

class LiteInputDocument(BaseModel):
    format: InputFormat

class LiteConverstionResult(ConversionResult):
    input: LiteInputDocument

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

def sync2async(sync_func: Callable):
    async def async_func(*args, **kwargs):
        return await run_in_threadpool(partial(sync_func, *args, **kwargs))
    return async_func if not asyncio.iscoroutinefunction(sync_func) else sync_func

def limit_asyncio_concurrency(num_of_concurrent_calls: int):
    semaphore = AsyncSemaphore(num_of_concurrent_calls)

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            async with semaphore:
                return await func(*args, **kwargs)                
        return wrapper
    return decorator

@limit_asyncio_concurrency(2)
async def get_doc_from_url(url) -> LiteConverstionResult:
    return await sync2async(
        DocumentConverter(
            allowed_formats=SUPORTED_DOCUMENT_FORMATS,
            format_options=DOCUMENT_FORMAT_OPTIONS
        ).convert
    )(source=url)

async def url_chunking(url: str, tokenizer: str, min_chunk_size: int=10, max_chunk_size: int=512) -> AsyncGenerator:
    try:
        doc: LiteConverstionResult = await get_doc_from_url(url) 
    except Exception as e:
        traceback.print_exc()
        return

    is_html = doc.input.format == InputFormat.HTML

    tokenizer = AutoTokenizer.from_pretrained(tokenizer)
    chunker = HybridChunker(
        tokenizer=tokenizer, 
        max_tokens=max_chunk_size
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

        if len(tokenizer.tokenize(text, max_length=None)) >= min_chunk_size \
            and any([k in item_labels for k in captured_items]):
            yield text

class EndpointFilter(logging.Filter):
    def filter(self, record):
        # Exclude specific endpoints
        excluded_endpoints = ["GET / HTTP"]
        if any(endpoint in record.getMessage() for endpoint in excluded_endpoints):
            return False
        return True

# Custom logging configuration
logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "endpoint_filter": {
            "()": EndpointFilter
        }
    },
    "handlers": {
        "default": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "filters": ["endpoint_filter"]
        }
    },
    "loggers": {
        "uvicorn.access": {
            "handlers": ["default"],
            "level": "INFO",
            "propagate": False,
        }
    },
}

if __name__ == "__main__":
    api_app = FastAPI()

    HOST = os.environ.get("SERVER_HOST", "0.0.0.0")
    PORT = int(os.environ.get("SERVER_PORT", 8000))

    @api_app.get("/", name="Health Check")
    async def read_root():
        return JSONResponse(
            {
                "status": "API is healthy"
            },
            status_code=200
        )

    @api_app.post("/chunking")
    async def chunking(file: UploadFile, tokenizer: str, min_chunk_size: int=10, max_chunk_size: int=512):
        file_path = Path(tempfile.gettempdir()) / file.filename
        res = []

        try:
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(await file.read())

            async for chunk in url_chunking(file_path, tokenizer, min_chunk_size, max_chunk_size):
                res.append(chunk) 

        finally:
            os.remove(file_path) 

        return JSONResponse(
            {
                "status": "success",
                "chunks": res
            },
            status_code=200
        )    

    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)

    config = uvicorn.Config(
        api_app, 
        loop=event_loop,
        host=HOST,
        port=PORT,
        log_level="info",
        timeout_keep_alive=300,
        log_config=logging_config
    )

    server = uvicorn.Server(config)
    event_loop.run_until_complete(server.serve())
