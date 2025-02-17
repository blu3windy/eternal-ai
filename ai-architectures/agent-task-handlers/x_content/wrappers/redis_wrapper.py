import redis
from redis import asyncio as aredis
from typing import Callable
import logging
from x_content import constants as const
import pickle
import asyncio
from functools import lru_cache

logger = logging.getLogger(__name__)
cfg = dict(
    host=const.REDIS_HOST,
    port=const.REDIS_PORT,
    db=const.REDIS_DB,
    password=const.REDIS_PASSWORD,
)

def is_asyncio_context() -> bool:
    try:
        asyncio.get_running_loop()
        return True
    except RuntimeError:
        return False


@lru_cache(maxsize=1)
def get_redis_connection_pool() -> redis.ConnectionPool:
    global cfg
    return redis.ConnectionPool(**cfg)

@lru_cache(maxsize=1)
def get_aio_redis_connection_pool() -> aredis.ConnectionPool:
    global cfg
    return aredis.ConnectionPool(**cfg)

from typing import Callable

def atomic_check_and_set_flag(
    key: str, value: str, timeout: float
) -> bool:
    atomic_script = """
    local current_value = redis.call('GET', KEYS[1])
    if current_value == false then
        redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
        return true
    end
    return false
    """

    with redis.Redis(
        connection_pool=get_redis_connection_pool()
    ) as redis_client:
        result = redis_client.eval(
            atomic_script, 1, key, value, timeout
        )

    return result


def distributed_scheduling_job(interval_seconds: float):
    def decorator(func: Callable):
        def wrapper(*args, **kwargs):
            fn_name = func.__name__
            fn_module = func.__module__

            redis_cache_key = f"{fn_module}.{fn_name}:executed"

            do_execute = atomic_check_and_set_flag(
                redis_cache_key, "1", interval_seconds
            )

            if not do_execute:
                # logger.info(f"Function {fn_name} is already executed in the last {interval_seconds} seconds")
                return None

            return func(*args, **kwargs)

        return wrapper

    return decorator


def cache_for(interval_seconds: float) -> Callable:

    def get_parameters_hash(*args, **kwargs):
        return hash((*args, *sorted(kwargs.items())))

    def decorator(func: Callable) -> Callable:
        fn_name = func.__name__
        fn_module = func.__module__
        redis_cache_key = f"{fn_module}.{fn_name}:result"

        def sync_wrapper(*args, **kwargs):
            nonlocal redis_cache_key

            key = f"{redis_cache_key}:{get_parameters_hash(*args, **kwargs)}"
            
            with redis.Redis(connection_pool=get_redis_connection_pool()) as redis_client:
                if redis_client is not None:
                    pickle_str = redis_client.get(key)

                    if pickle_str is not None:
                        logger.info(
                            f"Cache hit for {key}; call {fn_module}.{fn_name}(args={args}, kwargs={kwargs})"
                        )
                        return pickle.loads(pickle_str)

                res = func(*args, **kwargs)

                if redis_client is not None:
                    pickle_str = pickle.dumps(res)
                    redis_client.set(key, pickle_str, ex=interval_seconds)

                return res

        async def async_wrapper(*args, **kwargs):
            nonlocal redis_cache_key

            key = f"{redis_cache_key}:{get_parameters_hash(*args, **kwargs)}"
            
            async with aredis.Redis(
                connection_pool=get_aio_redis_connection_pool()
            ) as redis_client:
                if redis_client is not None:
                    pickle_str = await redis_client.get(key)

                    if pickle_str is not None:
                        logger.info(
                            f"Cache hit for {key}; call {fn_module}.{fn_name}(args={args}, kwargs={kwargs})"
                        )
                        return pickle.loads(pickle_str)

                res = await func(*args, **kwargs)

                if redis_client is not None:
                    pickle_str = pickle.dumps(res)
                    await redis_client.set(key, pickle_str, ex=interval_seconds)

            return res

        if asyncio.iscoroutinefunction(func):
            return async_wrapper

        return sync_wrapper

    return decorator
