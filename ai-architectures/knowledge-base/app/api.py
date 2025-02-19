from .io import export_collection_data, notify_action
from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from .models import ResponseMessage
from .models import (
    InsertInputSchema, 
    UpdateInputSchema, 
    QueryInputSchema,
    ResponseMessage,
    APIStatus,
    QueryResult
)
import logging

from .handlers import process_data, run_query, get_sample, drop_kb
from .utils import get_tmp_directory, iter_file
from .embedding import get_default_embedding_model
from app.state import get_insertion_request_handler
import shutil
import os
from functools import partial
from typing import List

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["api"],  
    responses={404: {"description": "Not found"}},
)

@router.post("/insert", response_model=ResponseMessage[str])
async def insert(request: InsertInputSchema, background_tasks: BackgroundTasks) -> ResponseMessage[str]:
    handler = get_insertion_request_handler()
    handler.insert(request)

    background_tasks.add_task(
        process_data, 
        request, 
        get_default_embedding_model()
    )

    if not request.is_re_submit:
        background_tasks.add_task(
            notify_action,
            request
        )

    return ResponseMessage[str](
        result="successfully submitted documents", 
        status=APIStatus.OK
    )

@router.post("/update", response_model = ResponseMessage[str])
async def update(request: UpdateInputSchema, background_tasks: BackgroundTasks) -> ResponseMessage[str]:
    handler = get_insertion_request_handler()
    handler.insert(request)

    background_tasks.add_task(
        process_data, 
        request, 
        get_default_embedding_model()
    )

    if not request.is_re_submit:
        background_tasks.add_task(
            notify_action,
            request
        )

    return ResponseMessage[str](
        result="successfully submitted documents", 
        status=APIStatus.OK
    )

@router.post("/query", response_model=ResponseMessage[List[QueryResult]])
async def query(request: QueryInputSchema, background_tasks: BackgroundTasks) -> ResponseMessage[List[QueryResult]]:
    return ResponseMessage[List[QueryResult]](result=await run_query(request))

@router.get("/sample", response_model=ResponseMessage[List[QueryResult]])
async def sample(kb: str, k: int) -> ResponseMessage[List[QueryResult]]:
    return ResponseMessage[List[QueryResult]](result=await get_sample(kb, k))

@router.delete("/delete", response_model=ResponseMessage[str])
async def delete(kb: str, background_tasks: BackgroundTasks) -> ResponseMessage[str]:
    background_tasks.add_task(
        notify_action, 
        "<strong>Deleting</strong> all documents in knowledge base <strong>{}</strong>".format(kb)
    )

    return ResponseMessage[str](result="{} documents deleted".format(await drop_kb(kb)))

@router.get("/stat", response_model=ResponseMessage[str], include_in_schema=False)
async def stat() -> ResponseMessage[str]:
    return ResponseMessage[str](result="OK")

@router.get("/progress", response_model=ResponseMessage[str], include_in_schema=False)
async def stat() -> ResponseMessage[str]:
    return ResponseMessage[str](result="OK")
 
@router.get("/export", include_in_schema=False)
async def export(collection_name: str, background_tasks: BackgroundTasks) -> StreamingResponse:
    ws = get_tmp_directory()
    os.makedirs(ws, exist_ok=True)

    shutil_rmtree = partial(shutil.rmtree, ws, ignore_errors=True)

    background_tasks.add_task(shutil_rmtree)

    result_file = await export_collection_data(
        collection_name, ws,
        include_embedding=False, 
        include_identity=True
    )

    file_name = os.path.basename(result_file)

    return StreamingResponse(
        iter_file(result_file), 
        media_type="application/octet-stream", 
        headers={
            "Content-Disposition": f"attachment; filename={file_name}"
        }
    )
