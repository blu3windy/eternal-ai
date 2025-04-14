import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { DeepLinkProvider } from "./providers/DeepLink";
import "@fontsource/inter";

const isDev = import.meta.env.MODE === "development";

const Root = () => {
   if (process.env.NODE_ENV === 'development') {
      return (
         <React.StrictMode>
            <ChakraProvider>
               <DeepLinkProvider>
                  <App />
               </DeepLinkProvider>
            </ChakraProvider>
         </React.StrictMode>
      );
   }
   
   return (
      <ChakraProvider>
         <DeepLinkProvider>
            <App />
         </DeepLinkProvider>
      </ChakraProvider>
   );
};

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<Root />);

// Electron's contextBridge event listener
globalThis.ipcRenderer?.on("main-process-message", (_event, message) => {
   console.log(message);
});