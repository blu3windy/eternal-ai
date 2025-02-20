import * as ethers from 'ethers';

import { InteractWallet } from '../types';
import { CreateInferPayload } from './types';

const Infer = {
  createPayload: async (
    wallet: InteractWallet,
    payload: CreateInferPayload
  ) => {
    const tx = await wallet.signTransaction({
      to: '0xRecipientAddress',
      from: wallet.address,
      ...payload,
    });
    return tx;
  },
  execute: async (
    wallet: InteractWallet,
    signedTx: string
  ): Promise<ethers.ethers.providers.TransactionReceipt> => {
    const txResponse = await wallet.provider.sendTransaction(signedTx);
    const receipt = await txResponse.wait();
    return receipt;
  },
};

export default Infer;
