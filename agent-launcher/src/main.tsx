import React from "react";
import App from "./App.tsx";

import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import "@fontsource/inter";
import UpdateBanner from "@components/UpdateBanner/index.tsx";

createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ChakraProvider>
         <UpdateBanner />
         <App />
      </ChakraProvider>
   </React.StrictMode>
);

// Use contextBridge
globalThis.ipcRenderer.on("main-process-message", (_event, message) => {
   console.log(message);
});
