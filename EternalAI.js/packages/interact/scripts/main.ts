import { ethers } from 'ethers';
import { default as Interact } from '../src/interact';
import { InferPayloadWithMessages, InferPayloadWithPrompt } from '../src/types';
import { ChainId } from '../src/constants';

export const AGENT_CONTRACT_ADDRESSES: Record<ChainId, string> = {
  56: '0x3B9710bA5578C2eeD075D8A23D8c596925fa4625',
  8453: '0x643c45e89769a16bcb870092bd1efe4696cb2ce7',
};

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string);

async function testInferV1() {
  const inferPayload = {
    chainId: ChainId.BSC,
    agentAddress: AGENT_CONTRACT_ADDRESSES[ChainId.BSC],
    prompt: 'Can you tell me about BTC',
  } satisfies InferPayloadWithPrompt;
  {
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

async function testInferV2() {
  const inferPayload = {
    chainId: ChainId.BSC,
    agentAddress: AGENT_CONTRACT_ADDRESSES[ChainId.BSC],
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
    isLightHouse: true,
  } satisfies InferPayloadWithMessages;
  {
    const interact = new Interact(wallet);
    await interact.infer(inferPayload);
  }
}

testInferV2();
