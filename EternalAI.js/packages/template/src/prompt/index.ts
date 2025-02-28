import injectDependency from '@/inject';

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
  const wallet = packages.ethers.ethers.Wallet.createRandom();
  console.log(wallet.address);
  console.log(`Random id`, uuid.v4());
  return '';
};
