import { ChainId } from './constants';
import { Message } from './methods/infer/types';

export type InferPayload = {
  model: string;
  chainId: ChainId;
  messages: Message[];
};
