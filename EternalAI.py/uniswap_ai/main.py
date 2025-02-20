import decimal
import logging
import time
import os

from dotenv import load_dotenv

from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID, BASE_CHAIN_ID, AGENT_ADDRESS
from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference, InferenceProcessing, AgentInference

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def process_infer(chain_id: str, tx_hash: str, rpc: str, worker_address: str):
    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(worker_hub_address=worker_address, tx_hash=tx_hash, rpc=rpc)
    logging.info(f"infer id: {infer_id}")

    result = ""
    if chain_id == BASE_CHAIN_ID:
        infer_processing.get_assignments_by_inference(worker_hub_address=worker_address,
                                                      inference_id=infer_id,
                                                      rpc=rpc)
    elif chain_id == BSC_CHAIN_ID:
        while (True):
            try:
                result = infer_processing.get_inference_by_inference_id(worker_hub_address=worker_address,
                                                                        inference_id=infer_id,
                                                                        rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(30)
    logging.info(f'result: {result}')
    return result


def create_agent_infer(private_key: str, chain_id: str, agent_address: str, prompt: str):
    rpc = RPC_URL.get(chain_id)
    agent_infer = AgentInference()
    tx_hash = agent_infer.create_inference_agent(private_key, agent_address, prompt, rpc)
    logging.info(f"infer tx_hash: {tx_hash}")

    worker_hub_address = agent_infer.get_worker_hub_address()
    logging.info(f'worker_hub_address : {worker_hub_address}')
    return process_infer(chain_id, tx_hash, rpc, worker_hub_address)


def create_hybrid_model_infer(private_key: str, chain_id: str, model_address: str, system_prompt: str, prompt: str,
                              worker_address: str):
    rpc = RPC_URL.get(chain_id)
    hybrid_infer = HybridModelInference()
    tx_hash = hybrid_infer.create_inference_model(private_key, model_address, system_prompt, prompt, rpc)
    # tx_hash = "0xdedf4bdcce83066f27399aad7504e0e1974c7b522152f1a446eddf7413edaf25"
    logging.info(f"infer tx_hash: {tx_hash}")

    return process_infer(chain_id, tx_hash, rpc, worker_address)


if __name__ == "__main__":
    create_hybrid_model_infer(os.getenv("PRIVATE_KEY"), BSC_CHAIN_ID,
                              os.getenv("HYBRID_MODEL_ADDRESS"),
                              "You are a BTC master",
                              "Tell me about BTC",
                              os.getenv("WORKER_HUB_ADDRESS"))

    result = create_agent_infer(os.getenv("PRIVATE_KEY"),
                                BSC_CHAIN_ID,
                                AGENT_ADDRESS,
                                "Tell me about BTC")

    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
