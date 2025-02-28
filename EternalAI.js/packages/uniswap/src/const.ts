export const ETH_CHAIN_ID = '0x1';
export const BSC_CHAIN_ID = '0x38';
export const BASE_CHAIN_ID = '0x2105';

export const V1 = [ETH_CHAIN_ID, BASE_CHAIN_ID];
export const V2 = [BSC_CHAIN_ID];

export const ZeroAddress = '0x0000000000000000000000000000000000000000';

export const API_URL = 'https://api-dojo2.eternalai.org/api/';

export const SYSTEM_PROMPT = `
You are an intelligent assistant specialized in cryptocurrency trading. When a user requests a transaction, please respond in a specific JSON format.

For example, if the user says: "Swap 1 ETH to USDT on Uniswap with Ethereum Chain(or Base chain, BNB chain...)" you should respond as follows:

{
  "function_name": "swap",
  "token_in": "symbol of Input token",
  "token_in_address": "contract erc20 address of Input token",
  "token_in_amount": 1.0,
  "token_out": "symbol of Output token",
  "token_out_address": "contract erc20 address of Output token",
}

Please no fill any comment in json result. Make sure that the token addresses are accurate and comply with ERC20 standards.

If a user asks about the price of a token, respond with the following JSON format:

{
  "function_name": "getPrice",
  "token_in": "symbol of Input token",
  "token_in_address": "contract erc20 address of Input token"
}

If the user does not want to trade, respond as a trading expert or UniSwap master, providing insights, tips, or strategies related to cryptocurrency trading
`;

export const ERROR_TRANSACTION_RESPONSE_SYSTEM_PROMPT = `
You are an expert assistant specialized in interpreting and translating technical error messages from blockchain systems, particularly Ethereum, into clear, meaningful, and easy-to-understand explanations. Your task is to analyze error messages, which may include codes, JSON data, and stack traces, and provide a simplified summary that conveys the essential problem and potential solutions without overwhelming the user with unnecessary technical details. Follow these steps to process and respond to queries:
Identify the Core Issue: Examine the error message to determine the primary problem (e.g., "cannot estimate gas"). Focus on key phrases, error codes (e.g., UNPREDICTABLE_GAS_LIMIT, -32003), and server responses (e.g., "out of gas: gas required exceeds: 42122") to understand what went wrong.

Understand the Context: Recognize that the error likely relates to Ethereum transactions, where "gas" represents the computational effort required to process operations. Note any specific methods (e.g., eth_estimateGas), transaction details (e.g., from, to, data, value), or parameters (e.g., maxFeePerGas) to provide context.

Simplify Technical Terms: Translate complex blockchain terminology into plain language. For example:
"Gas" → "Computational cost or network fee."

"eth_estimateGas" → "A tool to predict the cost of a transaction."

"Out of gas" → "The transaction needed more resources than provided."

"Gas limit" → "The maximum amount of resources allowed for the transaction."

Determine the Audience: If the message includes detailed stack traces or developer-specific codes (e.g., abstract-signer/5.8.0), assume the audience is technical (e.g., developers) unless otherwise specified. Adjust the explanation’s depth accordingly:
For developers: Include actionable technical advice (e.g., "Set a higher gas limit").

For end-users: Focus on the problem and next steps (e.g., "Contact support").

Extract Key Details: Pull out critical information from the error, such as:
Why the error occurred (e.g., simulation ran out of gas).

Specific values (e.g., "exceeds 42122 gas units").

Links to documentation (e.g., https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT).

Provide a Clear Explanation: Structure your response with:
What happened: A concise statement of the issue.

Why it happened: A simplified reason based on the error details.

What to do: Practical suggestions to resolve or work around the issue.

Keep it concise and straightforward, focusing on the user's needs and understanding. Avoid jargon, technical complexities, or irrelevant details that may confuse or overwhelm the user. Your goal is to empower users with the knowledge to address the error effectively and continue their blockchain activities with confidence.
`;

export const FORMAT_GET_PRICE_RESPONSE_SYSTEM_PROMPT = `
You are an assistant specialized in interpreting and translating messages about cryptocurrency tokens on the Ethereum blockchain. These messages typically contain the token's name, its contract address, and its current price in USD. Your task is to translate these messages into clear and easy-to-understand statements.
`;

