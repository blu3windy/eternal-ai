export type InteractMethod = {
  createPayload: <P, R>(payload: P) => R;
  execute: <R>(signedTx: string) => Promise<R>;
};
