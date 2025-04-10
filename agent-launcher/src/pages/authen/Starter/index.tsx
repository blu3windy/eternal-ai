import { Center, Image, Box } from "@chakra-ui/react";
import BackgroundWrapper from "@components/BackgroundWrapper";
import BaseButton from "@components/BaseButton";
import { getSetupAgents } from "@pages/authen/ChooseModel/utils.ts";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import StarterLogs from "@pages/authen/Starter/Starter.logs.tsx";
import { AgentType } from "@pages/home/list-agent/constants";
import CAgentTokenAPI from "@services/api/agents-token";
import storageModel from "@storage/StorageModel.ts";
import { useContext, useEffect, useRef, useState } from "react";
import AgentProvider from "@pages/home/provider/AgentProvider";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { setReadyPort } from "@utils/agent.ts";
import useDockerMonitorState from "@providers/DockerMonitor/useDockerMonitorState";
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
   const agentAPI = useRef(new CAgentTokenAPI());

   const { setContainers, setImages } = useDockerMonitorState();

   const [step] = useState<Step>("INITIALIZING");
   const [isShowWarning, setIsShowWarning] = useState(false);
   const initTimerRef = useRef<NodeJS.Timeout>();

   const [hasError, setHasError] = useState(false);
   const agentCtx = useContext(AgentContext);

   const { setIsFinished } = useStarter();

   const setDefaultAgent = async () => {
      const {
         agents
      } = await agentAPI.current.getAgentTokenList({
         agent_types: [AgentType.ModelOnline].join(','),
      });
      const _agents = (await getSetupAgents(agents)).filter((agent) => agent.agent_type === AgentType.ModelOnline);
      if (!_agents?.length) {
         alert("No model only found");
         throw new Error("No model only found");
      }
      const newAgent = _agents[0];
      await agentCtx.startAgent(newAgent);
      await storageModel.setActiveModel({
         ...newAgent,
         hash: ""
      })
   }


   const onInit = async (ignoreCopy?: boolean) => {
      const loaded = await localStorage.getItem("loaded");
      const time = (loaded ? 15 : 50) * 60 * 1000; // 15 minutes for loaded users, 50 minutes for new users

      // Start the timer based on whether user is loaded or not
      initTimerRef.current = setTimeout(() => {
         setIsShowWarning(true);
      }, time);

      try {
         setIsFinished(false);
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

         const activeModel = await storageModel.getActiveModel();
         if (!activeModel) {
            await setDefaultAgent();
         } else {
            try {
               switch (activeModel.agent_type) {
               case AgentType.ModelOnline: {
                  await agentCtx.startAgent(activeModel);
                  break;
               }
               case AgentType.Model:
                  await setReadyPort();
                  await globalThis.electronAPI.modelInstallBaseModel(activeModel.hash);
                  break;
               }
            } catch (error) {
               await setDefaultAgent();
            }
         }

         const { containers, images } = await window.electronAPI.getInitialDockerData();
         console.log('LEON HIHI 000', { containers, images });

         setContainers(containers);
         setImages(images);

         setChecking(false);
         localStorage.setItem("loaded", "true");
      } catch (error: any) {
         console.log('LEON HIHI 000', error);
         setHasError(true);
      } finally {
         console.timeEnd("FULL_LOAD_TIME");
         setIsFinished(true);
         // Clear the timer if init completes before timeout
         if (initTimerRef.current) {
            clearTimeout(initTimerRef.current);
         }
      }
   };

   const onClearCounter = () => {
      if (initTimerRef.current) {
         clearTimeout(initTimerRef.current);
      }
   };

   const onRetry = () => {
      setHasError(false);
      setChecking(true);
      setIsShowWarning(false);
      onClearCounter();
      onInit(true).then().catch();
   };

   // Cleanup timer on unmount
   useEffect(() => {
      return () => {
         onClearCounter();
      };
   }, []);


   const renderContent = () => {
      switch (step) {
      case "INITIALIZING": {
         return (
            <Center flexDirection="column" gap="12px">
               <LoadingIcon />
               <StarterLogs isShowWarning={isShowWarning || hasError} hasError={hasError} onRetry={onRetry}/>
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
      <BackgroundWrapper
         showSlider={true}
      >
         {renderContent()}
      </BackgroundWrapper>
   )
};


const Container = (props: IProps) => {
   return(
      <AgentProvider>
         <Starter loadingUser={props.loadingUser} onCheckHasUser={props.onCheckHasUser}/>
      </AgentProvider>
   )
}

export default Container;