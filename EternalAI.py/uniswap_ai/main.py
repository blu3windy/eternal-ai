import decimal
import logging
import time

from dotenv import load_dotenv

from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID, WORKER_HUB_ADDRESS, BASE_CHAIN_ID, AGENT_ADDRESS, \
    HYBRID_MODEL_ADDRESS
from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference, InferenceProcessing, AgentInference

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def process_infer(chain_id: str, tx_hash: str, rpc: str):
    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(worker_hub_address=WORKER_HUB_ADDRESS, tx_hash=tx_hash, rpc=rpc)
    logging.info(f"infer id: {infer_id}")

    result = ""
    if chain_id == BASE_CHAIN_ID:
        infer_processing.get_assignments_by_inference(worker_hub_address=WORKER_HUB_ADDRESS,
                                                      inference_id=infer_id,
                                                      rpc=rpc)
    elif chain_id == BSC_CHAIN_ID:
        while (True):
            try:
                result = infer_processing.get_inference_by_inference_id(worker_hub_address=WORKER_HUB_ADDRESS,
                                                                        inference_id=infer_id,
                                                                        rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(5)
    logging.info(f'result: {result}')
    return result


def create_agent_infer(chain_id: str, model: str, prompt: str):
    rpc = RPC_URL.get(chain_id)
    agent_infer = AgentInference()
    tx_hash = agent_infer.create_inference_agent("", AGENT_ADDRESS, model, prompt, rpc)
    # tx_hash = "0x8702f126fbfb468568df869c04fba4192d576eab7e2f41659fd97cc55e60a566"
    logging.info(f"infer tx_hash: {tx_hash}")

    return process_infer(chain_id, tx_hash, rpc)


def create_hybrid_model_infer(chain_id: str, model_address: str, model: str, system_prompt: str, prompt: str):
    rpc = RPC_URL.get(chain_id)
    hybrid_infer = HybridModelInference()
    tx_hash = hybrid_infer.create_inference_model("", model_address, model, system_prompt, prompt, rpc)
    # tx_hash = "0xdedf4bdcce83066f27399aad7504e0e1974c7b522152f1a446eddf7413edaf25"
    logging.info(f"infer tx_hash: {tx_hash}")

    return process_infer(chain_id, tx_hash, rpc)


if __name__ == "__main__":
    # create_hybrid_model_infer(BSC_CHAIN_ID,
    #                           HYBRID_MODEL_ADDRESS,
    #                           "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
    #                           "You are a BTC master",
    #                           "Tell me about BTC")

    result = create_agent_infer(BSC_CHAIN_ID,
                                "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
                                "Tell me about BTC")

    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
