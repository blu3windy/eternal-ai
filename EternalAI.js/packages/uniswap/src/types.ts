// Define the message structure for the 'messages' array
type Message = {
  role: 'system' | 'user' | 'assistant' | 'tool'; // Common roles; 'tool' for tool responses
  content: string; // The text content of the message
  name?: string; // Optional name for multi-agent scenarios
};

// Define the tool structure for the 'tools' array
type Tool = {
  type: 'function'; // Currently, 'function' is the primary supported type
  function: {
    name: string;
    description?: string;
    parameters: {
      type: 'object';
      properties: Record<string, { type: string; description?: string }>;
      required?: string[];
    };
  };
};

// Define the tool choice structure
type ToolChoiceFunction = {
  type: 'function';
  function: {
    name: string;
  };
};

// Union type for 'tool_choice'
type ToolChoice = 'none' | 'auto' | ToolChoiceFunction;

// Define the response format structure
type ResponseFormat = {
  type: 'text' | 'json_object';
};

// The main PromptPayload interface with all parameters
export type PromptPayload = {
  // model: string; // Required: e.g., "gpt-4o"
  privateKey: string;
  messages: Message[]; // Required: Array of message objects
  temperature?: number; // Optional: 0 to 2, default 1.0
  max_tokens?: number; // Optional: Integer, e.g., 150
  top_p?: number; // Optional: 0 to 1, default 1.0
  frequency_penalty?: number; // Optional: -2.0 to 2.0, default 0
  presence_penalty?: number; // Optional: -2.0 to 2.0, default 0
  stop?: string | string[] | null; // Optional: e.g., "\n" or ["\n", "STOP"]
  n?: number; // Optional: Integer, default 1
  stream?: boolean; // Optional: Boolean, default false
  tools?: Tool[]; // Optional: Array of tool definitions
  tool_choice?: ToolChoice; // Optional: "none", "auto", or specific tool, default "auto"
  response_format?: ResponseFormat; // Optional: e.g., { type: "json_object" }
  seed?: number | null; // Optional: Integer for reproducibility, e.g., 42
};

import { TransactionState } from './libs/providers';

export type TTransactionResponse = {
  state: TransactionState | null;
  tx: any;
  message?: string;
};

export type TTokenInfo = {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: string;
  usdPrice: number;
  usdPriceFormatted: string;
  '24hrPercentChange': string;
  exchangeAddress: string;
  exchangeName: string;
  tokenAddress: string;
  toBlock: string;
  possibleSpam: boolean;
  verifiedContract: boolean;
  pairAddress: string;
  pairTotalLiquidityUsd: string;
};
