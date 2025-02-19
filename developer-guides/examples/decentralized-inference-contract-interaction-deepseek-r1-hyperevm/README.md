We just deployed DeepSeek-R1 on HyperEVM as a smart contract: https://hyperliquid.cloud.blockscout.com/address/0xf65CADd63E5196072E7171e5139AD4a48D5abBD1

DeepSeek-R1 is now unstoppable — running exactly as trained without any possibility of downtime, censorship, fraud, or third-party interference.

Let's interact with it.

```
npm install && npx hardhat compile && RPC_URL=<YOUR_RPC_URL> PRIVATE_KEY=<0xYOUR_PRIVATE_KEY> CHOSEN_MODEL="DeepSeek-R1-Distill-Llama-70B" USER_PROMPT="Give a short overview of p2p system"  npm run sendUniverseAgentRequest:hyper_mainnet
```

## STEP 1: Get the Chain ID and Model Name

Here is the list of supported chains and models by Eternal AI:

https://docs.eternalai.org/eternal-ai/decentralized-inference-api/onchain-models 

For this developer guide, the Chain ID is `999` (HyperEVM), and the Model Name is `DeepSeek-R1-Distill-Llama-70B`.

## STEP 2: Make the first call to the DeepSeek-R1 contract

Interact with the DeepSeek smart contract using TypeScript — the same way you interact with any smart contracts while building dapps.

Let's call the infer() function with a simple prompt: "Give a short overview of p2p system"

<img width="1430" alt="image" src="https://github.com/user-attachments/assets/8d9d4164-72e6-45d0-bf3e-c22dd82e9209" />


## STEP 3: Retrieve the response

Eternal AI uses an async programming model for decentralized inference.

Periodically check with the PromptScheduler contract to retrieve the response returned by DeepSeek-R1.

<img width="1261" alt="image" src="https://github.com/user-attachments/assets/220bc232-7fb1-4b19-9cfb-df890b972c97" />


## STEP 4: Run the code

Complete example code can be found at: https://github.com/eternalai-org/ai-powered-dapps/blob/main/examples/UniverseDagents/scripts/sendUniverseAgentRequest.ts

You can run the code with the following command. Replace <YOUR_KEY> with your development wallet's private key. The wallet should have some HIP on HyperEVM to pay the network fee.

```
npx hardhat compile && RPC_URL=https://rpc.hyperliquid.xyz/evm  PRIVATE_KEY=<YOUR_KEY>  CHOSEN_MODEL="DeepSeek-R1-Distill-Llama-70B"  USER_PROMPT="Give a short overview of p2p system"  npm run sendUniverseAgentRequest:hyper_mainnet
```

## STEP 5: Review the onchain prompt transaction

Because DeepSeek-R1 is a smart contract, every interaction with it is onchain on HyperEVM
. 

Let's examine the prompt tx on HyperEVM Explorer. You can verify that it runs on DeepSeek-R1 and see its content.

https://HyperEVM.cloud.blockscout.com/tx/0x207b26c3aca80885ac9d60e2fa38e3674e2b58ec7744535c4c18dd791734930e

<img width="622" alt="image" src="https://github.com/user-attachments/assets/4518b545-a5d1-464a-b52f-2a39c6dc1e29" />

## STEP 6: Verify the onchain response transaction

Now, let's look at the response transaction on HyperEVM Explorer. You can see the actual response content. Everything is onchain and verifiable.

https://HyperEVM.cloud.blockscout.com/tx/0x38e15c057cbe43d9f529042efa77276d2fe52077f7c1613804d5695976236f07

<img width="1674" alt="image" src="https://github.com/user-attachments/assets/f39acb55-97bf-49aa-b24d-e366337e347e" />


