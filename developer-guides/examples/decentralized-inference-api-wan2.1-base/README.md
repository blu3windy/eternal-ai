
# Decentralized Inference Contract Interaction with Wan2.1 on Base

We have just deployed Wan2.1 on Base as a smart contract.

Contract Address: 0x19aeEfFbc0244Be6187314A74a443A18AA2cCeEe

Wan2.1 is now unstoppable—running exactly as trained, with no possibility of downtime, censorship, fraud, or third-party interference.

Let's interact with it!

## Step 1: Run the code to make the first call to the Wan2.1 contract and wait for the response

The complete example code is available here: (link)

You can run the code using the following command:
```
npm install && npx hardhat compile && RPC_URL="https://api.base.network/ext/bc/C/rpc" PRIVATE_KEY=<YOUR_KEY> CHOSEN_MODEL="wan2.1" USER_PROMPT="Trump dancing, waving arm" npm run sendUniverseAgentRequest:base_mainnet
```
- Replace <YOUR_KEY> with your development wallet's private key.
- Replace <YOUR_RPC_URL> with your RPC URL on the Base network.

Ensure the wallet has some ETH on Base to cover network fees.

## Step 2: Verify the onchain prompt transaction

Since Wan2.1 is a smart contract, every interaction with it is verifiable on-chain on Base.

Examine the prompt transaction on Base Explorer. You can verify the prompt.

https://basescan.org/tx/0x6b05893439b172f72a09f5579d0c8f2a16f0a642b748c9b3c006c8b7c650bc91

![Screenshot 2025-03-06 at 14 09 22](https://github.com/user-attachments/assets/9992920c-1244-4162-8933-bd42fa25e89b)

## Step 3: Verify the On-Chain Response Transaction

Next, review the response transaction on Base Explorer. You will find the IPFS address for your video. Everything is onchain and fully verifiable.

https://gateway.lighthouse.storage/ipfs/bafybeickefamae7clueyfczwj2js2z6vcc5bpvfnaobw3fn6bd6nwalwyq

