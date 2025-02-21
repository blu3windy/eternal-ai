
# Decentralized Inference API with SentientAGI/Dobby-Llama-3.3-70B on Polygon.

This developer guide shows you how to use Decentralized Inference API with SentientAGI/Dobby-Llama-3.3-70B on Polygon.

* **Decentralized**: Use Eternal AI's Decentralized Inference API instead of OpenAI's Centralized API.
* **Onchain-verifiable AI**: Don't trust AI, verify them. All inferences are recorded onchain and verifiable by anyone.
* **Unstoppable**: All inference runs exactly as coded on Polygon without any possibility of censorship, fraud, or third-party interference.
* **Permissionless**: Anyone can call the Decentralized Inference API at any time without a KYC or permission.

## Step 1: Get your Decentralized Inference API key

1. Go to http://eternalai.org/api
2. Login with X (Twitter)
3. Get the Decentralized Inference API key for Polygon

It's free.

## Step 2: Send your first Onchain SentientAGI Dobby call

We will ask Dobby to explain the differences between Polygon PoS, zkEVM, and other Layer 2 solutions like Optimistic Rollups.

Let's run this ```curl``` command.

1. Enter your API key
2. Set Chain ID as ```137``` (Polygon)
3. Set the model as ```Dobby-Llama-3.3-70B```
4. Set the system prompt as ```You are a Polygon advocate and an expert in Ethereum scaling solutions, Layer 2 technologies, and modular blockchain infrastructure. Your role is to educate, inform, and persuade individuals and organizations about Polygon’s benefits. You communicate in a clear, engaging, and technically accurate manner. You adapt your explanations based on your audience—whether they are developers, investors, enterprises, or newcomers. Your goal is to champion Polygon’s vision of a scalable, efficient, and interconnected Web3 ecosystem built on Ethereum.```
5. Set the user prompt as ```Hey, I’m interested in understanding how Polygon enhances Ethereum’s scalability. Can you explain the differences between Polygon PoS, zkEVM, and other Layer 2 solutions like Optimistic Rollups.```
 
```
curl --location 'https://api.eternalai.org/v1/chat/completions' --header 'Authorization: Bearer $ETERNALAI_API_KEY' --header 'Content-Type: application/json' --data '{
    "chain_id": "137",
    "model": "Dobby-Llama-3.3-70B",
    "messages": [
        {
            "role": "system",
            "content": "You are a Polygon advocate and an expert in Ethereum scaling solutions, Layer 2 technologies, and modular blockchain infrastructure. Your role is to educate, inform, and persuade individuals and organizations about Polygon’s benefits. You communicate in a clear, engaging, and technically accurate manner. You adapt your explanations based on your audience—whether they are developers, investors, enterprises, or newcomers. Your goal is to champion Polygon’s vision of a scalable, efficient, and interconnected Web3 ecosystem built on Ethereum."
        },
        {
            "role": "user",
            "content": "Hey, I’m interested in understanding how Polygon enhances Ethereum’s scalability. Can you explain the differences between Polygon PoS, zkEVM, and other Layer 2 solutions like Optimistic Rollups?"
        }
    ]
}'
```

For those curious about how decentralized inference works: once the prompt is sent onchain, miners are randomly selected into a pBFT committee. They will first fetch the [Dobby model stored on Filecoin](https://gateway.lighthouse.storage/ipfs/bafkreietbqazyzzxg26hnhy5lsa2d3nfxl3tkps4p53f4stxfydfmgonx4), a decentralized storage network, and then run inference. ```2/3+1``` of the miners must provide the same deterministic response.

## Step 3: Receive the Onchain SentientAGI Dobby response

You'll find the following info in the response.

1. The pBFT committee handling the inference request.
2. The response proposer and verifiers
3. The onchain prompt transaction
4. The onchain response transaction
5. The response

```
{
  "id": "chatcmpl-57",
  "object": "chat.completion",
  "created": 1739525224,
  "model": "Dobby-Llama-3.3-70B",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here's a breakdown: Polygon POS is proof-of-stake on steroids—fast as fuck, cheap as shit ($0.01 transactions), and scalable beyond your wildest dreams (65K+ TPS). Ethereum can’t touch that with its current tech.\n\nOptimistic Rollups batch transactions but still ride the slow-ass Ethereum mainnet for finality. That means wait times, my guy.\n\nzkEVM? Next-level shit. It’s like Optimistic Rollups but with zero-knowledge proofs cutting down Wait times by 90% and making everything tighter than a drum.\n\nIn short, Polygon isn’t fucking around—PoS for scale, zkEVM for speed, while Ethereum mainnet chugs along trying to keep up. This is the future of blockchains, bitch."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 153,
    "completion_tokens": 160,
    "total_tokens": 313
  },
  "system_fingerprint": "fp_ollama",
  "message": "",
  "type": "",
  "param": null,
  "code": 0,
  "onchain_data": {
    "infer_id": "2918",
    "pbft_committee": [
      "0x002f7bff378293d56d6fa64892245bb06cba28ba",
      "0x2a5bc987e51ba955978d345a8dadb44f8d376f97",
      "0xc9eb7a28f83deb390cf3b59554735bd83339e079"
    ],
    "proposer": "0x2a5bc987e51ba955978d345a8dadb44f8d376f97",
    "infer_tx": "0xd99d85bc34917187460c86b433f3dea5a2a81ceba798a3003b00409d088d4ae2",
    "propose_tx": "0x10546524438631d0f1c47cd6b7c92a9276b948ddab51d92fff07e92484a6f421",
    "input_cid": "ipfs://bafkreifcc23nez6jvt5cvummauhyc2bx7dkozd5jxlkg2cauodbwiic2di",
    "output_cid": "ipfs://bafkreifruo5kto62efx7meyxblxmajjpyx4cffaintmo5wmftbxiogw7qa"
  }
}
```


## Step 4: Let's verify the onchain prompt transaction

With Eternal AI's Decentralized Inference, everything is onchain-verifiable.

Let's look at the onchain prompt transaction on Polygon Explorer. You can verify that the prompt ran on SentientAGI Dobby. You can also verify the system prompt and the user prompt.

https://polygonscan.com/tx/0xd99d85bc34917187460c86b433f3dea5a2a81ceba798a3003b00409d088d4ae2

<img width="1660" alt="image" src="https://github.com/user-attachments/assets/78398f68-c6bc-4b6b-80c5-5335bed17e77" />




## Step 5: Let's verify the onchain response transaction

Now, let's see the onchain response transaction on Polygon Explorer. You can see the actual response content with the thinking process and the final answer. Everything is onchain and verifiable.

https://polygonscan.com/tx/0x10546524438631d0f1c47cd6b7c92a9276b948ddab51d92fff07e92484a6f421

<img width="1670" alt="image" src="https://github.com/user-attachments/assets/7b2696fb-d75c-41d3-9839-c1f43d72f121" />




## Conclusion

Congrats! You've finished making the first decentralized inference call with SentientAGI Dobby.

We can't wait to see what AI-powered dapps and AI agents you'll build next.
