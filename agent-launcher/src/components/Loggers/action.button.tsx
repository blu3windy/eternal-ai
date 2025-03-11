import { Button, Flex } from "@chakra-ui/react";


export const MODEL_HASH = "bafkreiecx5ojce2tceibd74e2koniii3iweavknfnjdfqs6ows2ikoow6m"

const ActionButtons = () => {
   return (
      <Flex gap="12px" flexWrap="wrap" width="100%" alignItems="center">
         <Button
            onClick={() => {
               window.electronAPI.modelStarter();
            }}
         >
              INSTALL LLAMA.CPP
         </Button>
         <Button
            onClick={() => {
               window.electronAPI.modelInstall(MODEL_HASH);
            }}
         >
             INSTALL MODEL
         </Button>
         <Button
            onClick={() => {
               window.electronAPI.modelRun(MODEL_HASH);
            }}
         >
             RUN MODEL
         </Button>
         <Button
            onClick={() => {
               window.electronAPI.modelCheckInstall([MODEL_HASH]).then((hashes) => {
                  alert(JSON.stringify(hashes));
               });
            }}
         >
             MODEL CHECK INSTALL
         </Button>
         <Button
            onClick={() => {
               window.electronAPI.modelCheckRunning().then((hash?: string) => {
                  alert(hash ? `Model is running with hash: ${hash}` : "Model is not running");
               });
            }}
         >
             MODEL CHECK RUNNING
         </Button>
      </Flex>
   )
};

export default ActionButtons;