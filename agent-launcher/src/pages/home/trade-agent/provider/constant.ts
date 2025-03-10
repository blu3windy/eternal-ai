/* eslint-disable indent */
import { BASE_CHAIN_ID, CHAIN_TYPE } from "@constants/chains";
import BaseQuoterABI from "@contract/agent-trade/abis/BaseQuoter.json";
import BaseSwapABI from "@contract/agent-trade/abis/BaseSwap.json";

export const ChainIdToChainType: any = {
  [BASE_CHAIN_ID]: CHAIN_TYPE.BASE,
  //   [ARBITRUM_CHAIN_ID]: CHAIN_TYPE.ARBITRUM,
  //   [BSC_CHAIN_ID]: CHAIN_TYPE.BSC,
  //   [APE_CHAIN_ID]: CHAIN_TYPE.APE,
  //   [AVAX_CHAIN_ID]: CHAIN_TYPE.AVALANCHE,
};
export const EAI_ADDRESS = {
  ETH: {
    token: "0xa84f95eb3DaBdc1bbD613709ef5F2fD42CE5bE8d",
    bridge: "0x532f0b30d65d9cfb01851184d9772c487dc6fbaa",
  },
  BASE: {
    token: "0x4b6bf1d365ea1a8d916da37fafd4ae8c86d061d7",
    bridge: "0x7b83bd1e07d3fdc2ee349306c92de0559b6a9c6e",
  },
  SOLANA: {
    token: "12KwPzKewFGgzs69pvHmUKvhiDBtkAFCKoNjv6344Rkm",
    bridge: "55QYAy5CvDMehVmduBbigxMnBTxQGDCj3YqhqpLffJWW",
  },
  AVALANCHE: {
    token: "0xe30f980a7ce39805fd2b75f34a8bef30b4c38859",
    bridge: "0x7b83bd1e07d3fdc2ee349306c92de0559b6a9c6e",
  },
  BSC: {
    token: "0x4b6bf1d365ea1a8d916da37fafd4ae8c86d061d7",
    bridge: "0x7b83bd1e07d3fdc2ee349306c92de0559b6a9c6e",
  },
  ARBITRUM: {
    token: "0xdb8c67e6ca293f43c75e106c70b97033cc2909e3",
    bridge: "0x4b6bf1d365ea1a8d916da37fafd4ae8c86d061d7",
  },
  ZKSYNC: {
    token: "0xf3ef1bd0368f5bf2769c70e3379cdb9caa09769a",
    bridge: "0xe77edeb0e1e0c8bb9f2bda2339e9dc127f99f2fb",
  },
  APE: {
    token: "0x4B6bF1d365ea1A8d916Da37FaFd4ae8C86d061D7",
    bridge: "",
  },
};

export const InfoToChainType: any = {
  [CHAIN_TYPE.BASE]: {
    nativeAddress: EAI_ADDRESS.BASE.token,
    icon: "/icons/blockchains/ic_base.svg",
    chainId: BASE_CHAIN_ID,
    swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: BaseQuoterABI,
    swapABI: BaseSwapABI,
    okExplorer: "https://www.okx.com/web3/explorer/base/",
  },
};
