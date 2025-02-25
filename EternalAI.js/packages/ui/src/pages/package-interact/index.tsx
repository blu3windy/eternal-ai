import { Interact } from "@eternalai.js/interact";
import "./Styles.css";
import { ethers } from "ethers";
import {
  InferPayloadWithPrompt,
  InferPayloadWithMessages,
} from "@eternalai.js/interact/dist/types";

function PackageInteract() {
  return (
    <>
      <h1>Package Interact</h1>
      <div className="card">
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={async () => {
              {
                const inferPayload = {
                  chainId: 56,
                  model: "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
                  prompt: "test",
                } satisfies InferPayloadWithPrompt;
                const wallet = ethers.Wallet.createRandom();
                const interact = new Interact(wallet);
                await interact.infer(inferPayload);
              }
            }}
          >
            Excute Infer With Prompt
          </button>
          <button
            onClick={async () => {
              {
                const inferPayload = {
                  chainId: 56,
                  model: "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
                  messages: [
                    {
                      role: "system",
                      content: "You are a BTC master",
                    },
                    {
                      role: "user",
                      content: "Can you tell me about BTC",
                    },
                  ],
                } satisfies InferPayloadWithMessages;
                const wallet = ethers.Wallet.createRandom();
                const interact = new Interact(wallet);
                await interact.infer(inferPayload);
              }
            }}
          >
            Excute Infer With Messages
          </button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default PackageInteract;
