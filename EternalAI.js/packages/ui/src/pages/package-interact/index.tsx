import { Interact } from "@eternalai.js/interact";
import "./Styles.css";
import { ethers } from "ethers";

function PackageInteract() {
  return (
    <>
      <h1>Package Interact</h1>
      <div className="card">
        <button
          onClick={async () => {
            const wallet = ethers.Wallet.createRandom();
            const interact = new Interact(wallet);
            const result = await interact.infer({
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
            });
            console.log(result);
          }}
        >
          Excuted
        </button>
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
