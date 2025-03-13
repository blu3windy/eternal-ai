import { Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import BackgroundWrapper from "@components/BackgroundWrapper";
import LoadingText from "@components/LoadingText";
import StarterLogs from "@pages/authen/Starter/Starter.logs.tsx";
import { MODEL_HASH } from "@components/Loggers/action.button.tsx";

interface IProps {
   loadingUser: boolean;
   onCheckHasUser: () => Promise<void>;
}

type Step = "INITIALIZING";

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

   const [step] = useState<Step>("INITIALIZING");

   const onInit = async (ignoreCopy?: boolean) => {
      try {
         console.time("FULL_LOAD_TIME");
         await onCheckHasUser();
         if (!ignoreCopy) {
            await globalThis.electronAPI.dockerCopyBuild();
         }

         console.time("DOCKER_INSTALL");
         await globalThis.electronAPI.dockerInstall();
         console.timeEnd("DOCKER_INSTALL");

         console.time("DOCKER_BUILD");
         await globalThis.electronAPI.dockerBuild();
         console.timeEnd("DOCKER_BUILD");

         await globalThis.electronAPI.modelInstallBaseModel(MODEL_HASH);

         setChecking(false);
      } catch (error) {

      } finally {
         console.timeEnd("FULL_LOAD_TIME");
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