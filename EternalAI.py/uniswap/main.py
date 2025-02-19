from uniswap.uniswap import UniSwap, SwapReq

if __name__ == "__main__":
    uniswapObj = UniSwap(None)
    uniswapObj.swap("", SwapReq("", 0.1, "", 0.1))
