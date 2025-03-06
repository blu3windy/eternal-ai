import { Center, Box, Image, Text, useColorModeValue, Code } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import BaseButton from "@components/BaseButton";
import sleep from "@utils/sleep.ts";


interface IProps {
   loadingUser: boolean;
   onCheckHasUser: () => Promise<void>;
}

type Step = "INITIALIZING" | "REQUEST_INSTALL_DOCKER";

const LoadingIcon = () => (
   <Image
      src="icons/eai-loading.gif"
      alt="loading"
      width="80px"
      mixBlendMode="exclusion"
   />
)

const Starter = (props: IProps) => {
   const { onCheckHasUser } = props;
   const { setChecking } = useStarter();
   const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);
   const initRef = useRef(false);

   const [step, setStep] = useState<Step>("INITIALIZING");
   const [installing, setInstalling] = useState<boolean>(false);
   const [installError, setInstallError] = useState<string | undefined>();
   const logRef = useRef<HTMLDivElement>(null);

   const onInit = async (ignoreCopy?: boolean) => {
      try {
         console.time("onInit");
         await onCheckHasUser();
         if (!ignoreCopy) {
            await window.electronAPI.dockerCopyBuild();
         }
         const hasDocker = await window.electronAPI.dockerCheckInstall();
         if (hasDocker) {
            await window.electronAPI.dockerBuild();
            // await window.electronAPI.modelStarter();
            setChecking(false);
         } else {
            setStep("REQUEST_INSTALL_DOCKER");
         }
      } catch (error) {
         // alert("Error while checking Docker" + window.electronAPI);
         console.error(error);
      } finally {
         console.timeEnd("onInit");
      }
   }

   const onInstallDocker = async () => {
      try {
         setInstalling(true);
         await sleep(2000)
         await window.electronAPI.dockerInstall();
         await onInit(true);
         setInstalling(false);
      } catch (error: any) {
         setInstalling(false);
         setInstallError(error?.message);
      }
   }


   const renderContent = () => {
      switch (step) {
      case "INITIALIZING": {
         return (
            <Center flexDirection="column" gap="12px">
               <LoadingIcon />
               <Text fontSize="18px" fontWeight="500" opacity="0.75">
                  Initializing...
               </Text>
            </Center>
         )
      }
      case "REQUEST_INSTALL_DOCKER": {
         return (
            <Center flexDirection="column" gap="24px">
               <Text fontSize="20px" fontWeight="500" opacity="0.75">
                  Docker is not installed, please install Docker to continue
               </Text>
               <BaseButton
                  maxWidth={"200px"}
                  isDisabled={installing}
                  isLoading={installing}
                  onClick={onInstallDocker}
               >
                  Install Docker
               </BaseButton>
               <Text color="red" fontSize="14px">
                  {installError}
               </Text>
            </Center>
         )
      }}
   }

   useEffect(() => {
      if (!initRef?.current) {
         initRef.current = true;
         onInit().then().catch();
         window.electronAPI.onCommandEvent((data) => {
            setLogs((prev) => [...prev, data]); // Append logs
         });
      }
   }, [])

   useEffect(() => {
      // Auto-scroll to the bottom when new logs appear
      if (logRef.current) {
         logRef.current.scrollTop = logRef.current.scrollHeight;
      }
   }, [logs]);

   return (
      <Center
         background="linear-gradient(180deg, #E4E5D8 0%, #CBD6E8 100%)"
         width="100dvw"
         height="100dvh"
         flexDirection="column"
         gap="24px"
      >
         {renderContent()}
         <Box
            ref={logRef}
            w="full"
            maxW="3xl"
            h="400px"
            overflowY="auto"
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            shadow="lg"
         >
            {logs.length === 0 ? (
               <Text textAlign="center" color="gray.500">
                   No logs yet. Click the button to run a command.
               </Text>
            ) : (
               logs.map((log, index) => (
                  <Box
                     key={index}
                     p={2}
                     borderRadius="md"
                     mb={1}
                     bg={log.type === "error" ? "red.500" : "gray.700"}
                     color="white"
                  >
                     <Text fontWeight="bold">{log.type.toUpperCase()}:</Text>
                     <Code whiteSpace="pre-wrap" fontSize="sm">
                        {log.message.trim()}
                     </Code>
                  </Box>
               ))
            )}
         </Box>
      </Center>
   )
};

export default Starter;