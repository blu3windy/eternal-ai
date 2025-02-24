import { ChainId } from '@/constants';
import * as ethers from 'ethers';

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type CreateInferPayload = {
  model: string;
  chainId: ChainId;
  messages: Message[];
};

export type SendInferResponse = {
  inferenceId: string;
  creator: string;
  tx: string;
  receipt: ethers.providers.TransactionReceipt;
};

export type ListenInferPayload = SendInferResponse;
