import { useState } from "react";
import { Interact, methods } from "@eternalai.js/interact";
import "./Styles.css";

function PackageInteract() {
  const [num, setNum] = useState(0);

  return (
    <>
      <h1>Package Interact</h1>
      <div className="card">
        <button
          onClick={async () => {
            const interact = new Interact();
            console.log(interact);
            methods.Infer.createPayload({ data: "test" });
            await methods.Infer.execute("signedTx");
            methods.Act.createPayload({ data: "test" });
            await methods.Act.execute("signedTx");
          }}
        >
          sum of two random numbers is {num}
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
