import decimal

from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference

if __name__ == "__main__":
    hybrid_infer = HybridModelInference()
    hybrid_infer.create_inference_model("")

    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
