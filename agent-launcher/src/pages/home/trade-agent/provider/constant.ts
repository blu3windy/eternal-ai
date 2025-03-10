/* eslint-disable indent */
import {
  APE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  AVAX_CHAIN_ID,
  BASE_CHAIN_ID,
  BSC_CHAIN_ID,
  CELO_CHAIN_ID,
  CHAIN_TYPE,
} from "@constants/chains";
import BaseQuoterABI from "@contract/agent-trade/abis/BaseQuoter.json";
import BaseSwapABI from "@contract/agent-trade/abis/BaseSwap.json";
import ArbQuoterABI from "@contract/agent-trade/abis/ArbQuoter.json";
import ArbRouterABI from "@contract/agent-trade/abis/ArbRouter.json";
import ApeQuoterABI from "@contract/agent-trade/abis/ApeQuote.json";
import ApeRouterABI from "@contract/agent-trade/abis/ApeRoute.json";
import AvaxQuoterABI from "@contract/agent-trade/abis/AvaxQuote.json";
import AvaxRouterABI from "@contract/agent-trade/abis/AvaxRoute.json";
import BSCQuoterABI from "@contract/agent-trade/abis/BSCQuoter.json";
import BSCRouterABI from "@contract/agent-trade/abis/BSCRoute.json";
import CeloQuoterABI from "@contract/agent-trade/abis/CeloQuote.json";
import CeloRouterABI from "@contract/agent-trade/abis/CeloRoute.json";

export const ChainIdToChainType: any = {
  [BASE_CHAIN_ID]: CHAIN_TYPE.BASE,
  [ARBITRUM_CHAIN_ID]: CHAIN_TYPE.ARBITRUM,
  [BSC_CHAIN_ID]: CHAIN_TYPE.BSC,
  [APE_CHAIN_ID]: CHAIN_TYPE.APE,
  [AVAX_CHAIN_ID]: CHAIN_TYPE.AVALANCHE,
  [CELO_CHAIN_ID]: CHAIN_TYPE.CELO,
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
  CELO: {
    token: "0x4B6bF1d365ea1A8d916Da37FaFd4ae8C86d061D7",
    bridge: "",
  },
};

export const InfoToChainType: any = {
  [CHAIN_TYPE.BASE]: {
    nativeAddress: EAI_ADDRESS.BASE.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: BASE_CHAIN_ID,
    swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: BaseQuoterABI,
    swapABI: BaseSwapABI,
    okExplorer: "https://www.okx.com/web3/explorer/base/",
  },
  [CHAIN_TYPE.ARBITRUM]: {
    nativeAddress: EAI_ADDRESS.ARBITRUM.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: ARBITRUM_CHAIN_ID,
    swapRouter: "0x1F721E2E82F6676FCE4eA07A5958cF098D339e18",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0x0Fc73040b26E9bC8514fA028D998E73A254Fa76E",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: ArbQuoterABI,
    swapABI: ArbRouterABI,
    okExplorer: "https://www.okx.com/web3/explorer/arbitrum/",
  },
  [CHAIN_TYPE.BSC]: {
    nativeAddress: EAI_ADDRESS.BSC.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: BSC_CHAIN_ID,
    swapRouter: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
    platformSwapRouter: "0x39c4B16CE0428Caae01A9042C144980fA8cd6580",
    quoteRouter: "0xb048bbc1ee6b733fffcfb9e9cef7375518e25997",
    platformQuoteRouter: "0xA1b105cD3D7b0Cdcc666F20Bb2f2e0b8632DEeB6",
    quoterABI: BSCQuoterABI,
    swapABI: BSCRouterABI,
    okExplorer: "https://www.okx.com/web3/explorer/bsc/",
  },
  [CHAIN_TYPE.APE]: {
    nativeAddress: EAI_ADDRESS.APE.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: APE_CHAIN_ID,
    swapRouter: "0xC69Dc28924930583024E067b2B3d773018F4EB52",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0x60A186019F81bFD04aFc16c9C01804a04E79e68B",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: ApeQuoterABI,
    swapABI: ApeRouterABI,
    okExplorer: "https://www.okx.com/web3/explorer/ape/",
  },
  [CHAIN_TYPE.AVALANCHE]: {
    nativeAddress: EAI_ADDRESS.AVALANCHE.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: AVAX_CHAIN_ID,
    swapRouter: "0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0xbe0F5544EC67e9B3b2D979aaA43f18Fd87E6257F",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: AvaxQuoterABI,
    swapABI: AvaxRouterABI,
    okExplorer: "https://www.okx.com/web3/explorer/avax/",
  },
  [CHAIN_TYPE.CELO]: {
    nativeAddress: EAI_ADDRESS.CELO.token,
    icon: "icons/blockchains/ic_base.svg",
    chainId: CELO_CHAIN_ID,
    swapRouter: "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
    platformSwapRouter: "0xD62c25806FaA1d450509D6dcF0F1762612009f23",
    quoteRouter: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8",
    platformQuoteRouter: "0x5e9101b301294112E187D872A16B32BD350bA594",
    quoterABI: CeloQuoterABI,
    swapABI: CeloRouterABI,
    okExplorer: "https://www.okx.com/web3/explorer/celo/",
  },
};
