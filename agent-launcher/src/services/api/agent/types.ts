export type ChatCompletionType = {
  role: string;
  content: string;
};

export type ChatCompletionPayload = {
  messages: ChatCompletionType[];
  agentId?: number;
  kb_id?: string;
  model_name?: string;
};

export interface IOnchainData {
  infer_id: string
  pbft_committee: any
  proposer: string
  infer_tx: string
  propose_tx: string
  input_cid: string
  output_cid: string
}

export type StreamResponseOption = {
  message?: string;
  onchain_data?: IOnchainData;
  isGeneratedDone?: boolean;
};

export type ChatCompletionStreamHandler = {
  onStream: (
    content: string,
    chunk: string,
    options: StreamResponseOption,
  ) => void;
  onFinish: (content: string, options: StreamResponseOption) => void;
  onFail: (err: any) => void;
};

export interface IChatMessage {
  id: string;
  replyTo?: string;
  senderId: string;
  is_reply: boolean;
  msg: string;
  name: string;
  type: 'human' | 'ai';
  status:
    | 'sending'
    | 'sent'
    | 'waiting'
    | 'receiving'
    | 'received'
    | 'read'
    | 'failed'
    | 'pre-done'
    | 'done';
  queryMessageState?: string;

  createdAt?: string;
  updatedAt?: string;
  tx_hash?: string;
  onchain_data?: IOnchainData;
}
