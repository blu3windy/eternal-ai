We just deployed DeepSeek-R1 on HyperEVM as a smart contract: https://hyperliquid.cloud.blockscout.com/address/0xf65CADd63E5196072E7171e5139AD4a48D5abBD1

DeepSeek-R1 is now unstoppable — running exactly as trained without any possibility of downtime, censorship, fraud, or third-party interference.

Let's interact with it.

```
npm install && npx hardhat compile && RPC_URL=<YOUR_RPC_URL> PRIVATE_KEY=<0xYOUR_PRIVATE_KEY> CHOSEN_MODEL="DeepSeek-R1-Distill-Llama-70B" USER_PROMPT="Give a short overview of p2p system"  npm run sendUniverseAgentRequest:ethereum_mainnet

```

STEP 1: Get the Chain ID and Model Name

Here is the list of supported chains and models by Eternal AI:

https://docs.eternalai.org/eternal-ai/decentralized-inference-api/onchain-models 

For this developer guide, the Chain ID is `999` (HyperEVM), and the Model Name is `DeepSeek-R1-Distill-Llama-70B`.

STEP 2: Make the first call to the DeepSeek-R1 contract

Interact with the DeepSeek smart contract using TypeScript — the same way you interact with any smart contracts while building dapps.

Let's call the infer() function with a simple prompt: "Give a short overview of p2p system"

STEP 3: Retrieve the response

Eternal AI uses an async programming model for decentralized inference.

Periodically check with the PromptScheduler contract to retrieve the response returned by DeepSeek-R1.

STEP 4: Run the code

Complete example code can be found at: https://github.com/eternalai-org/ai-powered-dapps/blob/main/examples/UniverseDagents/scripts/sendUniverseAgentRequest.ts

You can run the code with the following command. Replace <YOUR_KEY> with your development wallet's private key. The wallet should have some HIP on HyperEVM to pay the network fee.

```
npx hardhat compile && RPC_URL=https://rpc.hyperliquid.xyz/evm  PRIVATE_KEY=<YOUR_KEY>  CHOSEN_MODEL="DeepSeek-R1-Distill-Llama-70B"  USER_PROMPT="Give a short overview of p2p system"  npm run sendUniverseAgentRequest:base_mainnet
```

STEP 5: Review the onchain prompt transaction

Because DeepSeek-V3 is a smart contract, every interaction with it is onchain on 
@base
. 

Let's examine the prompt tx on BaseScan. You can verify that it runs on DeepSeek v3 and see its content.

https://basescan.org/tx/0x641c26eff85f9486dace2d4ac0558b3c8da576b9e3e79773bb94a817fb8db45c

