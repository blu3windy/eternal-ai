import decimal
import logging

from dotenv import load_dotenv

from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID
from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference, InferenceProcessing

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def create_hybrid_model_infer():
    rpc = RPC_URL.get(BSC_CHAIN_ID)
    # hybrid_infer = HybridModelInference()
    # tx_hash = hybrid_infer.create_inference_model("", rpc)
    tx_hash = "0xdedf4bdcce83066f27399aad7504e0e1974c7b522152f1a446eddf7413edaf25"
    logging.info(f"infer tx_hash: {tx_hash}")

    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(tx_hash, rpc)
    logging.info(f"infer id: {infer_id}")


if __name__ == "__main__":
    create_hybrid_model_infer()
    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
