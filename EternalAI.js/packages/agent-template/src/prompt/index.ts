import * as ethers from 'ethers';
import * as uniswapSdkCore from '@uniswap/sdk-core';

import { PromptPayload } from './types';

export const prompt = async (payload: PromptPayload): Promise<string> => {
  // your code here
  console.log(payload);
  const provider = new ethers.ethers.providers.JsonRpcProvider('ropsten');

  console.log('provider - start');
  console.log(provider);
  console.log('provider - end');

  console.log('uniswap', uniswapSdkCore.ARGENT_WALLET_DETECTOR_ADDRESS);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(1000);
  return 'Done';
};
