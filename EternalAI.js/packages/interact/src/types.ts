import { ChainId } from './constants';
import { Message } from './methods/infer/types';

type InferPayloadBase = {
  agentAddress: string;
  isLightHouse?: boolean;
};

export type InferPayloadWithPrompt = InferPayloadBase & {
  chainId: ChainId;
  prompt: string;
};

export type InferPayloadWithMessages = InferPayloadBase & {
  chainId: ChainId;
  messages: Message[];
};
