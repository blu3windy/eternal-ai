export const MIN_DECIMAL = 2;
export const MAX_DECIMAL = 6;

export const BASE_CHAIN_ID = 8453;
export const BASE_RPC = "https://mainnet.base.org";

export const ARBITRUM_CHAIN_ID = 42161;
export const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";

export const BSC_CHAIN_ID = 56;
export const BSC_RPC = "https://rpc.ankr.com/bsc";

export const APE_CHAIN_ID = 33139;
export const APE_RPC = "https://rpc.apechain.com/http";

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

export const SYMBIOSIS_CHAIN_ID = 45762;
export const SYMBIOSIS_RPC = "https://rpc.hermeschain.eternalai.org";

export const CHAIN_CONFIG = {
  [BASE_CHAIN_ID]: {
    id: BASE_CHAIN_ID,
    name: "Base",
    network: "Base",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: [BASE_RPC] },
      public: { http: [BASE_RPC] },
    },
  } as any,
  [ARBITRUM_CHAIN_ID]: {
    id: ARBITRUM_CHAIN_ID,
    name: "Arbitrum",
    network: "Arbitrum",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: [ARBITRUM_RPC] },
      public: { http: [ARBITRUM_RPC] },
    },
  } as any,
  [BSC_CHAIN_ID]: {
    id: BSC_CHAIN_ID,
    name: "BSC",
    network: "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: {
      default: { http: [BSC_RPC] },
      public: { http: [BSC_RPC] },
    },
  } as any,
  [APE_CHAIN_ID]: {
    id: APE_CHAIN_ID,
    name: "APE Chain",
    network: "APE",
    nativeCurrency: { name: "APE", symbol: "APE", decimals: 18 },
    rpcUrls: {
      default: { http: [APE_RPC] },
      public: { http: [APE_RPC] },
    },
  } as any,
  [BASE_SEPOLIA_CHAIN_ID]: {
    id: BASE_SEPOLIA_CHAIN_ID,
    name: "Base Sepolia",
    network: "Base Sepolia",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: [BASE_SEPOLIA_RPC] },
      public: { http: [BASE_SEPOLIA_RPC] },
    },
  } as any,
  [SYMBIOSIS_CHAIN_ID]: {
    id: SYMBIOSIS_CHAIN_ID,
    name: "Symbiosis",
    network: "Symbiosis",
    nativeCurrency: { name: "EAI", symbol: "EAI", decimals: 18 },
    rpcUrls: {
      default: { http: [SYMBIOSIS_RPC] },
      public: { http: [SYMBIOSIS_RPC] },
    },
  } as any,
};

export enum CHAIN_TYPE {
  EAI = "eai",
  ETERNAL = "eternal",
  ARBITRUM = "arbitrum",
  BASE = "base",
  ETHEREUM = "ethereum",
  SOLANA = "solana",
  AVALANCHE = "avalanche",
  BSC = "bsc",
  ZKSYNC = "zksync",
  APE = "ape",
}

export const CHAIN_NAME_TO_ID = {
  [CHAIN_TYPE.BASE]: BASE_CHAIN_ID,
  [CHAIN_TYPE.ARBITRUM]: ARBITRUM_CHAIN_ID,
  [CHAIN_TYPE.BSC]: BSC_CHAIN_ID,
  [CHAIN_TYPE.APE]: APE_CHAIN_ID,
};

export const CHAIN_INFO = {
  [CHAIN_TYPE.EAI]: CHAIN_CONFIG["ai"],
  [CHAIN_TYPE.ETERNAL]: CHAIN_CONFIG["eternal"],
  [CHAIN_TYPE.ARBITRUM]: CHAIN_CONFIG[CHAIN_NAME_TO_ID["arbitrum"]],
  [CHAIN_TYPE.BASE]: CHAIN_CONFIG[CHAIN_NAME_TO_ID["base"]],
  [CHAIN_TYPE.ETHEREUM]: CHAIN_CONFIG["ethereum"],
  [CHAIN_TYPE.SOLANA]: CHAIN_CONFIG["solana"],
  [CHAIN_TYPE.AVALANCHE]: CHAIN_CONFIG["avalanche"],
  [CHAIN_TYPE.BSC]: CHAIN_CONFIG[CHAIN_NAME_TO_ID["bsc"]],
  [CHAIN_TYPE.ZKSYNC]: CHAIN_CONFIG["zksync"],
  [CHAIN_TYPE.APE]: CHAIN_CONFIG[CHAIN_NAME_TO_ID["ape"]],
};

export type CHAIN_CONFIG_TYPE = keyof typeof CHAIN_CONFIG;
