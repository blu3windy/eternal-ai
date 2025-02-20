import * as ethers from 'ethers';

export interface InteractWallet extends ethers.Wallet {}

export type InteractMethod = {
  createPayload: <P, R>(payload: P) => R;
  execute: <R>(signedTx: string) => Promise<R>;
};
