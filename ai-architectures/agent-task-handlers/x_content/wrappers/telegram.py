import json
import logging
from x_content import constants as const
import schedule
import httpx
import requests
from typing import List, Dict
from redis import asyncio as aredis, Redis
from .redis_wrapper import get_redis_connection_pool, get_aio_redis_connection_pool
from functools import lru_cache

TELEGRAM_ROOM = const.TELEGRAM_ROOM
TELEGRAM_ALERT_ROOM = const.TELEGRAM_ALERT_ROOM
TELEGRAM_TASK_IO_NOTIFICATION_ROOM = const.TELEGRAM_TASK_IO_NOTIFICATION_ROOM

logger = logging.getLogger(__name__)

from pydantic import BaseModel
from .redis_wrapper import distributed_scheduling_job

class TelegramMessage(BaseModel):
    text: str
    sender: str = "junk_notifications"
    parse_mode: str = "HTML"
    disable_notification: bool = True
    link_preview_options: dict = {}
    room: str

    can_batch: bool = False


def _get_url(
    api_key: str = const.TELEGRAM_API_KEY, 
    room: str = const.TELEGRAM_ROOM
):
    return f"https://api.telegram.org/bot{api_key}/sendMessage?chat_id={room}"

@lru_cache(maxsize=1)
def _get_httpx_async_client():
    return httpx.AsyncClient()

async def a_send_message(
    twitter_username: str,
    message_to_send: str,
    preview_opt={},
    fmt="HTML",
    room=const.TELEGRAM_ROOM,
    schedule=False,
):
    twitter_username = twitter_username or "junk_notifications"

    if (
        twitter_username == "junk_nofitications"
        and const.DISABLE_JUNK_NOTIFICATIONS
    ):
        return False

    if twitter_username in const.DISABLED_TELEGRAM_USERS:
        return False

    if schedule:
        await _a_enqueue(
            TelegramMessage(
                text=message_to_send,
                sender=const.TELEGRAM_BOTNAME,
                parse_mode=fmt,
                disable_notification=True,
                link_preview_options=preview_opt,
                room=room,
                can_batch=True,
            )
        )

        return True

    logger.info(
        f"Sending a message of length {len(message_to_send)} to room {room}"
    )

    resp = await _get_httpx_async_client().post(
        _get_url(room=room), 
        json={
            "text": message_to_send,
            "parse_mode": fmt,
            "disable_notification": True,
            "link_preview_options": json.dumps(preview_opt),
        }
    )

    if resp.status_code == 200:
        return True

    logger.error(f"Failed to send message to Telegram: {resp.text}")
    return False


def send_message(
    twitter_username: str,
    message_to_send: str,
    preview_opt={},
    fmt="HTML",
    room=const.TELEGRAM_ROOM,
    schedule=False,
):
    twitter_username = twitter_username or "junk_notifications"

    if (
        twitter_username == "junk_nofitications"
        and const.DISABLE_JUNK_NOTIFICATIONS
    ):
        return False

    if twitter_username in const.DISABLED_TELEGRAM_USERS:
        return False

    if schedule:
        _enqueue(
            TelegramMessage(
                text=message_to_send,
                sender=const.TELEGRAM_BOTNAME,
                parse_mode=fmt,
                disable_notification=True,
                link_preview_options=preview_opt,
                room=room,
                can_batch=True,
            )
        )

        return True

    logger.info(
        f"Sending a message of length {len(message_to_send)} to room {room}"
    )

    resp = requests.post(
        _get_url(room=room), 
        json={
            "text": message_to_send,
            "parse_mode": fmt,
            "disable_notification": True,
            "link_preview_options": json.dumps(preview_opt),
        }
    )

    if resp.status_code == 200:
        return True

    logger.error(f"Failed to send message to Telegram: {resp.text}")
    return False


async def _a_enqueue(msg: TelegramMessage):
    async with aredis.Redis(
        connection_pool=get_aio_redis_connection_pool()
    ) as redis:
        await redis.rpush(
            const.TELEGRAM_MESSAGE_LIST_REDIS_KEY, 
            json.dumps(msg.model_dump())
        )
        

def _enqueue(msg: TelegramMessage):
    with Redis(
        connection_pool=get_redis_connection_pool()
    ) as redis:
        redis.rpush(
            const.TELEGRAM_MESSAGE_LIST_REDIS_KEY, 
            json.dumps(msg.model_dump())
        )

def group_message(
    msgs: List[TelegramMessage],
    separator: str,
    limit_chars: int = const.TELEGRAM_MESSAGE_LENGTH_LIMIT,
) -> List[List[TelegramMessage]]:
    """
    Groups messages into a single message if the total length of the messages is less than the limit.
    """
    total_length = 0
    grouped_msgs = []
    current_group = []

    for msg in msgs:
        need_separator = len(current_group) > 0
        l_separator = len(separator) if need_separator else 0

        if total_length + len(msg.text) + l_separator > limit_chars:
            grouped_msgs.append(current_group)
            current_group = []
            total_length = 0

        current_group.append(msg)
        total_length += len(msg.text) + l_separator

    if len(current_group) > 0:
        grouped_msgs.append(current_group)

    return grouped_msgs

@distributed_scheduling_job(interval_seconds=20)
def _flush():
    with Redis(
        connection_pool=get_redis_connection_pool()
    ) as cli:

        length_queue = cli.llen(const.TELEGRAM_MESSAGE_LIST_REDIS_KEY)
        by_room: Dict[str, List] = {}

        for msg in range(length_queue):
            msg = cli.lpop(const.TELEGRAM_MESSAGE_LIST_REDIS_KEY)

            try:
                msg = TelegramMessage.model_validate(json.loads(msg))
            except Exception as e:
                logger.error(f"Failed to parse message: {msg}")
                continue

            if not msg.can_batch:
                requests.post(
                    _get_url(room=room),
                    json={
                        "text": msg.text,
                        "parse_mode": msg.parse_mode,
                        "disable_notification": msg.disable_notification,
                        "link_preview_options": json.dumps(msg.link_preview_options),
                    },
                )

                continue

            if msg.room not in by_room:
                by_room[msg.room] = []

            by_room[msg.room].append(msg)

    sep = "\n" + "-" * 20 + "\n"

    for room, msgs in by_room.items():
        groups = group_message(msgs, sep)

        for group in groups:
            joint_message = sep.join(
                [msg.text for msg in group]
            )
            
            requests.post(
                _get_url(room=room),
                json={
                    "text": joint_message,
                    "parse_mode": "HTML",
                    "disable_notification": True,
                    "link_preview_options": json.dumps({}),
                },
            )

schedule.every(20).seconds.do(_flush)