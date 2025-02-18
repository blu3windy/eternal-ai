from x_content.wrappers import redis_wrapper
from redis import asyncio as aredis, Redis
import json
from functools import reduce
from x_content import constants as const
from x_content.wrappers.log_decorators import log_function_call

# TODO: reduce code duplication here


class ConversationRedisCache(object):

    def __init__(self):
        self.cache_expiry = 7 * 24 * 3600  # Cache entries for 30 days

    def _get_key(self, username):
        return f"mentioned_tweets_{username}"  # Key already used in production cannot be changed

    def is_threshold_exceeded(
        self, username, root_conversation_id, max_num_tweets_in_conversation=1
    ):
        mentioned_tweets_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(mentioned_tweets_redis_key):
                return False

            try:
                conversation_dict: dict = json.loads(
                    cli.get(mentioned_tweets_redis_key)
                )
            except Exception as e:
                cli.delete(mentioned_tweets_redis_key)
                return False

        cached_tweets_by_root_conversation = conversation_dict.get(
            root_conversation_id, []
        )

        return (
            len(cached_tweets_by_root_conversation)
            >= max_num_tweets_in_conversation
        )

    @log_function_call
    def add_tweet_to_conversation(
        self, username, root_conversation_id, tweet_object
    ):
        mentioned_tweets_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(mentioned_tweets_redis_key):
                cli.set(
                    mentioned_tweets_redis_key,
                    json.dumps({}),
                    ex=self.cache_expiry,
                )

            conversation_dict: dict = json.loads(
                cli.get(mentioned_tweets_redis_key)
            )

            cached_tweets_by_root_conversation = conversation_dict.get(
                root_conversation_id, []
            )

            cached_tweets_by_root_conversation.append(tweet_object)
            conversation_dict[root_conversation_id] = (
                cached_tweets_by_root_conversation
            )

            cli.set(
                mentioned_tweets_redis_key,
                json.dumps(conversation_dict),
                ex=self.cache_expiry,
            )


class GameRedisCache(object):
    # Redis key prefixes organized by folder structure
    GAMES_PREFIX = "games:"
    GAMES_LOCK_PREFIX = f"{GAMES_PREFIX}locks/"
    GAMES_STATUS_PREFIX = f"{GAMES_PREFIX}status/"
    GAMES_RUNNING_PREFIX = f"{GAMES_PREFIX}running/"
    GAMES_FACT_CHECK_PREFIX = f"{GAMES_PREFIX}fact_check/"

    def __init__(self):
        self.cache_expiry = const.GAME_REDIS_CACHE  # Using existing constant
        self.fact_check_expiry = 3600  # 60 minutes in seconds

    def get_game_status(self, tweet_id: str) -> str | None:
        key = f"{self.GAMES_STATUS_PREFIX}{tweet_id}"

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            value: bytes = cli.get(key)

        return "" if value == None else value.decode()

    def set_game_status(self, tweet_id: str, status: str) -> bool:
        key = f"{self.GAMES_STATUS_PREFIX}{tweet_id}"

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.set(key, status, ex=self.cache_expiry)

    def add_running_game(self, tweet_id: str, status: str) -> bool:
        try:
            with Redis(
                connection_pool=redis_wrapper.get_redis_connection_pool()
            ) as cli:
                with cli.pipeline() as pipe:
                    pipe.multi()
                    pipe.set(
                        f"{self.GAMES_STATUS_PREFIX}{tweet_id}",
                        status,
                        ex=self.cache_expiry,
                    )
                    pipe.sadd(f"{self.GAMES_RUNNING_PREFIX}list", tweet_id)
                    pipe.execute()

            return True
        except Exception as err:
            raise err

    def remove_running_game(self, tweet_id: str, status: str) -> bool:
        try:
            with Redis(
                connection_pool=redis_wrapper.get_redis_connection_pool()
            ) as cli:

                with cli.pipeline() as pipe:
                    pipe.multi()
                    pipe.set(
                        f"{self.GAMES_STATUS_PREFIX}{tweet_id}",
                        status,
                        ex=self.cache_expiry,
                    )
                    pipe.srem(f"{self.GAMES_RUNNING_PREFIX}list", tweet_id)
                    pipe.execute()

            return True
        except Exception as err:
            raise err

    def get_running_games(self) -> set[str]:
        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.smembers(f"{self.GAMES_RUNNING_PREFIX}list")

    def acquire_create_game_lock(self, _tweet_id, expiry_ms: int) -> bool:
        return self._acquire_lock(
            f"{self.GAMES_LOCK_PREFIX}create/{_tweet_id}", expiry_ms
        )

    def acquire_judge_game_lock(self, _tweet_id, expiry_ms: int) -> bool:
        return self._acquire_lock(
            f"{self.GAMES_LOCK_PREFIX}judge/{_tweet_id}", expiry_ms
        )

    def release_create_game_lock(self, tweet_id: str) -> bool:
        lock_key = f"{self.GAMES_LOCK_PREFIX}create/{tweet_id}"

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.delete(lock_key) > 0

    def release_judge_game_lock(self, tweet_id: str) -> bool:
        lock_key = f"{self.GAMES_LOCK_PREFIX}judge/{tweet_id}"
        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.delete(lock_key) > 0

    def _acquire_lock(self, lock_key: str, expiry_ms: int) -> bool:
        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.set(lock_key, "1", nx=True, px=expiry_ms)

    def get_fact_check(self, tweet_id: str) -> dict | None:
        """Get cached fact check response for a tweet."""
        key = f"{self.GAMES_FACT_CHECK_PREFIX}{tweet_id}"
        value = self.redis_client.get(key)
        return json.loads(value) if value else None

    def set_fact_check(self, tweet_id: str, response_dict: dict) -> bool:
        """Cache fact check response for a tweet."""
        key = f"{self.GAMES_FACT_CHECK_PREFIX}{tweet_id}"
        return self.redis_client.set(
            key, json.dumps(response_dict), ex=self.fact_check_expiry
        )

