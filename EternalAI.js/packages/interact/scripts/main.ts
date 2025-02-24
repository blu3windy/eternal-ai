import { ethers } from 'ethers';
import { default as Interact } from '../src/interact';
import { InferPayload } from '../src/types';
import { ChainId } from '../src/constants';

async function testInfer() {
  const inferPayload = {
    chainId: ChainId.BSC,
    model: 'NousResearch/Hermes-3-Llama-3.1-70B-FP8',
    prompt: 'Can you tell me about BTC',
  } satisfies InferPayload;
  {
    const wallet = ethers.Wallet.createRandom();
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

testInfer();
