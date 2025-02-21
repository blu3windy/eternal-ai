import * as ethers from 'ethers';

import { InteractWallet } from '../types';
import {
  CreateInferPayload,
  ListenInferPayload,
  SendInferResponse,
} from './types';
import { abis, HYBRID_MODEL_ADDRESS } from './constants';

const Infer = {
  createPayload: async (
    wallet: InteractWallet,
    payload: CreateInferPayload
  ) => {
    try {
      console.log('infer createPayload - start');
      const contract = new ethers.Contract(
        HYBRID_MODEL_ADDRESS,
        abis,
        wallet.provider
      );

      const { messages, model, chainId } = payload;

      const callData = contract.interface.encodeFunctionData(
        'infer(bytes,bool)',
        [
          ethers.utils.toUtf8Bytes(
            JSON.stringify({
              messages,
              model,
            })
          ),
          true,
        ]
      );

      const from = await wallet.getAddress();
      const params = {
        to: HYBRID_MODEL_ADDRESS, // smart contract address
        from: from, // sender address
        data: callData, // data
        chainId: ethers.BigNumber.from(chainId).toNumber(),
      } satisfies ethers.ethers.providers.TransactionRequest;
      console.log('infer createPayload - succeed', params);
      return params;
    } catch (e) {
      console.log('infer createPayload - failed', e);
      throw e;
    } finally {
      console.log('infer createPayload - end');
    }
  },
  sendInfer: async (
    wallet: InteractWallet,
    signedTx: string
  ): Promise<SendInferResponse> => {
    try {
      console.log('infer execute - start');

      console.log('infer execute - send transaction', signedTx);
      const txResponse = await wallet.provider.sendTransaction(signedTx);

      console.log('infer execute - waiting', txResponse);
      const receipt = await txResponse.wait();

      console.log('infer execute - receipt', receipt);
      const iface = new ethers.utils.Interface(abis as any);
      const events = receipt.logs
        .map((log) => {
          try {
            return iface.parseLog(log);
          } catch (error) {
            return null;
          }
        })
        .filter((event) => event !== null);

      const newInference = events?.find(
        ((event: ethers.utils.LogDescription) =>
          event.name === 'NewInference') as any
      );
      console.log('infer execute - event', { newInference });
      if (newInference?.args) {
        const result = {
          inferenceId: newInference.args.inferenceId,
          creator: newInference.args.creator,
          tx: txResponse.hash,
          receipt,
        };
        console.log('infer execute - succeed', result);
        return result;
      } else {
        console.log('infer execute - failed', {
          message: 'NewInference event not found',
        });
        throw new Error('NewInference event not found');
      }
    } catch (e) {
      console.log('infer execute - failed', e);
      throw e;
    } finally {
      console.log('infer execute - end');
    }
  },
  listenInferResponse: async (
    wallet: InteractWallet,
    payload: ListenInferPayload
  ) => {
    console.log('infer listenInferResponse - start');
    wallet.provider.on(payload.inferenceId, (log) => {});
  },
};

export default Infer;
