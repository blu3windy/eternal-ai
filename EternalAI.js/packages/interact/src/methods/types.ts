import { Wallet } from 'ethers';

export interface InteractWallet extends Wallet {}

export type InteractMethod = {
  createPayload: <P, R>(payload: P) => R;
  execute: <R>(signedTx: string) => Promise<R>;
};
