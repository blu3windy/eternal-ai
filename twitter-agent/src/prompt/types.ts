import { Wallet } from 'ethers';

export interface TwitterPost {
  content: string;
  media?: string[];
}

export interface PromptRequest {
  privateKey: string;
  action: 'post' | 'like' | 'retweet';
  data: TwitterPost;
}

export interface PromptResponse {
  success: boolean;
  message?: string;
  error?: string;
  url?: string;
}

export type HandlePrompt = (wallet: Wallet) => Promise<void>; 