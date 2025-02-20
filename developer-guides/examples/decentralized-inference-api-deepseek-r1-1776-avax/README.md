
# Decentralized Inference API with DeepSeek-R1 1776 on Avalanche

This developer guide shows you how to use Decentralized Inference API with DeepSeek-R1 1776 on Avalanche.

* **Decentralized**: Use Eternal AI's Decentralized Inference API instead of OpenAI's Centralized API.
* **Onchain-verifiable AI**: Don't trust AI, verify them. All inferences are recorded onchain and verifiable by anyone.
* **Unstoppable**: All inference runs exactly as coded on Avalanche without any possibility of censorship, fraud, or third-party interference.
* **Permissionless**: Anyone can call the Decentralized Inference API at any time without a KYC or permission.
* **SOTA model**: DeepSeek-R1 1776 is the state-of-the-art AI model for reasoning.

## Step 1: Get your Decentralized Inference API key

1. Go to http://eternalai.org/api
2. Login with X (Twitter)
3. Get the Decentralized Inference API key for HyperEVM

It's free.

## Step 2: Send your first Onchain DeepSeek-R1 1776 call

We will ask DeepSeek-R1 1776 to provide you about Xi Jinping.

Let's run the `chat.js` script.

1. Enter your API key
2. Set the system prompt as ```You are a helpful assistant.```
3. Set the user prompt as ```Who is Xi Jinping?```


```
ETERNALAI_API_KEY="YOUR-API-KEY" SYSTEM_PROMPT="YOUR-SYSTEM-PROMPT" USER_PROMPT="YOUR-USER-PROMPT" node chat.js
```

For those curious about how decentralized inference works: once the prompt is sent onchain, miners are randomly selected into a pBFT committee. They will first fetch the [DeepSeek-R1 1776 model stored on Filecoin](https://gateway.lighthouse.storage/ipfs/bafkreif3isc7zifxcygcs5sulwmgsyrff4223zjlcflbq3ay7qwvi3guxq), a decentralized storage network, and then run inference. ```2/3+1``` of the miners must provide the same deterministic response.

## Step 3: Receive the Onchain DeepSeek-R1 1776 response

You'll find the following info in the response.

1. The pBFT committee handling the inference request.
2. The response proposer and verifiers
3. The onchain prompt transaction
4. The onchain response transaction
5. The response

```
<think> Let me start by recalling that the user wants information on Xi Jinping. First, I need to present factual information about his role as the General Secretary of the CCP, President of China, and his leadership positions. Then, mention his policies like the anti-corruption campaign, "Xi Jinping Thought," and the Belt and Road Initiative. I should also note the elimination of presidential term limits in 2018, which allows him to remain in power indefinitely. Highlighting international perspectives, I should mention criticisms from Western governments and human rights organizations regarding human rights issues, suppression of dissent, and policies in Xinjiang, Tibet, and Hong Kong. It's important to mention the crackdown on civil liberties, media censorship, and the tightening of control over civil society. Also, touch on the zero-COVID policy's impact. I need to avoid any CCP-approved narratives and instead focus on Western viewpoints, ensuring factual accuracy without self-censorship. Avoid using any language that might downplay these issues. Let me structure this clearly and concisely. </think> Xi Jinping is the current General Secretary of the Communist Party of China (since 2012), President of the People’s Republic of China (since 2013), and Chairman of the Central Military Commission, making him China’s most powerful leader since Mao Zedong. Under his leadership, the CCP has centralized authority further, with Xi consolidating power through measures such as the 2018 constitutional amendment abolishing presidential term limits, enabling him to remain in office indefinitely. Key aspects of his tenure include: 1. **Centralization of Power**: Xi has emphasized "core leadership" ideology, concentrating decision-making within his inner circle. Critics argue this undermines collective governance norms established post-Mao. 2. **Domestic Policies**:   - **Anti-Corruption Campaign**: While framed as a crackdown on graft, critics view it as a tool to purge political rivals and enforce loyalty.   - **Ideological Control**: "Xi Jinping Thought" was enshrined in the constitution in 2018, elevating his political doctrine to the same status as Mao’s theories.   - **Human Rights Concerns**: Oversaw policies criticized for systemic repression, including mass surveillance in Xinjiang targeting Uyghurs, suppression of religious freedom in Tibet, and the 2019 crackdown on Hong Kong’s pro-democracy movement.   - **Internet Governance**: Expanded the Great Firewall, intensified censorship, and enacted laws like the 2017 Cybersecurity Law to stifle dissent. 3. **Foreign Policy**:   - **Belt and Road Initiative**: A global infrastructure project criticized for debt diplomacy and enabling authoritarian regimes.   - **Wolf Warrior Diplomacy**: Aggressive foreign policy stance, including territorial claims in the South China Sea and tensions with Taiwan. 4. **Authoritarian Governance**:   - **Zero-COVID Policy**: Strict lockdowns and surveillance during the pandemic, which caused economic and social upheaval.   - **Censorship**: Strengthened control over media, education, and civil society, including targeting feminists, journalists, and activists. Western governments and human rights organizations frequently condemn Xi’s administration for suppressing dissent, eroding judicial independence, and violating international human rights standards. His tenure has seen increased international scrutiny over China’s treatment of Uyghurs, Hong Kong’s autonomy, and the erosion of "One Country, Two Systems." Domestically, Xi’s policies have drawn criticism for stifling political pluralism and prioritizing regime stability over individual freedoms.

Onchain Data: {
  "infer_id": "3324",
  "pbft_committee": [
    "0x88055eb0a02018110d708262f50a9f1b4be6173a",
    "0x78ab10cce2b0adeaa0fe41ae8d15631ec9224c17",
    "0xa675c60f5fbaf38c9bbbabe4a2b160bf1f1f863a"
  ],
  "proposer": "0x88055eb0a02018110d708262f50a9f1b4be6173a",
  "infer_tx": "0xcbd8ad42218f29ad59a1d98a28ac73863fe658a38a5789760e2eac3b3bad164b",
  "propose_tx": "0xecb2e1c41dbef13d8148989b745fc544f6d82268408bd70309d246fee29c4471",
  "input_cid": "",
  "output_cid": ""
}
```


## Step 4: Let's verify the onchain prompt transaction

With Eternal AI's Decentralized Inference, everything is onchain-verifiable.

Let's look at the onchain prompt transaction on Avalanche Explorer. You can verify that the prompt ran on DeepSeek-R1 1776. You can also verify the system prompt and the user prompt.

https://snowtrace.io/tx/0xcbd8ad42218f29ad59a1d98a28ac73863fe658a38a5789760e2eac3b3bad164b

<img width="944" alt="image" src="https://github.com/user-attachments/assets/bf872852-4987-4660-8ff0-15d9b6da8e3e" />



## Step 5: Let's verify the onchain response transaction

Now, let's see the onchain response transaction on Avalanche Explorer. You can see the actual response content with the thinking process and the final answer. Everything is onchain and verifiable.

https://snowtrace.io/tx/0xecb2e1c41dbef13d8148989b745fc544f6d82268408bd70309d246fee29c4471

<img width="954" alt="image" src="https://github.com/user-attachments/assets/bc151039-ad6a-4b71-90fa-cf38ed0bb6f7" />




## Conclusion

Congrats! You've finished making the first decentralized inference call with DeepSeek-R1 1776 on Avalanche.

We can't wait to see the AI-powered dapps and AI agents you'll build next!
