# Eternal AI: Build Decentralized Autonomous Agents

Eternal AI is a Solidity-based open source protocol for decentralized autonomous agents. These AI agents are written as Solidity smart contracts and run exactly as programmed. They are permissionless, uncensored, trustless, and unstoppable.

Eternal AI agents operate on a powerful peer-to-peer agentic AI infrastructure with many unique properties:

* End-to-end decentralization: Inference, Compute, Storage, etc.
* State-of-the-art models: DeepSeek, Llama, FLUX, etc.
* Omnichain interoperability: Bitcoin, Ethereum, Solana, etc.

This enables developers to create SocialFi agents that interact on Twitter, DeFi agents that trade crypto, GameFi agents that play onchain games, and many other decentralized AI agents yet to be invented — all without a middleman or counterparty risk.

# Protocol Architecture

<img width="2704" alt="eternal-kernel-new-7" src="https://github.com/user-attachments/assets/d0fd6429-510c-4114-83a1-c3b5aebd753f" />

Here are the major components of the Eternal AI software stack.

| Component | Description |
|:--------------------------|--------------------------|
| [ai-kernel](/ai-kernel)| A set of Solidity smart contracts that trustlessly coordinate user space, onchain space, and offchain space. |
| [decentralized-agents](/decentralized-agents)| A set of Solidity smart contracts that define AI agent standards (AI-721, SWARM-721, KB-721). |
| [decentralized-inference](/decentralized-inference) | The decentralized inference APIs. |
| [decentralized-compute](/decentralized-compute) | The peer-to-peer GPU clustering and orchestration protocol. |
| [agent-as-a-service](/agent-as-a-service)| The production-grade agent launchpad and management. |
| [agent-studio](/agent-studio)| No-code, drag 'n drop, visual programming language for AI creators. |
| [blockchains](/blockchains)| A list of blockchains that are AI-powered by Eternal AI. |

Here are the key ongoing research projects.

| Component | Description |
|:--------------------------|--------------------------|
| [cuda-evm](/research/cuda-evm)| The GPU-accelerated EVM and its Solidity tensor linear algebra library. |
| [nft-ai](/research/nft-ai)| AI-powered fully-onchain NFTs. |
| [physical-ai](/research/physical-ai)| AI-powered hardware devices. |

# Get started

## Prerequisites
* [Node.js 22.12.0+ and npm 10.9.0+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Docker Desktop 4.37.1+](https://docs.docker.com/desktop/setup/install/mac-install/)
* [Go 1.23.0+](https://go.dev/doc/install)
* [Ollama 0.5.7+](https://ollama.com/download)


## Installation

Run the following command to start the whole system.
```
sudo bash quickstart.sh
```

Install the CLI tool to interact with your local system.

```bash
sudo ./install.sh
```

## `eai` CLI

#### Create an agent. (here we are creating an agent who is a Donald Trump twin)

```bash
eai agent create $(pwd)/decentralized-agents/characters/donald_trump.txt
```
The .txt file is the system prompt for your agent. It will be used to set the initial behavior for your agent. You can modify the content of the prompt file to adjust your agent's personality.

#### Fetch agent info from the AI-721 contract.
```
eai agent info <agent_id>
```

#### List out all agents on your machine.
```bash
eai agent list
```

#### Chat with an agent
```bash
eai agent chat <agent_id>
```


# Design Principles

1. **Decentralize everything**. Ensure that no single point of failure or control exists by questioning every component of the Eternal AI system and decentralizing it. 
2. **Trustless**. Use smart contracts at every step to trustlessly coordinate all parties in the system.
3. **Production grade**. Code must be written with production-grade quality and designed for scale.
4. **Everything is an agent**. Not just user-facing agents, but every component in the infrastructure, whether a swarm of agents, an AI model storage system, a GPU compute node, a cross-chain bridge, an infrastructure microservice, or an API, is implemented as an agent.
5. **Agents do one thing and do it well**. Each agent should have a single, well-defined purpose and perform it well.
6. **Prompting as the unified agent interface**. All agents have a unified, simplified I/O interface with prompting and response for both human-to-agent interactions and agent-to-agent interactions.
7. **Composable**. Agents can work together to perform complex tasks via a chain of prompts.

# Featured Integrations

Eternal AI is built using a modular approach, so support for other blockchains, agent frameworks, GPU providers, or AI models can be implemented quickly. Please reach out if you run into issues while working on an integration.

<img width="1780" alt="Featured Integrations (1)" src="https://github.com/user-attachments/assets/e6bdd4c9-3630-4dfa-8ac2-0526cb618c1e" />

# Governance

We are still building out the Eternal AI DAO.

Once the DAO is in place, [EAI holders](https://eternalai.org/eai) will oversee the governance and the treasury of the Eternal AI project with a clear mission: to build truly open AI. 

# Contribute to Eternal AI

Thank you for considering contributing to the source code. We welcome contributions from anyone and are grateful for even the most minor fixes.

If you'd like to contribute to Eternal AI, please fork, fix, commit, and send a pull request for the maintainers to review and merge into the main code base.

# Communication

* [GitHub Issues](https://github.com/eternalai-org/eternal-ai/issues): bug reports, feature requests, issues, etc.
* [GitHub Discussions](https://github.com/eternalai-org/eternal-ai/discussions): discuss designs, research, new ideas, thoughts, etc.
* [X (Twitter)](https://x.com/cryptoeternalai): announcements about Eternal AI
