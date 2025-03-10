
import { Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import BaseButton from "@components/BaseButton";
import sleep from "@utils/sleep.ts";
import BackgroundWrapper from "@components/BackgroundWrapper";
import LoadingText from "@components/LoadingText";
import useParseLogs from "@hooks/useParseLogs.ts";
import StarterLogs from "@pages/authen/Starter/Starter.logs.tsx";


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
   const initRef = useRef(false);

   const {
      parsedLogs
   } = useParseLogs({
      functionName: "INITIALIZE",
      keys: ["name", "message", "error"]
   })

   console.log("Parsed Logs:", parsedLogs);

   const [step] = useState<Step>("INITIALIZING");
   const [installing, setInstalling] = useState<boolean>(false);
   const [installError, setInstallError] = useState<string | undefined>();

   const onInit = async (ignoreCopy?: boolean) => {
      try {
         console.time("FULL_LOAD_TIME");
         await onCheckHasUser();
         if (!ignoreCopy) {
            await window.electronAPI.dockerCopyBuild();
         }

         console.time("DOCKER_INSTALL");
         await window.electronAPI.dockerInstall();
         console.timeEnd("DOCKER_INSTALL");

         await window.electronAPI.dockerCheckInstall();

         console.time("DOCKER_BUILD");
         await window.electronAPI.dockerBuild();
         console.timeEnd("DOCKER_BUILD");

         // await window.electronAPI.modelStarter();

         setChecking(false);

         // await window.electronAPI.modelStarter();

         // const hasDocker = await window.electronAPI.dockerCheckInstall();
         // if (hasDocker) {
         //    await window.electronAPI.dockerBuild();
         //    // await window.electronAPI.modelStarter();
         //    setChecking(false);
         // } else {
         //    setStep("REQUEST_INSTALL_DOCKER");
         // }
      } catch (error) {
         // alert("Error while checking Docker" + window.electronAPI);
         console.error(error);
      } finally {
         console.timeEnd("FULL_LOAD_TIME");
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
               <LoadingText dataText="Initializing..." />
               <StarterLogs />
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
      }
   }, [])


   return (
      <BackgroundWrapper>
         {renderContent()}
      </BackgroundWrapper>
   )
};

export default Starter;