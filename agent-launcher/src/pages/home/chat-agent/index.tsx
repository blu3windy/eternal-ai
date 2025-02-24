import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ChatAgent = () => {
  const [jsString, setJSString] = useState("");

  const [test, setTest] = useState();
  const [message, setMessage] = useState("");


  const loadAgentScript = () => {
    import("/Users/macbookpro/Library/Application Support/agent-launcher/main.js")
        .then((test) => {
          setTest(test)
          test.getContractAddress()
          console.log("LEON SUCCESS")
        })
        .catch((error) => {
          console.error("LEON Error loading main:", error);
        });
  };

  const loadCommonPackages = () => {

    (async () => {

      const ethersModule = await import("/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/src/pages/home/chat-agent/ethers.js"); // Adjust path if needed

      // Attach all exports to window.ethers
      window.ethers = ethersModule;

      console.log(ethers.version)
      loadAgentScript()
      console.log("✅ ethers.js functions injected into window.ethers!");
    })();

    // const loadModuleScript = (src: string) => {
    //   return new Promise((resolve, reject) => {
    //     const script = document.createElement("script");
    //     script.src = src;
    //     script.type = "module"; // ✅ Load as ES module
    //     script.onload = () => resolve(true);
    //     script.onerror = () => reject(false);
    //     document.body.appendChild(script);
    //   });
    // };
    //
    // loadModuleScript("/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/src/pages/home/chat-agent/ethers.js") // Load ethers.js as a module
    //     .then(() => loadAgentScript()) // ✅ Dynamically import main.bundle.js
    //     .then(() => setMessage("✅ Scripts Loaded!"))
    //     .catch(() => setMessage("❌ Error loading scripts"));
  }

  useEffect(() => {
    loadCommonPackages()
  }, []);


  useEffect(() => {
    // const test = require("src/pages/home/chat-agent/bundle.js");


    // fetch("src/pages/home/chat-agent/bundle.js")
    //   .then((response) => response.text())
    //   .then(async (data) => {
    //     // console.log('data', data);
    //
    //     new Function(data)();
    //     // const result = await window.electronAPI.executeCode(data);
    //     // console.log('result', result);
    //
    //   });
  }, []);

  const handleCopy = async () => {
    const response = await window.electronAPI.copyBundle();
    console.log(response)

    if (response.success) {
      setMessage("✅ File copied successfully!");
    } else {
      setMessage(`❌ Failed to copy file: ${response.error}`);
    }
  };

  return (
      <div>
        <button onClick={handleCopy}>Copy File</button>
        <p>{message}</p>
      </div>
  );

  //
  // return <div>
  //   <button
  //       onClick={() => {
  //           console.log(test.getContractAddress())
  //       }}
  //   >
  //     TETSTSTST
  //   </button>
  //   {message}
  //   </div>;
};

export default ChatAgent;
