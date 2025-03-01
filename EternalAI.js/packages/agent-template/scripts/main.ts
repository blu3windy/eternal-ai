import { prompt } from '../src/index';
import { PromptPayload } from '../src/prompt/types';

const payload: PromptPayload = {
  privateKey: 'your private key',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What’s the weather?' },
  ],
  temperature: 0.7,
  max_tokens: 100,
  top_p: 0.9,
  frequency_penalty: 0.5,
  presence_penalty: 0.3,
  stop: ['\n'],
  n: 1,
  stream: false,
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a city',
        parameters: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'The city name' },
          },
          required: ['city'],
        },
      },
    },
  ],
  tool_choice: 'auto',
  response_format: { type: 'text' },
  seed: 42,
};

const main = async () => {
  const result = await prompt(payload);
  console.log(result);
};

main();
