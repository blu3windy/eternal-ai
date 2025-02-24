import { Interact } from "@eternalai.js/interact";
import "./Styles.css";
import { ethers } from "ethers";
import { InferPayload } from "@eternalai.js/interact/dist/types";

function PackageInteract() {
  return (
    <>
      <h1>Package Interact</h1>
      <div className="card">
        <button
          onClick={async () => {
            const inferPayload = {
              chainId: 8453,
              model: "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
              prompt: "test",
            } satisfies InferPayload;

            // // solution 1
            {
              const wallet = ethers.Wallet.createRandom();
              const interact = new Interact(wallet);
              await interact.infer(inferPayload);
            }

            {
              const wallet = ethers.Wallet.createRandom();
              const interact = new Interact(wallet);
              await interact.infer("abc", "test");
            }

            // // // solution 2
            // {
            //   const provider = new ethers.providers.JsonRpcProvider(
            //     "https://bsc-dataseed.binance.org/"
            //   );
            //   const wallet: ethers.Wallet = provider.getSigner(
            //     "0x2e6Db966C04A4eAAdfd45E9a2Ff5621166fDB8a4"
            //   ) as any;

            //   const payload = await methods.Infer.createPayload(
            //     wallet,
            //     inferPayload
            //   );
            //   // signed message with payload
            //   const signedTx = ""; // for example: await wallet.signMessage(payload);

            //   const result = await methods.Infer.sendInfer(wallet, signedTx);
            //   await methods.Infer.listenInferResponse(wallet, result);
            // }
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
