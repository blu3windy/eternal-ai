import { Interact } from "@eternalai.js/interact";
import "./Styles.css";
import { ethers } from "ethers";
import {
  InferPayloadWithPrompt,
  InferPayloadWithMessages,
} from "@eternalai.js/interact/dist/types";
import { ChainId } from "@eternalai.js/interact/dist/constants";

const AGENT_CONTRACT_ADDRESSES: Record<ChainId, string> = {
  56: "0x3B9710bA5578C2eeD075D8A23D8c596925fa4625",
  8453: "0x643c45e89769a16bcb870092bd1efe4696cb2ce7",
};

const wallet = new ethers.Wallet("Your private key here");

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
                  chainId: ChainId.BASE,
                  agentAddress: AGENT_CONTRACT_ADDRESSES[ChainId.BASE],
                  prompt: "test",
                } satisfies InferPayloadWithPrompt;
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
                  chainId: ChainId.BASE,
                  agentAddress: AGENT_CONTRACT_ADDRESSES[ChainId.BASE],
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
