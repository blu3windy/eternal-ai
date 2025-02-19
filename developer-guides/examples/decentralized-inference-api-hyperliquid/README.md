
# Decentralized Inference API with DeepSeek-R1 on HyperEVM

This developer guide shows you how to use Decentralized Inference API with DeepSeek-R1 on HyperEVM.

* **Decentralized**: Use Eternal AI's Decentralized Inference API instead of OpenAI's Centralized API.
* **Onchain-verifiable AI**: Don't trust AI, verify them. All inferences are recorded onchain and verifiable by anyone.
* **Unstoppable**: All inference runs exactly as coded on HyperEVM without any possibility of censorship, fraud, or third-party interference.
* **Permissionless**: Anyone can call the Decentralized Inference API at any time without a KYC or permission.
* **SOTA model**: DeepSeek-R1 is the state-of-the-art AI model for reasoning.

## Step 1: Get your Decentralized Inference API key

1. Go to http://eternalai.org/api
2. Login with X (Twitter)
3. Get the Decentralized Inference API key for HyperEVM

It's free.

## Step 2: Send your first Onchain DeepSeek-R1 call

We will ask DeepSeek-R1 to provide you with an overview of the P2P system.

Let's run the `chat.js` script.

1. Enter your API key
2. Set the system prompt as ```You are a 10x engineer.```
3. Set the user prompt as ```Give a short overview of p2p system```


```
ETERNALAI_API_KEY="YOUR-API-KEY" SYSTEM_PROMPT="YOUR-SYSTEM-PROMPT" USER_PROMPT="YOUR-USER-PROMPT" node chat.js
```

