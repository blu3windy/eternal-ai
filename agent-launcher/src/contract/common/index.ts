import { CHAIN_CONFIG, CHAIN_INFO, CHAIN_TYPE } from "@constants/chains";
import { compareString } from "@utils/string";
import { ethers } from "ethers";

class GenericContract {
  public getChainId = (chain: CHAIN_TYPE = CHAIN_TYPE.BASE) => {
    return CHAIN_INFO?.[chain]?.id;
  };

  public getRPCByChainID = (chainID: number | string) => {
    return Object.values(CHAIN_CONFIG).find((chain) =>
      compareString(chain.id, chainID)
    )?.rpcUrls?.public?.http?.[0];
  };

  public getRPC = (chain: CHAIN_TYPE = CHAIN_TYPE.BASE) => {
    const rpcs = (CHAIN_INFO?.[chain] as any)?.rpcs || [];
    let rpc = "";
    if (rpcs.length) {
      const randomIndex = Math.floor(Math.random() * rpcs.length);
      rpc = rpcs[randomIndex];
    } else {
      rpc = this.getRPCByChainID(this.getChainId(chain)) || "";
    }
    return rpc;
  };

  public getProviderByChain = (chain: CHAIN_TYPE = CHAIN_TYPE.BASE) => {
    const rpc = this.getRPC(chain);

    return new ethers.providers.JsonRpcProvider(
      rpc
    ) as ethers.providers.JsonRpcProvider;
  };
}

export default GenericContract;
