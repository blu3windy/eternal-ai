import { prompt } from '../src/index';
import { PromptPayload } from '../src/prompt/types';

const payload: PromptPayload = {
  privateKey: 'your private key',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What’s the weather?' },
  ],
};

const main = async () => {
  const result = await prompt(payload);
  console.log(result);
};

main();
