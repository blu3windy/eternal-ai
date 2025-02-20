import decimal
import logging

from dotenv import load_dotenv

from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID, WORKER_HUB_ADDRESS, BASE_CHAIN_ID
from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference, InferenceProcessing

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def create_hybrid_model_infer(chain_id: str):
    rpc = RPC_URL.get(chain_id)
    # hybrid_infer = HybridModelInference()
    # tx_hash = hybrid_infer.create_inference_model("", rpc)
    tx_hash = "0xdedf4bdcce83066f27399aad7504e0e1974c7b522152f1a446eddf7413edaf25"
    logging.info(f"infer tx_hash: {tx_hash}")

    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(worker_hub_address=WORKER_HUB_ADDRESS, tx_hash=tx_hash, rpc=rpc)
    logging.info(f"infer id: {infer_id}")

    if chain_id == BASE_CHAIN_ID:
        infer_processing.get_assignments_by_inference(worker_hub_address=WORKER_HUB_ADDRESS,
                                                      inference_id=infer_id,
                                                      rpc=rpc)
    elif chain_id == BSC_CHAIN_ID:
        infer_processing.get_inference_by_inference_id(worker_hub_address=WORKER_HUB_ADDRESS,
                                                       inference_id=infer_id,
                                                       rpc=rpc)


if __name__ == "__main__":
    create_hybrid_model_infer(BSC_CHAIN_ID)
    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
