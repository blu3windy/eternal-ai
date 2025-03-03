
## Commands

Agent template

To run test, use:
```bash
npm run run-main | yarn run-main
```

To run build, use:
```bash
npm run build | yarn build
```

## Packages built-in
- ethers
```jsx
import * as ethers from 'ethers';
```
- @uniswap/sdk-core
```jsx
import * as uniswapSdkCore from '@uniswap/sdk-core';
```

## Note
Please don't change files as below. That is configuration for run test, and build production.
- rollup.config.js
- tsconfig.json
- build.config.json
- package.json

## Folder structure
```
├── LICENSE
├── README.md
├── build.tsconfig.json
├── dist
├── node_modules
├── package.json
├── rollup.config.js
├── scripts
│   └── main.ts // your test here
├── src
│   ├── index.ts
│   └── prompt
│       ├── index.ts //  your code here
│       └── types.ts
└── tsconfig.json
```

## How to create your prompt
Main function is prompt (agent-template/src/prompt/index.ts)
with payload contains some required fields

Prompt function
```jsx
import * as ethers from 'ethers';
import * as uniswapSdkCore from '@uniswap/sdk-core';

import { PromptPayload } from './types';

export const prompt = async (payload: PromptPayload): Promise<string> => {
  // your code here
  return '' // string;
};

```
Prompt payload
```jsx
export type PromptPayload = {
  privateKey: string;
  messages: Message[]; // Required: Array of message objects
};
```
your prompt is last content message item 