import { InteractMethod } from '../types';
import {
  InferExecuteResponse,
  InferPayload,
  InferPayloadResult,
} from './types';

const Infer = {
  createPayload: <P = InferPayload, R = InferPayloadResult>(payload: P) => {
    console.log('infer create payload', payload);
    return {} as R;
  },
  execute: async <R = InferExecuteResponse>(signedTx: string): Promise<R> => {
    console.log('infer execute', signedTx);
    return {} as R;
  },
} satisfies InteractMethod;

export default Infer;