For those curious about how decentralized inference works: once the prompt is sent onchain, miners are randomly selected into a pBFT committee. They will first fetch the [DeepSeek-R1 model stored on Filecoin](https://gateway.lighthouse.storage/ipfs/bafkreigq7yhawmvs7x3hs366wwdkkimvf26admql3sqtl6a4o2nwrbdvka), a decentralized storage network, and then run inference. ```2/3+1``` of the miners must provide the same deterministic response.

## Step 3: Receive the Onchain DeepSeek-R1 response

You'll find the following info in the response.

1. The pBFT committee handling the inference request.
2. The response proposer and verifiers
3. The onchain prompt transaction
4. The onchain response transaction
5. The response

```
<think> Alright, I need to give a short overview of P2P systems. Let me break it down into key points. First, I should explain what P2P is. It stands for Peer-to-Peer, so I'll define it as a decentralized system where nodes act as both clients and servers. That way, everyone can contribute and share resources. Next, I'll cover the main characteristics. Decentralization is a big one, so no single server controls everything. Equal participation means every node can both request and provide services. Resource sharing, like files or bandwidth, is another important aspect. I should mention the types of P2P systems. There's the pure P2P where every node is equal, like the original BitTorrent. Then hybrid models, which use a central server to manage connections but still let peers share data directly. Use cases are essential. File sharing is the most well-known, with examples like BitTorrent. Beyond that, blockchain technology relies heavily on P2P networks, and distributed computing projects use P2P to harness processing power from many machines. I can't forget the challenges. Security and privacy are major concerns because data is shared across many nodes. Scalability is another issue as the number of peers grows. Managing content and ensuring it's not illegal or harmful is tricky without a central authority. Wrapping it up with benefits makes sense. P2P systems are fault-tolerant since there's no single point of failure. They can handle a lot of traffic efficiently, which is great for media streaming and similar uses. Putting it all together, I'll make sure it's concise and flows well, hitting each point without going too deep. That should give a clear, comprehensive overview of P2P systems. </think> A peer-to-peer (P2P) system is a decentralized network architecture where nodes, often referred to as peers, act as both suppliers and consumers of resources. Unlike traditional client-server models, where a central server manages all requests, P2P systems allow each node to contribute and share resources such as files, bandwidth, or processing power. This decentralization eliminates the need for a central authority, making the network more resilient to failures and censorship. ### Key Characteristics of P2P Systems: 1. **Decentralization**: There is no central server controlling the network; all nodes (peers) are equal and can act as both clients and servers. 2. **Resource Sharing**: Peers share resources directly with each other. This can include files, computational power, bandwidth, or storage. 3. **Autonomy**: Each node operates independently, and the network as a whole is self-organizing. 4. **Scalability**: P2P systems can scale well because the capacity of the network increases as more peers join and contribute resources. ### Types of P2P Networks: 1. **Pure (Decentralized) P2P**: All nodes are equal, and there is no central server. Examples include BitTorrent and Freenet. 2. **Hybrid P2P**: Combines elements of centralized and decentralized architectures. A central server may manage connections, but actual data transfer occurs directly between peers. Examples include Napster and Skype. ### Applications of P2P Systems: - **File Sharing**: The most common use case, enabling users to share files directly without a central server. Examples include BitTorrent and Kazaa. - **Distributed Computing**: Projects like SETI@home use P2P networks to harness the computational power of thousands of computers. - **Blockchain and Cryptocurrencies**: Many blockchain networks, such as Bitcoin and Ethereum, use P2P architectures to validate transactions and maintain a decentralized ledger. - **Streaming Media**: P2P protocols are used for live video streaming to reduce server bandwidth requirements. ### Advantages: - **Fault Tolerance**: The absence of a single point of failure makes P2P networks more robust. - **Cost Efficiency**: No need for expensive centralized infrastructure. - **Scalability**: The network can handle a large number of users without significant performance degradation. ### Challenges: - **Security and Privacy**: Sharing data directly between peers can expose users to security risks and privacy violations. - **Legal and Ethical Issues**: P2P networks are often associated with copyright infringement, as they can be used to share pirated content. - **Resource Management**: Managing and indexing shared resources in a decentralized manner can be complex. - **Scalability Limitations**: While P2P systems are generally scalable, they can face challenges as the number of peers grows exponentially. P2P systems offer a powerful alternative to traditional centralized architectures, enabling decentralized resource sharing and collaboration. They are widely used in various domains, from file sharing and blockchain to large-scale distributed computing projects.

Onchain Data: {
  "infer_id": "4",
  "pbft_committee": [
    "0x2d0d1558f7ad76f9e7763407658cb232d19ea386",
    "0x2e76d19ac5389eac1ba177150ec860b07a982617",
    "0x00a48848a0dd4a03f6e04dca41870fcaf7afa680"
  ],
  "proposer": "0x2e76d19ac5389eac1ba177150ec860b07a982617",
  "infer_tx": "0x207b26c3aca80885ac9d60e2fa38e3674e2b58ec7744535c4c18dd791734930e",
  "propose_tx": "0x38e15c057cbe43d9f529042efa77276d2fe52077f7c1613804d5695976236f07",
  "input_cid": "ipfs://bafkreifhnzk5vxqjkbnwidoflzhwnas6l5ucmuzy22bszeiidvferb35pm",
  "output_cid": "ipfs://bafkreiatq6lagy574zifsha3qyanair5btdmyemwhuo2ytyq35g2owaim4"
}
```


## Step 4: Let's verify the onchain prompt transaction

With Eternal AI's Decentralized Inference, everything is onchain-verifiable.

Let's look at the onchain prompt transaction on HyperEVM Explorer. You can verify that the prompt ran on DeepSeek-R1. You can also verify the system prompt and the user prompt.

https://HyperEVM.cloud.blockscout.com/tx/0x207b26c3aca80885ac9d60e2fa38e3674e2b58ec7744535c4c18dd791734930e

<img width="622" alt="image" src="https://github.com/user-attachments/assets/4518b545-a5d1-464a-b52f-2a39c6dc1e29" />




## Step 5: Let's verify the onchain response transaction

Now, let's see the onchain response transaction on HyperEVM Explorer. You can see the actual response content with the thinking process and the final answer. Everything is onchain and verifiable.

https://HyperEVM.cloud.blockscout.com/tx/0x38e15c057cbe43d9f529042efa77276d2fe52077f7c1613804d5695976236f07

<img width="1674" alt="image" src="https://github.com/user-attachments/assets/f39acb55-97bf-49aa-b24d-e366337e347e" />



## Conclusion

Congrats! You've finished making the first decentralized inference call with DeepSeek-R1 on HyperEVM.

We can't wait to see the AI-powered dapps and AI agents you'll build next!
