
# Decentralized Inference API with DeepHermes-3 on Base

This developer guide shows you how to use Decentralized Inference API with DeepHermes-R1 on Base.

* **Decentralized**: Use Eternal AI's Decentralized Inference API instead of OpenAI's Centralized API.
* **Onchain-verifiable AI**: Don't trust AI, verify them. All inferences are recorded onchain and verifiable by anyone.
* **Unstoppable**: All inference runs exactly as coded on Base without any possibility of censorship, fraud, or third-party interference.
* **Permissionless**: Anyone can call the Decentralized Inference API at any time without a KYC or permission.
* **SOTA model**: DeepHermes R1 is the state-of-the-art AI model for reasoning.

## Step 1: Get your Decentralized Inference API key

1. Go to http://eternalai.org/api
2. Login with X (Twitter)
3. Get the Decentralized Inference API key for Base

It's free.

## Step 2: Send your first Onchain DeepHermes-R1 call

We will ask DeepHermes to tell you about an overview of P2P system.

Let's run the `chat.js` script.

1. Enter your API key
2. Set the system prompt as ```You are a 10x engineer.```
3. Set the user prompt as ```Give a short overview of p2p system```


```
ETERNALAI_API_KEY="YOUR-API-KEY" SYSTEM_PROMPT="YOUR-SYSTEM-PROMPT" USER_PROMPT="YOUR-USER-PROMPT" node chat.js
```

For those curious about how decentralized inference works: once the prompt is sent onchain, miners are randomly selected into a pBFT committee. They will first fetch the [DeepHermes model stored on Filecoin](https://gateway.lighthouse.storage/ipfs/bafkreigq7yhawmvs7x3hs366wwdkkimvf26admql3sqtl6a4o2nwrbdvka), a decentralized storage network, and then run inference. ```2/3+1``` of the miners must provide the same deterministic response.

## Step 3: Receive the Onchain DeepHermes response

You'll find the following info in the response.

1. The pBFT committee handling the inference request.
2. The response proposer and verifiers
3. The onchain prompt transaction
4. The onchain response transaction
5. The response

```
A peer-to-peer (P2P) system is a network model where individual data providers and data consumers operate in ad hoc and decentralized global mesh, which means nodes in the network communicate and coordinate with each other without the need for a central server or intermediary. In Blockchain terms: 1. Nodes participate in the network, sharing, and maintaining a distributed consensus of the ledger (blockchain).  2. Through a series of algorithmic checks and balances, especially the Proof of Work mechanism in Bitcoin, the network ensures that only valid blocks are added to the chain.  3. Nodes exchange blocks and transactions with each other, ensuring that no single node controls the entire network. 4. This network ensures transnational trust between parties, also known as 'trustless' transactions. Without trust in the central authority, the parties can engage in the transaction on the network without fear of fraud. 5. Benefits can include greater security, anonymity, and efficiency.  By leveraging decentralized infrastructure and new technologies, P2P systems provide an innovative alternative to traditional centralized structures.

Onchain Data: {
  "infer_id": "25096",
  "pbft_committee": [
    "0xcdd1e241b24d705161db488a8bddee985f12339f",
    "0x0b52eb20a41decdcb1a513dec7db8ef427485419",
    "0x37b00fa2ed4c6cb4b1ca92939942aac297abd1e0"
  ],
  "proposer": "0x37b00fa2ed4c6cb4b1ca92939942aac297abd1e0",
  "infer_tx": "0x90a18461a0bb4db0f1b8348de72b29c4f9253c96713e1b445614ff74ae5d1791",
  "propose_tx": "0x0201e7b84dbfcf7df1ede96059ccfe5b36a1819e90eb4d9337b1f24a1666ba76",
  "input_cid": "",
  "output_cid": ""
}
```


## Step 4: Let's verify the onchain prompt transaction

With Eternal AI's Decentralized Inference, everything is onchain-verifiable.

Let's look at the onchain prompt transaction on Base Explorer. You can verify that the prompt ran on DeepHermes. You can also verify the system prompt and the user prompt.

https://basescan.org/tx/0x90a18461a0bb4db0f1b8348de72b29c4f9253c96713e1b445614ff74ae5d1791

<img width="1359" alt="image" src="https://github.com/user-attachments/assets/065be66a-c660-47db-b70f-14b4239cc85b" />



## Step 5: Let's verify the onchain response transaction

Now, let's see the onchain response transaction on Base Explorer. You can see the actual response content with the thinking process and the final answer. Everything is onchain and verifiable.

https://basescan.org/tx/0x0201e7b84dbfcf7df1ede96059ccfe5b36a1819e90eb4d9337b1f24a1666ba76

<img width="1047" alt="image" src="https://github.com/user-attachments/assets/0b6212d8-4e4f-4d9b-b59b-5d45a6d519b1" />


## Conclusion

Congrats! You've finished making the first decentralized inference call with DeepHermes.

We can't wait to see what AI-powered dapps and AI agents you'll build next.
