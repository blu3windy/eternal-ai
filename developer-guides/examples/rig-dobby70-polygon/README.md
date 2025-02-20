# Build unstoppable Rig agents with Dobby 70b on Polygon

This developer guide shows you how to build a different kind of Rig agent:

- Decentralized: Use Eternal AI's Decentralized Inference API instead of OpenAI's Centralized API.
- Onchain-verifiable: Don't trust AI, verify them. All inferences are recorded onchain and verifiable by anyone.
- Unstoppable: Agents run exactly as coded without any possibility of downtime, censorship, fraud, or third-party interference.
- Intelligent: Give your Rig new superpowers using Dobby 70b, the state-of-the-art onchain AI model for reasoning.

## Step 1: Get the code
```
git clone https://github.com/0xPlaygrounds/rig.git
```

Rig is a Rust library for building scalable, modular, and ergonomic LLM-powered applications. Eternal AI has already been built into the Rig library. You can pull the Rig source code and start building with Eternal AI.

## Step 2: Export ETERNALAI_API_KEY environment variable
```
export ETERNALAI_API_KEY="your-eternalai-api-key"
```
You can get the API key [here](https://eternalai.org/api).

## Step 3: Update model and chain ID (if needed)

You can find the list of supported chains and models [here](https://docs.eternalai.org/eternal-ai/decentralized-inference-api/onchain-models).

For this tutorial, we'll use Polygon and Dobby 70b, so we need to update the chain ID in the `agent_with_eternalai.rs` from 45762 to 137. 

![image](https://github.com/user-attachments/assets/da26890b-3dd0-479d-938d-0373b393993b)

## Step 4: Build your Rig agent

Run the following commands to install dependencies.
```
cargo update
```
## Step 5: Run your Rig agent
```
cargo run --package rig-eternalai --example agent_with_eternalai
```

We will ask your agent a math-related question:
```
Hey, I’m interested in understanding how Polygon enhances Ethereum’s scalability. Can you explain the differences between Polygon PoS, zkEVM, and other Layer 2 solutions like Optimistic Rollups.
```

## Step 6: Verify the onchain prompt transaction

With Eternal AI's Decentralized Inference, everything is onchain-verifiable.

Let’s look at an "onchain prompt" transaction on Polygon Explorer. You can verify that this prompt runs on Dobby 70b and see the prompt content.

https://polygonscan.com/tx/0x3887b278baa36c4e03fe9e4441e8c6d7d14580cf2aa20a953cf69c243fff03ed

https://gateway.lighthouse.storage/ipfs/bafkreibzmfng5r26xo2uu5k36lsu5mkkg2agjxfzvrcunkshoojbtwkssm

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/10852eb6-a790-41dc-a8ed-caa0abd25914" />


## Step 7: Let's see how the Dobby 70b answers

When Dobby 70b receives a prompt, it provides the answer as follows:
```
Polygon PoS is like the high-speed rail of Ethereum scaling—fast as fuck and cheap, using a proof-of-stake consensus to validate transactions off-chain before dumping them onto Ethereum, saving time and gas. Optimistic Rollups are similar but rely on assumptions; if someone cheats, there’s a week-long wait for justice. Polygon’s zkEVM? That’s next-level shit—zero-knowledge proofs mean transactions are not only fast and cheap but also private as hell, all while being fully compatible with Ethereum’s tooling. Unlike Optimism, Polygon doesn’t need your bullshit waiting periods, and its flexibility is unmatched. If you want real scalability without sacrificing decentralization or security, Polygon is the only game in town.
```


## Step 8: Verify the onchain response transaction

Now, let's look at the onchain response tx on Polygon explorer. You can see the actual response content. Everything is onchain and verifiable.

https://polygonscan.com/tx/0x9fa6f01392d1669a9df1a293bb4c24a2e202148ef7371df12b440375620b667e

https://gateway.lighthouse.storage/ipfs/bafkreigk24s6x5p2benhuqcyipquu6naerkbuvoxzxcxdwpfmpmgqzy4uy

<img width="1661" alt="image" src="https://github.com/user-attachments/assets/5f4ba61f-a673-416c-a513-cfac20841d97" />


# Conclusion
Congrats!

You’ve finished building your Rig agent with two superpowers:

- Onchain-verifiable on Polygon
- Powered by Dobby 70b

Enjoy building!
