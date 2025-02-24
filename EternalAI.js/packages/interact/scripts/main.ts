import { ethers } from 'ethers';
import { default as Interact } from '../src/interact';
import { InferPayload } from '../src/types';

async function testInfer() {
  const inferPayload = {
    chainId: 8453,
    model: 'NousResearch/Hermes-3-Llama-3.1-70B-FP8',
    messages: [
      {
        role: 'system',
        content: 'You are a BTC master',
      },
      {
        role: 'user',
        content: 'Can you tell me about BTC',
      },
    ],
  } satisfies InferPayload;
  {
    const wallet = ethers.Wallet.createRandom();
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

testInfer();
