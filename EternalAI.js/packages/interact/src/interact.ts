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

  private getNetworkCredential(chainId: ChainId) {
    const provider = this.getProvider(chainId);
    const signer = this._wallet.connect(provider);
    return {
      provider,
      signer,
    };
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
    try {
      console.log('infer - start');
      if (typeof (payload as InferPayloadWithPrompt).prompt === 'string') {
        const result = this.inferWithPrompt(payload as InferPayloadWithPrompt);
        console.log('infer - succeed', result);
        return result;
      } else {
        const result = this.inferWithMessages(
          payload as InferPayloadWithMessages
        );
        console.log('infer - succeed', result);
        return result;
      }
    } catch (e) {
      console.log('infer - failed', e);
      throw e;
    } finally {
      console.log('infer - end');
    }
  }

  private async inferWithPrompt(payload: InferPayloadWithPrompt) {
    console.log('inferWithPrompt - start');
    const { signer } = this.getNetworkCredential(payload.chainId);

    const params = await methods.Infer.createPayloadWithPrompt(signer, payload);

    const signedTx = await signer.signTransaction(params);

    const sendPromptTxHash = await methods.Infer.sendPrompt(signer, signedTx);

    const workerHubAddress = await methods.Infer.getWorkerHubAddress(
      payload.agentAddress,
      signer
    );

    return await methods.Infer.listenPromptResponse(
      payload.chainId,
      signer,
      workerHubAddress,
      sendPromptTxHash
    );
  }

  private async inferWithMessages(payload: InferPayloadWithMessages) {
    console.log('inferWithMessages - start');
    const { signer } = this.getNetworkCredential(payload.chainId);

    const params = await methods.Infer.createPayloadWithMessages(
      signer,
      payload
    );

    const signedTx = await signer.signTransaction(params);

    const sendPromptTxHash = await methods.Infer.sendPrompt(signer, signedTx);

    const workerHubAddress = await methods.Infer.getWorkerHubAddress(
      payload.agentAddress,
      signer
    );

    return await methods.Infer.listenPromptResponse(
      payload.chainId,
      signer,
      workerHubAddress,
      sendPromptTxHash
    );
  }
}

export default Interact;
