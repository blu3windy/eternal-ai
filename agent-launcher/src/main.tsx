import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";

const isDev = import.meta.env.MODE === "development";

const Root = () => {
  return (
    <>
      {isDev ? (
        <ChakraProvider>
         <App />
         </ChakraProvider>
      ) : (
        <ChakraProvider>
          <App />
        </ChakraProvider>
      )}
    </>
  );
};

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<Root />);

// Electron's contextBridge event listener
globalThis.ipcRenderer?.on("main-process-message", (_event, message) => {
  console.log(message);
});