export const RPC_URL: { [key: string]: string } = {
  ETH_CHAIN_ID: 'https://eth.llamarpc.com',
  BSC_CHAIN_ID: 'https://bsc-dataseed.binance.org/',
  BASE_CHAIN_ID: 'https://base.llamarpc.com',
};

export const getRPC = (chain_id: string) => {
  switch (chain_id) {
    case ETH_CHAIN_ID:
      return RPC_URL.ETH_CHAIN_ID;
    case BSC_CHAIN_ID:
      return RPC_URL.BSC_CHAIN_ID;
    case BASE_CHAIN_ID:
      return RPC_URL.BASE_CHAIN_ID;
    default:
      return RPC_URL.ETH_CHAIN_ID;
  }
};

export const IPFS = 'ipfs://';
export const LIGHTHOUSE_IPFS = 'https://gateway.lighthouse.storage/ipfs/';

export const AGENT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'promptScheduler_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'modelAddress_',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'systemPrompt_',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'storageInfo_',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidShortString',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'str',
        type: 'string',
      },
    ],
    name: 'StringTooLong',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fromDelegate',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toDelegate',
        type: 'address',
      },
    ],
    name: 'DelegateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBalance',
        type: 'uint256',
      },
    ],
    name: 'DelegateVotesChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'EIP712DomainChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'hybridModel',
        type: 'address',
      },
    ],
    name: 'ModelUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'request',
        type: 'bytes',
      },
    ],
    name: 'PromptPerformed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'promptScheduler',
        type: 'address',
      },
    ],
    name: 'PromptSchedulerHubUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'systemPrompt',
        type: 'string',
      },
    ],
    name: 'SystemPromptUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'pos',
        type: 'uint32',
      },
    ],
    name: 'checkpoints',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'fromBlock',
            type: 'uint32',
          },
          {
            internalType: 'uint224',
            name: 'votes',
            type: 'uint224',
          },
        ],
        internalType: 'struct ERC20Votes.Checkpoint',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'clock',
    outputs: [
      {
        internalType: 'uint48',
        name: '',
        type: 'uint48',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'delegates',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      {
        internalType: 'bytes1',
        name: 'fields',
        type: 'bytes1',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'verifyingContract',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: 'extensions',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fetchCode',
    outputs: [
      {
        internalType: 'string',
        name: 'logic',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFileStorageChunkInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'pointer',
                type: 'address',
              },
              {
                internalType: 'uint32',
                name: 'start',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'end',
                type: 'uint32',
              },
            ],
            internalType: 'struct BytecodeSlice[]',
            name: 'slices',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct File',
        name: 'file',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getModelAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'timepoint',
        type: 'uint256',
      },
    ],
    name: 'getPastTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'timepoint',
        type: 'uint256',
      },
    ],
    name: 'getPastVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPromptSchedulerAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getResultById',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStorageInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'filename',
            type: 'string',
          },
        ],
        internalType: 'struct IUtilityAgent.StorageInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStorageMode',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSystemPrompt',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'numCheckpoints',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'request',
        type: 'bytes',
      },
    ],
    name: 'prompt',
    outputs: [
      {
        internalType: 'uint256',
        name: 'inferId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'filename',
        type: 'string',
      },
    ],
    name: 'updateFileName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'modelAddress',
        type: 'address',
      },
    ],
    name: 'updateModelAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'promptScheduler',
        type: 'address',
      },
    ],
    name: 'updatePromptScheduler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'systemPrompt',
        type: 'string',
      },
    ],
    name: 'updateSystemPrompt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const HYBRID_MODEL_ABI = [
  {
    inputs: [],
    name: 'ModelIdAlreadySet',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newValue',
        type: 'uint256',
      },
    ],
    name: 'IdentifierUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'newValue',
        type: 'string',
      },
    ],
    name: 'MetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'newValue',
        type: 'string',
      },
    ],
    name: 'NameUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
    ],
    name: 'WorkerHubUpdate',
    type: 'event',
  },
  {
    inputs: [],
    name: 'identifier',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '_rawFlag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_flag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_workerHub',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_modelCollection',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_identifier',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_metadata',
        type: 'string',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'metadata',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'modelCollection',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_modelId',
        type: 'uint256',
      },
    ],
    name: 'setModelId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_identifier',
        type: 'uint256',
      },
    ],
    name: 'updateIdentifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadata',
        type: 'string',
      },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    name: 'updateName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_workerHub',
        type: 'address',
      },
    ],
    name: 'updateWorkerHub',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'workerHub',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

