import { TransactionState } from './libs/providers';

export type TTransactionResponse = {
  state: TransactionState | null;
  tx: any;
  message?: string;
};

export type TTokenInfo = {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: string;
  usdPrice: number;
  usdPriceFormatted: string;
  '24hrPercentChange': string;
  exchangeAddress: string;
  exchangeName: string;
  tokenAddress: string;
  toBlock: string;
  possibleSpam: boolean;
  verifiedContract: boolean;
  pairAddress: string;
  pairTotalLiquidityUsd: string;
};
