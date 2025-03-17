import { Button, Flex } from "@chakra-ui/react";


export const MODEL_HASH = "bafkreideybeu6dpfurmbhqhs2ylscys2gkimfgghg2fjg6ngrmo3wyk2uu"

const ActionButtons = () => {
   return (
      <Flex gap="12px" flexWrap="wrap" width="100%" alignItems="center">
         <Button
            onClick={() => {
               globalThis.electronAPI.modelStarter();
            }}
         >
              INSTALL LLAMA.CPP
         </Button>
         <Button
            onClick={() => {
               globalThis.electronAPI.modelInstall(MODEL_HASH);
            }}
         >
             INSTALL MODEL
         </Button>
         <Button
            onClick={() => {
               globalThis.electronAPI.modelRun(MODEL_HASH);
            }}
         >
             RUN MODEL
         </Button>
         <Button
            onClick={() => {
               window.electronAPI.modelDownloadedList().then((data) => {
                  console.log(data);
                  alert(
                     data.length > 0
                        ? `Model is installed with hash: ${data.map((item) => item.hash).join(", ")}`
                        : "Model is not installed"
                  );
               });
            }}
         >
             MODEL CHECK INSTALL
         </Button>
         <Button
            onClick={() => {
               globalThis.electronAPI.modelCheckRunning().then((hash?: string) => {
                  console.log(hash);
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