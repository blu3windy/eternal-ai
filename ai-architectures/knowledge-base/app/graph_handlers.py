import httpx
import json_repair
from . import constants as const

import dotenv

dotenv.load_dotenv()

async def call_llm(messages: list):
    endpoint = const.LLM_API_BASE.strip("/") + "/chat/completions"
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

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint, headers=headers, json=payload)
        response_json = response.json()
        content = response_json["choices"][0]["message"]["content"]
        return content, None


class GraphKnowledge:
    def __init__(self, graph_system_prompt: str = None, ner_system_prompt: str = None):
        self.graph_system_prompt = graph_system_prompt or const.GRAPH_SYSTEM_PROMPT
        self.ner_system_prompt = ner_system_prompt or const.NER_SYSTEM_PROMPT

    async def construct_graph_from_chunk(self, chunk: str):
        messages = [
            {
                "role": "system",
                "content": self.graph_system_prompt
            },
            {
                "role": "user",
                "content": "This is the passage:\n" + chunk
            }
        ]
        try:
            result, _ = await call_llm(messages) 
            json_start = result.find("{") 
            json_end = result.rfind("}") + 1
            json_result = json_repair.repair_json(result[json_start:json_end], return_objects=True)
            triplets = json_result["triplets"]
            return (chunk, triplets), None
        except Exception as e:
            return None, e

    async def extract_named_entities(self, text: str):
        messages = [{
            "role": "system",
            "content": self.ner_system_prompt
        },
        {
            "role": "user",
            "content": "This is the passage:\n" + text,
        }]
        try:
            result, _ = await call_llm(messages)
            json_start = result.find("{") 
            json_end = result.rfind("}") + 1
            json_result = json_repair.repair_json(result[json_start:json_end], return_objects=True)
            return json_result["entities"], None
        except Exception as e:
            return None, e
        
GRAPH_KNOWLEDGE = GraphKnowledge()

if __name__=="__main__":
    import asyncio
    gk = GraphKnowledge()
    chunk = "The quick brown fox jumps over the lazy dog."
    result = asyncio.run(gk.construct_graph_from_chunk(chunk))