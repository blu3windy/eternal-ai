import {
  InferExecuteResponse,
  InferPayload,
  InferPayloadResult,
} from './types';

const Infer = {
  createPayload: (payload: InferPayload) => {
    console.log('infer create payload', payload);
    return {} as InferPayloadResult;
  },
  execute: async (signedTx: string): Promise<InferExecuteResponse> => {
    console.log('infer execute', signedTx);
    return {} as InferExecuteResponse;
  },
};

export default Infer;
