import { Message } from './methods/infer/types';

export type InferPayload = {
  model: string;
  chainId: string | number;
  messages: Message[];
};
