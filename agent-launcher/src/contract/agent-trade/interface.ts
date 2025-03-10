import { CHAIN_TYPE } from "@constants/chains";
import { IToken } from "@interfaces/token";
import { EAgentTrade } from "@pages/home/trade-agent/form-trade/interface";

export interface IGetLiquidityPoolInfoParams {
  poolAddress: string;
  chain?: CHAIN_TYPE;
}

export interface IResLiquidityPoolInfo {
  token0Info: IToken;
  token1Info: IToken;
  fee?: string;
}

export interface IBodyEternalSwap {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  type: EAgentTrade;
  fee: string;
  maximum?: string;
  chain?: CHAIN_TYPE;
}

export interface IResEstimateSwap {
  amountOut: string;
  amountOutFormatted: string;
}
