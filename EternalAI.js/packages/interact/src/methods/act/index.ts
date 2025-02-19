import { ActExecuteResponse, ActPayload, ActPayloadResult } from './types';

const Act = {
  createPayload: (payload: ActPayload) => {
    console.log('act create payload', payload);
    return {} as ActPayloadResult;
  },
  execute: async (signedTx: string): Promise<ActExecuteResponse> => {
    console.log('act execute', signedTx);
    return {} as ActExecuteResponse;
  },
};

export default Act;
