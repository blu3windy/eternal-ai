import { prompt } from '../src/index';
import { PromptPayload } from '../src/prompt/type';

// Example usage:
const payload: PromptPayload = {
  private_key: process.env.PRIVATE_KEY!!,
  prompt: 'swap 1 ETH to USDT',
  api_key: process.env.API_KEY!!,
  host: process.env.HOST,
  model: process.env.MODEL,
  chain_id_swap: '0x1',
};

console.log(prompt(payload));
