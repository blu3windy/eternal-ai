import { InteractMethod } from '../types';
import { ActExecuteResponse, ActPayload, ActPayloadResult } from './types';

const Act = {
  createPayload: <P = ActPayload, R = ActPayloadResult>(payload: P) => {
    console.log('act create payload', payload);
    return {} as R;
  },
  execute: async <R = ActExecuteResponse>(signedTx: string): Promise<R> => {
    console.log('act execute', signedTx);
    return {} as R;
  },
} satisfies InteractMethod;

export default Act;
