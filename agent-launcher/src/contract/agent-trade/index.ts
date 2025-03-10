import CTokenContract from "@contract/token";
import {
  IBodyEternalSwap,
  IGetLiquidityPoolInfoParams,
  IResEstimateSwap,
  IResLiquidityPoolInfo,
} from "./interface";
import { CHAIN_TYPE } from "@constants/chains";
import { ethers } from "ethers";
import EternalPoolAbi from "./abis/EternalPool.json";
import { UniswapV3Pool } from "./abis/EternalPool";
import { InfoToChainType } from "@pages/home/trade-agent/provider/constant";
import QuoterV2ABI from "./abis/QuoterV2.json";
import { formatEther, parseEther } from "ethers/lib/utils";
import { compareString } from "@utils/string";
import { EAgentTrade } from "@pages/home/trade-agent/form-trade/interface";
import { getDeadline } from "@utils/helpers";
import SwapRouterABI from "./abis/SwapRouter.json";
import { isNativeToken } from "@contract/token/constants";

class CAgentTradeContract extends CTokenContract {
  private getUniPool = (
    poolAddress: string,
    chain: CHAIN_TYPE = CHAIN_TYPE.BASE
  ) => {
    return new ethers.Contract(
      poolAddress,
      EternalPoolAbi,
      this.getProviderByChain(chain)
    ) as UniswapV3Pool;
  };

  private getEternalSQuote = (chain = CHAIN_TYPE.BASE) => {
    return new ethers.Contract(
      InfoToChainType[chain].platformQuoteRouter,
      QuoterV2ABI.abi,
      this.getProviderByChain(chain)
    ) as any;
  };

  private getEternalSRouter = (chain = CHAIN_TYPE.BASE) => {
    return new ethers.Contract(
      InfoToChainType[chain].platformSwapRouter,
      SwapRouterABI.abi,
      this.getProviderByChain(chain)
    );
  };

  public getLiquidityPoolInfo = async (
    params: IGetLiquidityPoolInfoParams
  ): Promise<IResLiquidityPoolInfo> => {
    try {
      const { poolAddress, chain } = params;
      console.log("poolAddress, chain", poolAddress, chain);

      const poolContract = this.getUniPool(poolAddress, chain);
      console.log("poolContract", poolContract);

      const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
      ]);

      console.log("token0, token1, fee", token0, token1);

      const [token0Info, token1Info] = await Promise.all([
        this.getTokenInfo({ contractAddress: token0, chain }),
        this.getTokenInfo({ contractAddress: token1, chain }),
      ]);

      console.log("token0Info, token1Info", token0Info, token1Info);

      return {
        token0Info,
        token1Info,
        fee: fee.toString(),
      };
    } catch (error) {
      throw error;
    }
  };

  public runeEstimateSwap = async (
    body: IBodyEternalSwap
  ): Promise<IResEstimateSwap> => {
    try {
      const quoteContract = this.getEternalSQuote(body.chain);

      console.log("quoteContract", quoteContract);

      console.log("runeEstimateSwap body", body, {
        amountIn: parseEther(body.amount),
        tokenIn: body.tokenIn,
        tokenOut: body.tokenOut,
        fee: body.fee,
        sqrtPriceLimitX96: "0",
      });

      const tx = await quoteContract
        .connect(this.getProviderByChain(body.chain))
        .callStatic.quoteExactInputSingle({
          amountIn: parseEther(body.amount),
          tokenIn: body.tokenIn,
          tokenOut: body.tokenOut,
          fee: body.fee,
          sqrtPriceLimitX96: "0",
        });

      console.log("runeEstimateSwap", tx);

      return {
        amountOut: tx.amountOut.toString(),
        amountOutFormatted: formatEther(tx.amountOut),
      };
    } catch (error) {
      console.log("errorerrorerror", error);

      return {
        amountOut: "0",
        amountOutFormatted: "0",
      };
    }
  };

  public eternalSwap = async (body: IBodyEternalSwap) => {
    try {
      const _wallet = this.signer?.address as string;

      if (compareString(body.type, EAgentTrade.BUY)) {
        const multicalls = [
          this.getEternalSRouter(body.chain).interface.encodeFunctionData(
            "exactInputSingle",
            [
              [
                body.tokenIn,
                body.tokenOut,
                body.fee,
                _wallet,
                getDeadline(),
                parseEther(body.amount),
                parseEther(body.maximum || "0"),
                "0",
              ],
            ]
          ),
          this.getEternalSRouter(body.chain).interface.encodeFunctionData(
            "refundETH"
          ),
        ];

        const calldata = this.getEternalSRouter(
          body.chain
        ).interface.encodeFunctionData("multicall", [multicalls]);

        const tx = await this.walletAuth.sendTransaction({
          data: calldata,
          to: InfoToChainType[body.chain as any].platformSwapRouter,
          value: isNativeToken(body.tokenIn) ? body.amount : "0",
          wait: true,
          chainId: InfoToChainType[body.chain as any]?.chainId,
        });

        return tx;
      } else {
        if (isNativeToken(body.tokenOut)) {
          const multicalls = [
            this.getEternalSRouter(body.chain).interface.encodeFunctionData(
              "exactInputSingle",
              [
                [
                  body.tokenIn,
                  body.tokenOut,
                  body.fee,
                  InfoToChainType[body.chain as any].platformSwapRouter,
                  getDeadline(),
                  parseEther(body.amount),
                  parseEther(body.maximum || "0"),
                  "0",
                ],
              ]
            ),
            this.getEternalSRouter(body.chain).interface.encodeFunctionData(
              "unwrapWETH",
              [parseEther(body.maximum || "0"), _wallet]
            ),
          ];

          const calldata = this.getEternalSRouter(
            body.chain
          ).interface.encodeFunctionData("multicall", [multicalls]);
          const tx = await this.walletAuth.sendTransaction({
            data: calldata,
            to: InfoToChainType[body.chain as any].platformSwapRouter,
            wait: true,
            chainId: InfoToChainType[body.chain as any]?.chainId,
          });

          return tx;
        } else {
          const multicalls = [
            this.getEternalSRouter(body.chain).interface.encodeFunctionData(
              "exactInputSingle",
              [
                [
                  body.tokenIn,
                  body.tokenOut,
                  body.fee,
                  _wallet,
                  getDeadline(),
                  parseEther(body.amount),
                  parseEther(body.maximum || "0"),
                  "0",
                ],
              ]
            ),
          ];

          const calldata = this.getEternalSRouter(
            body.chain
          ).interface.encodeFunctionData("multicall", [multicalls]);
          const tx = await this.walletAuth.sendTransaction({
            data: calldata,
            to: InfoToChainType[body.chain as any].platformSwapRouter,
            wait: true,
            chainId: InfoToChainType[body.chain as any]?.chainId,
          });

          return tx;
        }
      }
    } catch (error) {
      console.log("errorerrorerror", error);

      throw error;
    }
  };
}

export default CAgentTradeContract;
