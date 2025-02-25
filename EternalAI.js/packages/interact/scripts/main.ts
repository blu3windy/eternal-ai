import { ethers } from 'ethers';
import { default as Interact } from '../src/interact';
import { InferPayloadWithMessages, InferPayloadWithPrompt } from '../src/types';
import { ChainId } from '../src/constants';

async function testInferV1() {
  const inferPayload = {
    chainId: ChainId.BSC,
    model: 'NousResearch/Hermes-3-Llama-3.1-70B-FP8',
    prompt: 'Can you tell me about BTC',
  } satisfies InferPayloadWithPrompt;
  {
    const wallet = ethers.Wallet.createRandom();
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

async function testInferV2() {
  const inferPayload = {
    chainId: ChainId.BSC,
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
  } satisfies InferPayloadWithMessages;
  {
    const wallet = ethers.Wallet.createRandom();
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

testInferV2();