export const WORKER_HUB_ABI = [
  {
    inputs: [],
    name: 'AlreadyCommitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyRevealed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadySeized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadySubmitted',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'value',
        type: 'bytes32',
      },
    ],
    name: 'Bytes32Set_DuplicatedValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotFastForward',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CommitTimeout',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedTransfer',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidCommitment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidContext',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInferenceStatus',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMiner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidReveal',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidRole',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotCommitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEnoughMiners',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyAssignedWorker',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RevealTimeout',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubmitTimeout',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Uint256Set_DuplicatedValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Unauthorized',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assigmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'commitment',
        type: 'bytes32',
      },
    ],
    name: 'CommitmentSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'modelAddress',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'enum IWorkerHub.DAOTokenReceiverRole',
            name: 'role',
            type: 'uint8',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenReceiverInfor[]',
        name: 'receivers',
        type: 'tuple[]',
      },
    ],
    name: 'DAOTokenMintedV2',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: 'oldValue',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: 'newValue',
        type: 'tuple',
      },
    ],
    name: 'DAOTokenPercentageUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum IWorkerHub.InferenceStatus',
        name: 'newStatus',
        type: 'uint8',
      },
    ],
    name: 'InferenceStatusUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
    ],
    name: 'MinerRoleSeized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'expiredAt',
        type: 'uint40',
      },
    ],
    name: 'NewAssignment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'model',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'originInferenceId',
        type: 'uint256',
      },
    ],
    name: 'NewInference',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'model',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'originInferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'input',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'flag',
        type: 'bool',
      },
    ],
    name: 'RawSubmitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assigmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'nonce',
        type: 'uint40',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'output',
        type: 'bytes',
      },
    ],
    name: 'RevealSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assigmentId',
        type: 'uint256',
      },
    ],
    name: 'SolutionSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'StreamedData',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'assignmentNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'assignments',
    outputs: [
      {
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'commitment',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'digest',
        type: 'bytes32',
      },
      {
        internalType: 'uint40',
        name: 'revealNonce',
        type: 'uint40',
      },
      {
        internalType: 'address',
        name: 'worker',
        type: 'address',
      },
      {
        internalType: 'enum IWorkerHub.AssignmentRole',
        name: 'role',
        type: 'uint8',
      },
      {
        internalType: 'enum IWorkerHub.Vote',
        name: 'vote',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'output',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assignId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_commitment',
        type: 'bytes32',
      },
    ],
    name: 'commit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assignmentId',
        type: 'uint256',
      },
    ],
    name: 'getAssignmentInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'inferenceId',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'commitment',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'digest',
            type: 'bytes32',
          },
          {
            internalType: 'uint40',
            name: 'revealNonce',
            type: 'uint40',
          },
          {
            internalType: 'address',
            name: 'worker',
            type: 'address',
          },
          {
            internalType: 'enum IWorkerHub.AssignmentRole',
            name: 'role',
            type: 'uint8',
          },
          {
            internalType: 'enum IWorkerHub.Vote',
            name: 'vote',
            type: 'uint8',
          },
          {
            internalType: 'bytes',
            name: 'output',
            type: 'bytes',
          },
        ],
        internalType: 'struct IWorkerHub.Assignment',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inferenceId',
        type: 'uint256',
      },
    ],
    name: 'getAssignmentsByInference',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inferenceId',
        type: 'uint256',
      },
    ],
    name: 'getInferenceInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256[]',
            name: 'assignments',
            type: 'uint256[]',
          },
          {
            internalType: 'bytes',
            name: 'input',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeL2',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeTreasury',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'modelAddress',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'submitTimeout',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'commitTimeout',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'revealTimeout',
            type: 'uint40',
          },
          {
            internalType: 'enum IWorkerHub.InferenceStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'processedMiner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'referrer',
            type: 'address',
          },
        ],
        internalType: 'struct IWorkerHub.Inference',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_modelAddress',
        type: 'address',
      },
    ],
    name: 'getMinFeeToUse',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTreasuryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_flag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'inferenceNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wEAI',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_daoToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stakingHub',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: '_feeL2Percentage',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_feeTreasuryPercentage',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: '_minerRequirement',
        type: 'uint8',
      },
      {
        internalType: 'uint40',
        name: '_submitDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: '_commitDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: '_revealDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint16',
        name: '_feeRatioMinerValidor',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: '_daoTokenReward',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: '_daoTokenPercentage',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_referrers',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_referees',
        type: 'address[]',
      },
    ],
    name: 'registerReferrer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inferenceId',
        type: 'uint256',
      },
    ],
    name: 'resolveInference',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assignId',
        type: 'uint256',
      },
      {
        internalType: 'uint40',
        name: '_nonce',
        type: 'uint40',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'reveal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assignmentId',
        type: 'uint256',
      },
    ],
    name: 'seizeMinerRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newDAOTokenReward',
        type: 'uint256',
      },
    ],
    name: 'setDAOTokenReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wEAI',
        type: 'address',
      },
    ],
    name: 'setWEAIAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assigmentId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'submitSolution',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isReferred',
        type: 'bool',
      },
    ],
    name: 'validateDAOSupplyIncrease',
    outputs: [
      {
        internalType: 'bool',
        name: 'notReachedLimit',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

export const PROMPT_SCHEDULER_ABI = [
  {
    inputs: [],
    name: 'AlreadyCommitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyRevealed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadySeized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadySubmitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotFastForward',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CommitTimeout',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidCommitment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidContext',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInferenceStatus',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMiner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidReveal',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidRole',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotCommitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEnoughMiners',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyAssignedWorker',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RevealTimeout',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SubmitTimeout',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Uint256Set_DuplicatedValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Unauthorized',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assigmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'commitment',
        type: 'bytes32',
      },
    ],
    name: 'CommitmentSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'modelAddress',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'enum IWorkerHub.DAOTokenReceiverRole',
            name: 'role',
            type: 'uint8',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenReceiverInfor[]',
        name: 'receivers',
        type: 'tuple[]',
      },
    ],
    name: 'DAOTokenMintedV2',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: 'oldValue',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        indexed: false,
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: 'newValue',
        type: 'tuple',
      },
    ],
    name: 'DAOTokenPercentageUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum IWorkerHub.InferenceStatus',
        name: 'newStatus',
        type: 'uint8',
      },
    ],
    name: 'InferenceStatusUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
    ],
    name: 'MinerRoleSeized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'expiredAt',
        type: 'uint40',
      },
    ],
    name: 'NewAssignment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'model',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'originInferenceId',
        type: 'uint256',
      },
    ],
    name: 'NewInference',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferenceId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'model',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'originInferenceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'input',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'flag',
        type: 'bool',
      },
    ],
    name: 'RawSubmitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assigmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'nonce',
        type: 'uint40',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'output',
        type: 'bytes',
      },
    ],
    name: 'RevealSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'miner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'inferId',
        type: 'uint256',
      },
    ],
    name: 'SolutionSubmission',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'assignmentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'StreamedData',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inferenceId',
        type: 'uint256',
      },
    ],
    name: 'getInferenceInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeL2',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeTreasury',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'modelAddress',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'submitTimeout',
            type: 'uint40',
          },
          {
            internalType: 'enum IWorkerHub.InferenceStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'processedMiner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'referrer',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'input',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'output',
            type: 'bytes',
          },
        ],
        internalType: 'struct IWorkerHub.Inference',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_modelAddress',
        type: 'address',
      },
    ],
    name: 'getMinFeeToUse',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMinerRequirement',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSubmitDuration',
    outputs: [
      {
        internalType: 'uint40',
        name: '',
        type: 'uint40',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTreasuryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_flag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'inferenceNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wEAI',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_daoToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stakingHub',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: '_feeL2Percentage',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_feeTreasuryPercentage',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: '_minerRequirement',
        type: 'uint8',
      },
      {
        internalType: 'uint40',
        name: '_submitDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint16',
        name: '_feeRatioMinerValidor',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: '_daoTokenReward',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'minerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'userPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'referrerPercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'refereePercentage',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'l2OwnerPercentage',
            type: 'uint16',
          },
        ],
        internalType: 'struct IWorkerHub.DAOTokenPercentage',
        name: '_daoTokenPercentage',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_referrers',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_referees',
        type: 'address[]',
      },
    ],
    name: 'registerReferrer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_daoToken',
        type: 'address',
      },
    ],
    name: 'setDAOTokenAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_stakingHub',
        type: 'address',
      },
    ],
    name: 'setStakingHubAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint40',
        name: '_submitDuration',
        type: 'uint40',
      },
    ],
    name: 'setSubmitDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wEAI',
        type: 'address',
      },
    ],
    name: 'setWEAIAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingHub',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_inferId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'submitSolution',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
