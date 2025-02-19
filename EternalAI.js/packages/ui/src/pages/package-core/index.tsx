import { useState } from "react";
import { sum } from "@eternalai.js/core";
import "./Styles.css";

function PackageCore() {
  const [num, setNum] = useState(0);

  return (
    <>
      <h1>Package Core</h1>
      <div className="card">
        <button
          onClick={() => {
            const a = Math.floor(Math.random() * 1000);
            const b = Math.ceil(Math.random() * 1000);
            console.log(a, b);
            setNum(sum(a, b));
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

export default PackageCore;
