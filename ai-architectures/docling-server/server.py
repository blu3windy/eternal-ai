import logging

logging.basicConfig(level=logging.DEBUG if __debug__ else logging.INFO)
logger = logging.getLogger(__name__)

import asyncio
import uvicorn
import os
from fastapi import FastAPI, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.document_converter import FormatOption, DocumentConverter
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline
from docling.datamodel.base_models import InputFormat
from pydantic import BaseModel, model_validator, Field
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
import shutil
from concurrent.futures import ProcessPoolExecutor
from functools import lru_cache
from enum import Enum
from typing import Generic, TypeVar, Optional, List, Dict
import uuid
from bs4 import BeautifulSoup

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

def sync2async_use_subprocess(sync_func: Callable):
    async def async_func(*args, **kwargs):
        with ProcessPoolExecutor(max_workers=1) as pool:
            return await asyncio.get_event_loop().run_in_executor(
                pool, 
                partial(sync_func, *args, **kwargs)
            )

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


def magic_get_doc(source: str):
    res = DocumentConverter(
        allowed_formats=SUPORTED_DOCUMENT_FORMATS,
        format_options=DOCUMENT_FORMAT_OPTIONS
    ).convert(source=source)
    
    return res.model_dump()

@limit_asyncio_concurrency(4)
async def get_doc_from_url(url) -> LiteConverstionResult:

    res = await sync2async_use_subprocess(
        magic_get_doc
    )(source=url)

    return LiteConverstionResult.model_validate(res)

async def extract_html_content(file_path: str):
    assert file_path.endswith('html')
    
    async with aiofiles.open(file_path, 'r') as fp:
        html_data = await fp.read()

    soup = BeautifulSoup(
        html_data,
        features="html.parser"
    )
    
    # kill all script and style elements
    for script in soup(["script", "style"]):
        await sync2async(script.extract)()    # rip it out
    
    text = await sync2async(soup.get_text)(" ")
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    return [chunk for chunk in chunks if chunk]


async def file_chunking(url: str, tokenizer: str, min_chunk_size: int=10, max_chunk_size: int=512) -> AsyncGenerator:
    if url.endswith('html'):
        url_markdown = url.replace('html', 'md')

        try:
            async with aiofiles.open(url_markdown, 'w') as fp:
                await fp.write('\n\n'.join(await extract_html_content(url)))

            url = url_markdown
        except Exception as err:
            traceback.print_exc()
            pass
    
    try:
        doc: LiteConverstionResult = await get_doc_from_url(url) 
    except Exception as e:
        traceback.print_exc()
        return

    tokenizer = AutoTokenizer.from_pretrained(tokenizer)
    chunker = HybridChunker(
        tokenizer=tokenizer, 
        max_tokens=max_chunk_size
    )

    for item in await sync2async(chunker.chunk)(dl_doc=doc.document):
        text = item.text

        if len(tokenizer.tokenize(text, max_length=None)) >= min_chunk_size:
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


_generic_type = TypeVar('_generic_type')

class APIStatus(str, Enum):
    OK = "ok"
    ERROR = "error"

    PENDING = "pending"
    PROCESSING = "processing"
    NOT_FOUND = "not_found"


class ResponseMessage(BaseModel, Generic[_generic_type]):
    result: Optional[_generic_type] = None
    error: Optional[str] = None
    status: APIStatus = APIStatus.OK
    
    @model_validator(mode="after")
    def refine_status(self):
        if self.error is not None:
            self.status = APIStatus.ERROR
            
        return self

class ChunkingResult(BaseModel):
    id: str = Field(default_factory=lambda: f"doc-{str(uuid.uuid4().hex)}")
    chunks: List[str] = []
    status: APIStatus = APIStatus.PENDING
    message: Optional[str] = None

@lru_cache(1)
def app_tmp_dir():
    res = Path(tempfile.gettempdir()) / "docling-server"
    os.makedirs(res, exist_ok=True)
    return res

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

    def get_random_payload(n=8):
        return os.urandom(n).hex()
    
    async def gen_chunks(filepath: str, tokenizer: str, min_chunk_size: int, max_chunk_size: int):
        res = []

        async for chunk in file_chunking(filepath, tokenizer, min_chunk_size, max_chunk_size):
            res.append(chunk) 

        return res
    
    responses_register: Dict[str, ChunkingResult] = {}
    
    async def background_chunking_task(id: str, filepath: str, tokenizer: str, min_chunk_size: int, max_chunk_size: int):
        global responses_register

        try:
            responses_register[id].chunks = await gen_chunks(
                filepath, 
                tokenizer,
                min_chunk_size,
                max_chunk_size
            )

            responses_register[id].status = APIStatus.OK

        except Exception as err:
            responses_register[id].status = APIStatus.ERROR
            responses_register[id].message = f"Error while generating chunks for the file {filepath}: {err}"

    @api_app.post("/async-submit")
    async def submit(file: UploadFile, background_tasks: BackgroundTasks, tokenizer: str, min_chunk_size: int=10, max_chunk_size: int=512) -> ResponseMessage[str]:

        global responses_register

        resp = ChunkingResult()
        responses_register.setdefault(resp.id, resp)
    
        random_payload = get_random_payload()
        directory: Path = app_tmp_dir() / random_payload  
        os.makedirs(directory, exist_ok=True)
        
        logger.info(f"Saving file to {directory / file.filename}")
        async with aiofiles.open(directory / file.filename, 'wb') as f:
            await f.write(await file.read())
        
        logger.info(f"Saved file to {directory / file.filename}")
        background_tasks.add_task(
            background_chunking_task, 
            resp.id, str(directory / file.filename), tokenizer, min_chunk_size, max_chunk_size
        )

        background_tasks.add_task(
            shutil.rmtree,
            directory, ignore_errors=True
        )

        return ResponseMessage[str](
            result=resp.id,
            status=APIStatus.OK
        )

    @api_app.get("/async-get")
    async def get_result(request_id: str) -> ResponseMessage[ChunkingResult]:
        if request_id not in responses_register:
            return ResponseMessage[ChunkingResult](
                result=ChunkingResult(
                    id=request_id,
                    status=APIStatus.NOT_FOUND
                )
            )

        res = responses_register[request_id]

        if res.status in [APIStatus.ERROR, APIStatus.OK]:
            responses_register.pop(request_id)

        return ResponseMessage[ChunkingResult](
            result=res,
            status=APIStatus.OK
        )

    @api_app.post("/chunks")
    async def chunks(file: UploadFile, tokenizer: str, min_chunk_size: int=10, max_chunk_size: int=512):

        random_payload = get_random_payload()
        directory: Path = app_tmp_dir() / random_payload  
        res = []

        try:
            os.makedirs(directory, exist_ok=True)
            logger.info(f"Saving file to {directory / file.filename}")
        
            async with aiofiles.open(directory / file.filename, 'wb') as f:
                await f.write(await file.read())

            async for chunk in file_chunking(directory / file.filename, tokenizer, min_chunk_size, max_chunk_size):
                res.append(chunk) 

        finally:

            if directory.exists():
                shutil.rmtree(directory, ignore_errors=True)

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
