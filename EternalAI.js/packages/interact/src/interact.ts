import * as ethers from 'ethers';
import { InferPayloadWithMessages, InferPayloadWithPrompt } from './types';
import * as methods from './methods';
import { CHAIN_MAPPING, ChainId } from './constants';

class Interact {
  private _wallet: ethers.Wallet;

  constructor(wallet: ethers.Wallet) {
    if (!ethers.Wallet.isSigner(wallet)) {
      throw new Error('Provided wallet is not a signer');
    }

    this._wallet = wallet;
  }

  private getProvider(chainId: ChainId) {
    const rpcUrl = CHAIN_MAPPING[chainId];
    if (!rpcUrl) {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }

    return new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  // Overload signatures
  // @ts-ignore
  public async infer(payload: InferPayloadWithPrompt): Promise<any>;
  // @ts-ignore
  public async infer(payload: InferPayloadWithMessages): Promise<any>;

  // Implementation
  // @ts-ignore

  public async infer(
    payload: InferPayloadWithPrompt | InferPayloadWithMessages
  ) {
    if (typeof (payload as InferPayloadWithPrompt).prompt === 'string') {
      return this.inferWithPrompt(payload as InferPayloadWithPrompt);
    } else {
      return this.inferWithMessages(payload as InferPayloadWithMessages);
    }
  }

  private async inferWithPrompt(payload: InferPayloadWithPrompt) {
    try {
      console.log('infer - start');
      const provider = this.getProvider(payload.chainId);
      const signer = this._wallet.connect(provider);

      console.log('infer call createPayloadWithPrompt', payload);
      const params = await methods.Infer.createPayloadWithPrompt(
        signer,
        payload
      );

      console.log('infer call signTransaction', params);
      const signedTx = await signer.signTransaction(params);

      console.log('infer call sendInfer', signedTx);
      const sendPromptTxHash = await methods.Infer.sendPrompt(signer, signedTx);

      console.log('infer call getWorkerHubAddress');
      const workerHubAddress = await methods.Infer.getWorkerHubAddress(
        payload.chainId,
        signer
      );

      console.log('infer call listenInferResponse', sendPromptTxHash);
      const result = await methods.Infer.listenPromptResponse(
        payload.chainId,
        signer
      );
      console.log('infer - succeed', result);
      return result;
    } catch (e) {
      console.log('infer - failed', e);
      throw e;
    } finally {
      console.log('infer - end');
    }
  }

  private async inferWithMessages(payload: InferPayloadWithMessages) {
    try {
      console.log('infer - start');
      const provider = this.getProvider(payload.chainId);
      const signer = this._wallet.connect(provider);

      console.log('infer call createPayloadWithMessages', payload);
      const params = await methods.Infer.createPayloadWithMessages(
        signer,
        payload
      );

      console.log('infer call signTransaction', params);
      const signedTx = await signer.signTransaction(params);

      console.log('infer call sendInfer', signedTx);
      const sendPromptTxHash = await methods.Infer.sendPrompt(signer, signedTx);

      console.log('infer call getWorkerHubAddress');
      const workerHubAddress = await methods.Infer.getWorkerHubAddress(
        payload.chainId,
        signer
      );

      console.log('infer call listenInferResponse', sendPromptTxHash);
      const result = await methods.Infer.listenPromptResponse(
        payload.chainId,
        signer
      );
      console.log('infer - succeed', result);
      return result;
    } catch (e) {
      console.log('infer - failed', e);
      throw e;
    } finally {
      console.log('infer - end');
    }
  }
}

export default Interact;
