import { useState } from "react";
import { sum, subtract } from "@eternalai.js/eternalaijs";
import "./Styles.css";

function PackageEternalAiJs() {
  const [num, setNum] = useState(0);

  return (
    <>
      <h1>Package EternalAI js</h1>
      <div className="card">
        <button
          onClick={() => {
            const a = Math.floor(Math.random() * 1000);
            const b = Math.ceil(Math.random() * 1000);
            console.log(a, b);
            setNum(subtract(a, b));
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

export default PackageEternalAiJs;
