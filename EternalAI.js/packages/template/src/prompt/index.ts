import injectDependency from '@/inject';
// import * as ethers from 'ethers';

// import unsupported packages
import * as uuid from 'uuid';

import { PromptPayload } from './types';

// this is inject supported packages
const packages = {
  ethers: injectDependency<InjectedTypes.ethers>('ethers'),
};

export const prompt = (payload: PromptPayload) => {
  // Your code here
  console.log('Prompting with payload:', payload);
  const wallet: InstanceType<typeof packages.ethers.ethers.Wallet> =
    packages.ethers.ethers.Wallet.createRandom();

  console.log(wallet.address);
  console.log(`Random id`, uuid.v4());

  const provider: InstanceType<typeof packages.ethers.providers.Provider> =
    new packages.ethers.ethers.providers.JsonRpcProvider('ropsten');

  console.log('provider - start');
  console.log(provider);
  console.log('provider - end');
  return 'Done';
};
