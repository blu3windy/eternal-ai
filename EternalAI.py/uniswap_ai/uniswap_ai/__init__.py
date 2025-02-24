import logging
import re
import time
import os
import simplejson as json

from dotenv import load_dotenv
from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID, BASE_CHAIN_ID, ETH_CHAIN_ID, V1, V2
from uniswap_ai.swap import UniSwapAI, SwapReq
from uniswap_ai.inference import HybridModelInference, InferenceProcessing, AgentInference

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def call_uniswap(private_key: str, content: str):
    logging.info(f"call uniswap with content {content}")
    try:
        # json content
        json_match = re.search(r'\{.*?\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
        else:
            print("No JSON content found.")

        uniswap_obj = UniSwapAI()
        json_data = json.loads(content)
        req = SwapReq(**json_data)
        req.convert_in_out()

        tx_swap = uniswap_obj.swap_v3(private_key, req)
    except Exception as e:
        logging.error(f'{e}')
        return None

    return tx_swap


def process_infer(chain_id: str, tx_hash: str, rpc: str, worker_address: str):
    if chain_id not in V1 and chain_id not in V2:
        logging.error(f'{chain_id} is not support')
        return None

    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(worker_hub_address=worker_address, tx_hash_hex=tx_hash, rpc=rpc)
    logging.info(f"infer id: {infer_id}")

    result = ""
    if chain_id in V1:
        while (True):
            try:
                result = infer_processing.get_assignments_by_inference(worker_hub_address=worker_address,
                                                                       inference_id=infer_id,
                                                                       rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(30)
    elif chain_id in V2:
        while (True):
            try:
                result = infer_processing.get_inference_by_inference_id(worker_hub_address=worker_address,
                                                                        inference_id=infer_id,
                                                                        rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(30)
    else:
        logging.error(f'{chain_id} is not support')
        return None
    if result is not None:
        logging.info(f'result: {result}')
    else:
        logging.info(f'result: None')
    return result


def create_agent_infer(private_key: str, chain_id: str, agent_address: str, prompt: str):
    rpc = RPC_URL.get(chain_id)
    agent_infer = AgentInference()
    # tx_hash = agent_infer.create_inference_agent(private_key, agent_address, prompt, rpc)
    tx_hash = '0xfb1c25179aa6eebde816ab92efab93a2be0a353728d2d1fa48c1f7dd8e90b94f'
    logging.info(f"infer tx_hash: {tx_hash}")

    worker_hub_address = agent_infer.get_worker_hub_address(agent_address, rpc)
    logging.info(f'worker_hub_address : {worker_hub_address}')

    content_response = process_infer(chain_id, tx_hash, rpc, worker_hub_address)

    if content_response is not None and len(content_response) > 0:
        tx_swap = call_uniswap(private_key, content_response)
        return tx_swap
    else:
        return None


def create_hybrid_model_infer(private_key: str, chain_id: str, model_address: str, system_prompt: str, prompt: str,
                              worker_address: str):
    rpc = RPC_URL.get(chain_id)
    hybrid_infer = HybridModelInference()
    tx_hash = hybrid_infer.create_inference_model(private_key, model_address, system_prompt, prompt, rpc)
    # tx_hash = "0x72f23026b34fbabb5dda2313ce3cf48b337bb690ff2c8dba6ac1ba6d95b2170a"
    logging.info(f"infer tx_hash: {tx_hash}")

    content_response = process_infer(chain_id, tx_hash, rpc, worker_address)

    if content_response is not None and len(content_response) > 0:
        tx_swap = call_uniswap(private_key, content_response)
        return tx_swap
    else:
        return None


def uni_swap_ai(args):
    if args.command == 'model-infer':
        create_hybrid_model_infer(
            args.pk or os.getenv("PRIVATE_KEY"),
            args.chain_id or BASE_CHAIN_ID,
            args.model_address or os.getenv("HYBRID_MODEL_ADDRESS"),
            args.system_prompt,
            args.prompt,
            args.worker_hub_address or os.getenv("WORKER_HUB_ADDRESS"))
    elif args.command == 'agent-infer':
        create_agent_infer(
            args.pk or os.getenv("PRIVATE_KEY"),
            args.chain_id or BSC_CHAIN_ID,
            args.agent_address or os.getenv("AGENT_ADDRESS"),
            args.prompt)
