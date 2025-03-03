import { Center, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

   const [step, setStep] = useState<Step>("INITIALIZING");
   const [installing, setInstalling] = useState<boolean>(false);
   const [installError, setInstallError] = useState<string | undefined>();

   const onInit = async (ignoreCopy?: boolean) => {
      try {
         console.log("onInit");
         await onCheckHasUser();
         if (!ignoreCopy) {
            await window.electronAPI.dockerCopyBuild();
         }
         const hasDocker = await window.electronAPI.dockerCheckInstall();
         if (hasDocker) {
            await window.electronAPI.dockerBuild();
            setChecking(false);
         } else {
            setStep("REQUEST_INSTALL_DOCKER");
         }
      } catch (error) {
         // alert("Error while checking Docker" + window.electronAPI);
         console.error(error);
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
      }
      }
   }

   useEffect(() => {
      onInit().then().catch();
   }, [])

   return (
      <Center
         background="linear-gradient(180deg, #E4E5D8 0%, #CBD6E8 100%)"
         width="100dvw"
         height="100dvh"
      >
         {renderContent()}
      </Center>
   )
};

export default Starter;