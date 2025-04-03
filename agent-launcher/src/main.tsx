import React from "react";
import App from "./App.tsx";

import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import "@fontsource/inter";

createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ChakraProvider>
         <App />
      </ChakraProvider>
   </React.StrictMode>
);

// Use contextBridge
globalThis.ipcRenderer.on("main-process-message", (_event, message) => {
   console.log(message);
});
