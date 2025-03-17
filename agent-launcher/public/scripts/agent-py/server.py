import logging
logging.basicConfig(level=logging.DEBUG if __debug__ else logging.INFO)

import fastapi
import uvicorn
import asyncio
from argparse import ArgumentParser
from dotenv import load_dotenv
from app import prompt
from typing import Callable
from starlette.concurrency import run_in_threadpool
from functools import partial, wraps

logger = logging.getLogger(__name__)

if not load_dotenv():
    logger.warning("hehe, .env not found")
    
def sync2async(sync_func: Callable):
    async def async_func(*args, **kwargs):
        return await run_in_threadpool(partial(sync_func, *args, **kwargs))
    return async_func if not asyncio.iscoroutinefunction(sync_func) else sync_func

def limit_asyncio_concurrency(num_of_concurrent_calls: int):
    semaphore = asyncio.Semaphore(num_of_concurrent_calls)

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            async with semaphore:
                return await func(*args, **kwargs)                
        return wrapper
    return decorator

def parse_args():
    parser = ArgumentParser(
        add_help="Yo!"
    )

    parser.add_argument(
        "-host", "--host",
        type=str,
        help="host",
        default="0.0.0.0",
        required=False
    )
    
    parser.add_argument(
        "-port", "--port",
        type=int,
        help="port",
        default=80,
        required=False
    )
    
    parser.add_argument(
        "-log", "--log-level",
        type=str,
        help="log level",
        default="info",
        required=False
    )
    
    parser.add_argument(
        "-tka", "--timeout-keep-alive",
        type=int,
        help="timeout keep alive",
        default=300,
        required=False
    )
    
    parser.add_argument(
        "-ncc", "--num-of-concurrent-calls",
        type=int,
        default=-1,
        help="num of concurrent calls. -1 for no limit",
        required=False
    )

    return parser.parse_args()  

options = parse_args()

def serve():
    api_app = fastapi.FastAPI()

    # pre-setup
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)    

    config = uvicorn.Config(
        api_app,
        loop=event_loop,
        host=options.host,
        port=options.port,
        log_level="info",
        timeout_keep_alive=options.timeout_keep_alive,
    )

    server = uvicorn.Server(config)

    if not asyncio.iscoroutinefunction(prompt):
        async_prompt = sync2async(prompt)
    else:
        async_prompt = prompt

    assert options.num_of_concurrent_calls != 0, "num_of_concurrent_calls cannot be 0"

    if options.num_of_concurrent_calls > 0:
        async_prompt = limit_asyncio_concurrency(options.num_of_concurrent_calls)(
            async_prompt
        )

    @api_app.post("/prompt")
    async def prompt_handler(body: dict):
        nonlocal async_prompt
        return await async_prompt(
            body.get('messages'), 
            **{
                k: v
                for k, v in body.items()
                if k != "messages"
            }
        )

    event_loop.run_until_complete(server.serve())

if __name__ == '__main__':
    serve()