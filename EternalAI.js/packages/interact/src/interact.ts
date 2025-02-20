import * as ethers from 'ethers';
import { InferPayload } from './types';
// import { CHAIN_MAPPING } from './constants';
import * as methods from './methods';
import { ChainId } from './methods/infer/types';

class Interact {
  private _wallet: ethers.Wallet;

  constructor(wallet: ethers.Wallet) {
    if (!ethers.Wallet.isSigner(wallet)) {
      throw new Error('Provided wallet is not a signer');
    }

    this._wallet = wallet;
  }

  private getProvider(chainId: ChainId) {
    // const rpcUrl = CHAIN_MAPPING[chainId];
    // if (!rpcUrl) {
    //   throw new Error(`Unsupported chainId: ${chainId}`);
    // }

    // return new ethers.providers.JsonRpcProvider(rpcUrl);
    return new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');
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
      const inference = await methods.Infer.sendInfer(signer, signedTx);

      console.log('infer call listenInferResponse', inference);
      const result = await methods.Infer.listenInferResponse(signer, inference);
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