class ShadowReplyRedisCache(object):

    def __init__(self):
        self.cache_expiry = 7 * 24 * 3600  # Cache entries for 30 days

    def _get_key(self, username):
        return f"shadow_reply_tweets:{username}"  # Key already used in production cannot be changed

    def is_threshold_exceeded(self, username, tweet_id, max_num_reply=1):
        shadow_replied_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(shadow_replied_redis_key):
                return False
            shadow_reply_dict = json.loads(cli.get(shadow_replied_redis_key))

        replies_count = shadow_reply_dict.get(tweet_id, 0)
        return replies_count >= max_num_reply

    def add_reply(self, username, tweet_id):
        shadow_replied_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(shadow_replied_redis_key):
                cli.set(
                    shadow_replied_redis_key,
                    json.dumps({}),
                    ex=self.cache_expiry,
                )
            shadow_reply_dict = json.loads(cli.get(shadow_replied_redis_key))

            replies_count = shadow_reply_dict.get(tweet_id, 0)
            shadow_reply_dict[tweet_id] = replies_count + 1
            cli.set(
                shadow_replied_redis_key,
                json.dumps(shadow_reply_dict),
                ex=self.cache_expiry,
            )


class TweetInfoRedisCache(object):

    def __init__(self):
        self.cache_expiry = 1 * 24 * 3600  # Cache entries for 30 days

    def _get_key(self, tweet_id):
        return f"tweet_info:{tweet_id}"

    def commit(self, tweet_info):
        tweet_id = tweet_info["tweet_object"]["tweet_id"]
        key = self._get_key(tweet_id)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            cli.set(key, json.dumps(tweet_info), ex=self.cache_expiry)

    def get(self, tweet_id):
        key = self._get_key(tweet_id)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            return cli.get(key)


class FollowingListRedisCache(object):

    def __init__(self):
        self.cache_expiry = 1 * 3600  # Cache entries for 6 hours # days

    def _get_key(self, username):
        return f"following-detail-1:{username}"

    def commit(self, username, following):
        key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            cli.set(key, json.dumps(following), ex=self.cache_expiry)

    def get(self, username):
        key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            cli.get(key)


class TweetInscriptionRedisCache(object):

    def __init__(self, max_inscription=1):
        self.cache_expiry = 1 * 24 * 3600  # Cache entries for 30 days
        self.max_inscription = max_inscription

    def _get_key(self, username):
        return f"tweet-inscription:{username}"

    def add_inscription(self, username, request_id, tweet_id):
        inscribe_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(inscribe_redis_key):
                cli.set(
                    inscribe_redis_key, json.dumps({}), ex=self.cache_expiry
                )

            inscribe_dict = json.loads(cli.get(inscribe_redis_key))

            inscription_list = inscribe_dict.get(request_id, [])
            inscription_list.append(tweet_id)
            inscribe_dict[request_id] = inscription_list

            cli.set(
                inscribe_redis_key,
                json.dumps(inscribe_dict),
                ex=self.cache_expiry,
            )

    def is_threshold_exceeded(self, username, request_id):
        inscribe_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(inscribe_redis_key):
                return False

            inscribe_dict: dict = json.loads(cli.get(inscribe_redis_key))

        inscription_list = inscribe_dict.get(request_id, [])
        return len(inscription_list) >= self.max_inscription

    def is_tweet_id(self, tweet_id):
        return len(tweet_id) <= 20

    def get_inscribed_tweets_ids(self, username):
        inscribe_redis_key = self._get_key(username)

        with Redis(
            connection_pool=redis_wrapper.get_redis_connection_pool()
        ) as cli:
            if not cli.exists(inscribe_redis_key):
                return []

            inscribe_dict: dict[str, list] = json.loads(
                cli.get(inscribe_redis_key)
            )

        values = inscribe_dict.values()
        ids_and_contents = list(reduce(lambda x, y: x + y, values, []))
        ids = list(filter(lambda x: self.is_tweet_id(x), ids_and_contents))

        return ids
