import * as ethers from 'ethers';
import { InferPayload } from './types';
import { CHAIN_MAPPING } from './constants';
import * as methods from './methods';

class Interact {
  private _wallet: ethers.Wallet;

  constructor(wallet: ethers.Wallet) {
    if (!ethers.Wallet.isSigner(wallet)) {
      throw new Error('Provided wallet is not a signer');
    }

    this._wallet = wallet;
  }

  private getProvider(chainId: string) {
    const rpcUrl = CHAIN_MAPPING[chainId];
    if (!rpcUrl) {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }

    return new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  public async infer(payload: InferPayload) {
    const provider = this.getProvider(payload.chainId);
    const signer = this._wallet.connect(provider);
    const signedTx = await methods.Infer.createPayload(signer, payload);
    return await methods.Infer.execute(signer, signedTx);
  }
}

export default Interact;
