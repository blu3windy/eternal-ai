import { ChainId } from './constants';
import { Message } from './methods/infer/types';

export type InferPayloadWithPrompt = {
  model: string;
  chainId: ChainId;
  prompt: string;
};

export type InferPayloadWithMessages = {
  model: string;
  chainId: ChainId;
  messages: Message[];
};
