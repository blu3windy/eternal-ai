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
    return new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org/'
    );
  }

  public async infer(payload: InferPayload) {
    const provider = this.getProvider(payload.chainId);
    const signer = this._wallet.connect(provider);
    const signedTx = await methods.Infer.createPayload(signer, payload);
    const inference = await methods.Infer.sendInfer(signer, signedTx);
    const result = await methods.Infer.listenInferResponse(signer, inference);
    return result;
  }
}

export default Interact;
