import { AgentType } from "../../../pages/home/list-agent";

export interface TwitterInfo {
  twitter_id: string;
  twitter_avatar: string;
  twitter_username: string;
  twitter_name: string;
  description?: string;
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

export interface IAgentToken {
  id: number;
  created_at: string;
  twitter_info_id: number;
  twitter_info: TwitterInfo;
  agent_id: string;
  agent_contract_id: string;
  agent_contract_address: string;
  agent_name: string;
  network_id: number;
  network_name: string;
  eth_address: string;
  tip_amount: string;
  wallet_balance: string;
  creator: string;
  mentions: number;
  x_followers: number;
  tip_eth_address: string;
  tip_btc_address: string;
  tip_sol_address: string;
  is_faucet: boolean;
  user_prompt: string;
  agent_snapshot_mission: AgentSnapshotMission[];
  token_name: string;
  token_symbol: string;
  token_address: string;
  token_image_url: string;
  token_mode: string;
  total_supply: number;
  usd_market_cap: number;
  price_usd: string;
  dex_url?: string;
  latest_twitter_post: null;
  personality: string;
  tmp_twitter_info: TwitterInfo;
  is_claimed: boolean;
  meme: Meme;
  token_network_id: number;
  token_network_name: string;
  active_latest_time?: string;
  base_token_symbol?: string;
  thumbnail?: string;
  agent_base_model: string;
  inference_calls: string;
  token_desc: string;
  agent_type: AgentType;
  kb_id?: number;
  source_url?: string;
  depend_agents?: string;
  required_wallet?: boolean;
  is_onchain?: boolean;
  prompt_calls: number;
  ipfsHash?: string;
  sizeGb?: number;
}

export interface Meme {
  id: number;
  created_at: Date;
  updated_at: Date;
  owner_address: string;
  owner: null;
  token_address: string;
  name: string;
  description: string;
  ticker: string;
  image: string;
  twitter: string;
  telegram: string;
  website: string;
  tx_hash: string;
  status: string;
  reply_count: number;
  last_reply: null;
  pool: string;
  uniswap_pool: string;
  supply: string;
  price: string;
  price_usd: string;
  price_last24h: string;
  volume_last24h: string;
  total_volume: string;
  base_token_symbol: string;
  percent: number;
  decimals: number;
  pool_fee: number;
  market_cap: string;
  total_balance: string;
  system_prompt: string;
  holders: number;
  shared: number;
  agent_info: null;
  latest_twitter_post: null;
  trade_url: string;
  network_id: string;
}

export type IChainConnected = {
  id: string;
  created_at: string;
  updated_at: string;
  chain_id: string;
  rpc: string;
  name: string;
  explorer: string;
  eai_erc20: string;
  nft_address: string;
  paymaster_address: string;
  paymaster_fee_zero: boolean;
  paymaster_token: string;
  workerhub_address: string;
  zk_sync: boolean;
  eai_native: boolean;
  formatBalance?: string;
  balance?: string;
  thumbnail?: string;
  tag?: string;
  model_ids?: string[];
  model_details?: any[];
  support_model_names?: {
    [key: string]: string;
  };
};
