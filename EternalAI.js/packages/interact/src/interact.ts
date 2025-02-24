import * as ethers from 'ethers';
import { InferPayload } from './types';
// import { CHAIN_MAPPING } from './constants';
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

  public async infer(payload: InferPayload) {
    try {
      console.log('infer - start');
      const provider = this.getProvider(payload.chainId);
      const signer = this._wallet.connect(provider);

      console.log(
        'infer call createPayload',
        await provider.getNetwork(),
        payload
      );
      const params = await methods.Infer.createPayload(signer, payload);

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
