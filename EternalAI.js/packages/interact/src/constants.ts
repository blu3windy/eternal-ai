export enum ChainId {
  BASE = 8453,
  BSC = 56,
}

export const CHAIN_MAPPING: Record<ChainId, string> = {
  56: 'https://bsc-dataseed.binance.org/',
  8453: 'https://base.llamarpc.com',
};
