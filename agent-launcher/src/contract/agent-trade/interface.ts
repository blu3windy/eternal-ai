import { CHAIN_TYPE } from "@constants/chains";
import { IToken } from "@interfaces/token";

export interface IGetLiquidityPoolInfoParams {
  poolAddress: string;
  chain?: CHAIN_TYPE;
}

export interface IResLiquidityPoolInfo {
  token0Info: IToken;
  token1Info: IToken;
  fee?: string;
}
