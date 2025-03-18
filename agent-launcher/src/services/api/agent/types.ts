export interface TwitterInfo {
  twitter_id: string;
  twitter_avatar: string;
  twitter_username: string;
  twitter_name: string;
  description: string;
  re_link: boolean;
}

export interface AgentSnapshotMission {
  min_token_holding?: number;
  reward_amount?: number;
  reward_user?: number;
  id: number;
  user_prompt: string;
  interval: number;
  lookup_interval: number;
  tool_set: string;
  agent_type?: number;
  agent_base_model: string;
  topics?: string;
  is_twitter_search?: boolean;
  is_bing_search?: boolean;
  tokens?: any;
}

export interface INeynarSigners {
  id: string;
  uuid: string;
  status: string;
  fid: number;
  user_address: string;
  assistant_id: string;
}

export interface AgentInfo {
  token_mode?: string;
  token_network_id?: number;
  id: number;
  created_at: Date;
  twitter_info_id: number;
  twitter_info: TwitterInfo;
  agent_id: string;
  agent_name: string;
  agent_contract_id: string;
  agent_contract_address: string;
  eth_address: string;
  tip_eth_address: string;
  tip_btc_address: string;
  tip_sol_address: string;
  agent_snapshot_mission: AgentSnapshotMission[];
  network_id?: string;
  social_info?: Array<{ account_name: string; fee: number }>;
  token_chain_id?: string;
  thumbnail?: string;
  neynar_signers?: INeynarSigners;
  reply_enabled?: boolean;

  network_name: string;
  tip_amount: string;
  wallet_balance: string;
  creator: string;
  mentions: number;
  x_followers: number;
  is_faucet: boolean;

  token_address?: string;
  token_name?: string;
  token_image_url?: string;
  token_network_name?: string;
  token_status?: string;
  token_symbol?: string;
}

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
  infer_id: string;
  pbft_committee: any;
  proposer: string;
  infer_tx: string;
  propose_tx: string;
  input_cid: string;
  output_cid: string;
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
    options: StreamResponseOption
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
  type: "human" | "ai";
  status:
    | "sending"
    | "sent"
    | "waiting"
    | "receiving"
    | "received"
    | "read"
    | "failed"
    | "pre-done"
    | "done";
  queryMessageState?: string;

  createdAt?: string;
  updatedAt?: string;
  tx_hash?: string;
  onchain_data?: IOnchainData;
  attachments?: {
    type: 'image';
    url: string;
    previewUrl?: string;
  }[];
}

export enum EAgentTokenStatus {
  new = "new",
  created = "created",
  add_pool_1 = "add_pool_1",
  reached_mc = "reached_mc",
  add_pool_2 = "add_pool_2",
}
