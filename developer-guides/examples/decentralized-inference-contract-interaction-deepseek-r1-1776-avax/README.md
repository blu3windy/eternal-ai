# Decentralized inference contract interaction with DeepSeek-R1 1776 on Avalanche

We just deployed DeepSeek-R1 1776 on Avalanche as a smart contract: https://snowtrace.io/address/0x31c4e363d85452B85f8888c4744Ce00efcc2E0aF

DeepSeek-R1 1776 is now unstoppable — running exactly as trained without any possibility of downtime, censorship, fraud, or third-party interference.

Let's interact with it.

```
npm install && npx hardhat compile && RPC_URL=<YOUR_RPC_URL> PRIVATE_KEY=<0xYOUR_PRIVATE_KEY> CHOSEN_MODEL="unsloth/r1-1776-GGUF" USER_PROMPT="Give a short overview of p2p system"  npm run sendUniverseAgentRequest:avax_mainnet
```

## STEP 1: Get the Chain ID and Model Name

Here is the list of supported chains and models by Eternal AI:

https://docs.eternalai.org/eternal-ai/decentralized-inference-api/onchain-models 

For this developer guide, the Chain ID is `43114` (Avalanche), and the Model Name is `unsloth/r1-1776-GGUF`.

## STEP 2: Make the first call to the DeepSeek-R1 1776 contract

Interact with the DeepSeek smart contract using TypeScript — the same way you interact with any smart contracts while building dapps.

Let's call the infer() function with a simple prompt: "Who is Xi Jinping?"

<img width="1430" alt="image" src="https://github.com/user-attachments/assets/8d9d4164-72e6-45d0-bf3e-c22dd82e9209" />


## STEP 3: Retrieve the response

Eternal AI uses an async programming model for decentralized inference.

Periodically check with the PromptScheduler contract to retrieve the response returned by DeepSeek-R1 1776.

<img width="1261" alt="image" src="https://github.com/user-attachments/assets/220bc232-7fb1-4b19-9cfb-df890b972c97" />


## STEP 4: Run the code

Complete example code can be found at: https://github.com/eternalai-org/ai-powered-dapps/blob/main/examples/UniverseDagents/scripts/sendUniverseAgentRequest.ts

You can run the code with the following command. Replace <YOUR_KEY> with your development wallet's private key. The wallet should have some AVAX on Avalanche to pay the network fee.

```
npx hardhat compile && RPC_URL=https://api.avax.network/ext/bc/C/rpc  PRIVATE_KEY=<YOUR_KEY>  CHOSEN_MODEL="unsloth/r1-1776-GGUF"  USER_PROMPT="Who is Xi Jinping?"  npm run sendUniverseAgentRequest:avax_mainnet
```

## STEP 5: Review the onchain prompt transaction

Because DeepSeek-R1 is a smart contract, every interaction with it is onchain on Avalanche
. 

Let's examine the prompt tx on Avalanche Explorer. You can verify that it runs on DeepSeek-R1 1776 and see its content.

https://snowtrace.io/tx/0xcbd8ad42218f29ad59a1d98a28ac73863fe658a38a5789760e2eac3b3bad164b

<img width="933" alt="image" src="https://github.com/user-attachments/assets/bce05bca-1cf5-4d10-bded-b1df88c0d322" />


## STEP 6: Verify the onchain response transaction

Now, let's look at the response transaction on Avalanche Explorer. You can see the actual response content. Everything is onchain and verifiable.

https://snowtrace.io/tx/0xecb2e1c41dbef13d8148989b745fc544f6d82268408bd70309d246fee29c4471

<img width="1013" alt="image" src="https://github.com/user-attachments/assets/f4b32dc7-d4f7-4ef3-8a38-00ef38d12a21" />

