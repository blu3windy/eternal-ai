
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC = 'https://mainnet.base.org';

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_RPC = 'https://rpc.ankr.com/base_sepolia';

export const SYMBIOSIS_CHAIN_ID = 45762;
export const SYMBIOSIS_RPC = 'https://rpc.hermeschain.eternalai.org';

export const CHAIN_CONFIG = {
   [BASE_CHAIN_ID]: {
      id: BASE_CHAIN_ID,
      name: 'Base',
      network: 'Base',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
         default: { http: [BASE_RPC] },
         public: { http: [BASE_RPC] },
      },
   } as any,
   [BASE_SEPOLIA_CHAIN_ID]: {
      id: BASE_SEPOLIA_CHAIN_ID,
      name: 'Base Sepolia',
      network: 'Base Sepolia',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
         default: { http: [BASE_SEPOLIA_RPC] },
         public: { http: [BASE_SEPOLIA_RPC] },
      },
   } as any,
   [SYMBIOSIS_CHAIN_ID]: {
      id: SYMBIOSIS_CHAIN_ID,
      name: 'Symbiosis',
      network: 'Symbiosis',
      nativeCurrency: { name: 'EAI', symbol: 'EAI', decimals: 18 },
      rpcUrls: {
         default: { http: [SYMBIOSIS_RPC] },
         public: { http: [SYMBIOSIS_RPC] },
      },
   } as any
};

export type CHAIN_CONFIG_TYPE = keyof typeof CHAIN_CONFIG;
