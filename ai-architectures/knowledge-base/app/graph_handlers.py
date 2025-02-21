import httpx
import json_repair
from . import constants as const
from typing import List, Dict, Union
import json
import logging
logger = logging.getLogger(__name__)
from functools import lru_cache
from .utils import limit_asyncio_concurrency

@limit_asyncio_concurrency(const.MAX_NUM_CONCURRENT_LLM_CALL * 1.5)
async def call_llm_priotized(messages: List[Dict[str, str]]):

    payload = {
        "model": const.MODEL_NAME,
        "messages": messages,
        "temperature": const.DEFAULT_LLM_TEMPERATURE,
        "seed": const.DEFAULT_LLM_SEED,
        "max_tokens": const.DEFAULT_LLM_MAX_TOKENS 
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {const.LLM_API_KEY}"
    }
    
    logger.debug(f"Payload: {payload}")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            const.LLM_API_BASE + "/chat/completions", 
            headers=headers, 
            json=payload,
            timeout=httpx.Timeout(300)
        )

    if response.status_code != 200:
        logger.debug(f"Response: {response.text}")
        return None

    response_json = response.json()
    content = response_json["choices"][0]["message"]["content"]

    return content

@limit_asyncio_concurrency(const.MAX_NUM_CONCURRENT_LLM_CALL)
async def call_llm(messages: List[Dict[str, str]]):
    return await call_llm_priotized(messages)

from pydantic import BaseModel, model_validator
from .models import ResponseMessage

class Triplet(BaseModel):
    s1: str 
    s2: str
    relation: str
    
    def fact(self) -> str:
        return "{} {} {}".format(
            self.s1, self.relation, self.s2
        )
    
    @model_validator(mode='before')
    def from_list(cls, data: Union[List[str], Dict[str, str]]) -> Dict[str, str]:
        if isinstance(data, list):
            assert (
                len(data) >= 3 and all(isinstance(s, str) for s in data[:3]), 
                "The list of data must present at least 3 string values"
            )

            return {
                "s1": data[0],
                "relation": data[1],
                "s2": data[2]
            }

        assert (
            all(k in data and isinstance(data[k], str) 
                for k in ['s1', 's2', 'relation']),
            "Missing key(s) to construct triplet. Requires s1, s2 and relation"
        )

        return {
            "s1": data["s1"],
            "relation": data["relation"],
            "s2": data["s2"]
        } 

class GraphKnowledge:
    def __init__(
        self, 
        graph_system_prompt: str = const.GRAPH_SYSTEM_PROMPT,
        ner_system_prompt: str = const.NER_SYSTEM_PROMPT,
        refine_query_system_prompt: str = const.REFINE_QUERY_SYSTEM_PROMPT
    ):
        self.graph_system_prompt: str = graph_system_prompt 
        self.ner_system_prompt: str = ner_system_prompt
        self.refine_query_system_prompt: str = refine_query_system_prompt

    async def construct_graph_from_chunk(self, chunk: str) -> ResponseMessage[List[Triplet]]:
        messages = [
            {
                "role": "system",
                "content": self.graph_system_prompt
            },
            {
                "role": "user",
                "content": f"This is the passage:\n{chunk}" 
            }
        ]

        result  = await call_llm(messages) 

        if result is None:
            return ResponseMessage[List[Triplet]](
                error="LLM inference failed"
            )

        json_start, json_end = result.find("{"), result.rfind("}") + 1
        
        if -1 in (json_start, json_end):
            return ResponseMessage[List[Triplet]](
                error=f"No data from LLM, expect a JSON returned. Received: {result}"
            )

        try:
            json_result = json_repair.repair_json(
                result[json_start:json_end], 
                return_objects=True
            )
        except json.JSONDecodeError as err:
            return ResponseMessage[List[Triplet]](
                error=f"Broken JSON generated: {result}"
            )

        resp: List[Triplet] = []
        
        if isinstance(json_result, list):
            ee = {
                "triplets": []
            }

            for item in json_result:
                if not isinstance(item, dict):
                    continue

                xx = item.get("triplets", [])

                if not isinstance(xx, list):
                    continue

                ee["triplets"].extend(xx)

            json_result = ee

        if "triplets" not in json_result:
            return ResponseMessage[List[Triplet]](
                error=f"Wrong format of generated JSON: {json_result}"
            )

        for item in json_result["triplets"]:
            try:
                triplet = Triplet.model_validate(item)
            except:
                continue

            resp.append(triplet)

        return ResponseMessage[List[Triplet]](
            result=resp
        )
    
    async def refine_query(self, query: str) -> ResponseMessage[str]:
        messages = [
            {
                "role": "system",
                "content": self.refine_query_system_prompt
            },
            {
                "role": "user",
                "content": query
            }
        ]

        result = await call_llm_priotized(messages)
        if result is None:
            return ResponseMessage[str](
                error="LLM inference failed"
            )

        json_start, json_end = result.find("{"), result.rfind("}") + 1

        if -1 in (json_start, json_end):
            return ResponseMessage[str](
                error="No data from LLM, expect a JSON returned"
            )

        try:        
            json_result = json_repair.repair_json(
                result[json_start:json_end], 
                return_objects=True
            )
        except json.JSONDecodeError as err:
            return ResponseMessage[str](
                error="Broken JSON generated",
            )

        return ResponseMessage[str](
            result=str(json_result["refined_query"])
        )

    async def extract_named_entities(self, text: str) -> ResponseMessage[List[str]]:
        messages = [
            {
                "role": "system",
                "content": self.ner_system_prompt
            },
            {
                "role": "user",
                "content": f"This is the passage:\n{text}",
            }
        ]

        result = await call_llm_priotized(messages)

        if result is None:
            return ResponseMessage[List[str]](
                error="LLM inference failed"
            )

        json_start, json_end = result.find("{"), result.rfind("}") + 1
        
        if -1 in (json_start, json_end):
            return ResponseMessage[List[str]](
                error="No data from LLM, expect a JSON returned"
            )

        try:        
            json_result = json_repair.repair_json(
                result[json_start:json_end], 
                return_objects=True
            )
        except json.JSONDecodeError as err:
            return ResponseMessage[List[str]](
                error="Broken JSON generated",
                result=[]
            )

        return ResponseMessage[List[str]](
            result=json_result["entities"]
        )

@lru_cache(maxsize=1)
def get_gk() -> GraphKnowledge:
    return GraphKnowledge()