import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";
import { ErrorManagerProvider } from "@providers/ErrorManager/index.tsx";

const isDev = import.meta.env.MODE === "development";

const Root = () => {
   return (
      <>
         <ErrorManagerProvider>
            <ChakraProvider>
               <App />
            </ChakraProvider>
         </ErrorManagerProvider>
      </>
   );
};

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<Root />);

// Electron's contextBridge event listener
globalThis.ipcRenderer?.on("main-process-message", (_event, message) => {
   console.log(message);
});