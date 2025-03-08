import CTokenContract from "@contract/token";
import {
  IGetLiquidityPoolInfoParams,
  IResLiquidityPoolInfo,
} from "./interface";
import { CHAIN_TYPE } from "@constants/chains";
import { ethers } from "ethers";
import EternalPoolAbi from "./abis/EternalPool.json";
import { UniswapV3Pool } from "./abis/EternalPool";

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
}

export default CAgentTradeContract;
