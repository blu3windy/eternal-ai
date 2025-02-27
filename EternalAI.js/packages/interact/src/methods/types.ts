import { providers } from 'ethers';

export interface InteractWallet {
  provider: providers.Provider;
  getAddress: () => Promise<string>;
  address: string;
}

export type InteractMethod = {
  createPayload: <P, R>(payload: P) => R;
  execute: <R>(signedTx: string) => Promise<R>;
};
