export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type InferPayload = {
  model: string;
  chainId: string;
  messages: Message[];
};
