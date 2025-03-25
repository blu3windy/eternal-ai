import { Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import BackgroundWrapper from "@components/BackgroundWrapper";
import LoadingText from "@components/LoadingText";
import StarterLogs from "@pages/authen/Starter/Starter.logs.tsx";
import { MODEL_HASH } from "@components/Loggers/action.button.tsx";
import BaseButton from "@components/BaseButton";
import storageModel from "@storage/StorageModel.ts";
import { get } from "axios";
import CAgentTokenAPI from "@services/api/agents-token";
import { AgentType } from "@pages/home/list-agent";
import { getSetupAgents } from "@pages/authen/ChooseModel/utils.ts";
import { getModelAgentHash } from "@pages/authen/ChooseModel";

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

const tryExecFunction = async (maxRun: number, func: any) => {
   // Try to execute the function
   // If function has error, try to execute the function again maxRun times
   for (let i = 0; i < maxRun; i++) {
      try {
         await func();
      } catch (error) {
         if (i === maxRun - 1) {
            throw error;
         }
      }
   }
}

const Starter = (props: IProps) => {
   const { onCheckHasUser } = props;
   const { setChecking } = useStarter();
   const initRef = useRef(false);
   const agentAPI = useRef(new CAgentTokenAPI());

   const [step] = useState<Step>("INITIALIZING");

   const [hasError, setHasError] = useState(false);

   const onInit = async (ignoreCopy?: boolean) => {
      try {
         console.time("FULL_LOAD_TIME");
         await onCheckHasUser();
         if (!ignoreCopy) {
            await globalThis.electronAPI.dockerCopyBuild();
         }

         console.time("DOCKER_INSTALL");

         await tryExecFunction(2, globalThis.electronAPI.dockerInstall);
         // await globalThis.electronAPI.dockerInstall();
         console.timeEnd("DOCKER_INSTALL");

         console.time("DOCKER_BUILD");

         await tryExecFunction(2, globalThis.electronAPI.dockerBuild);
         // await globalThis.electronAPI.dockerBuild();
         console.timeEnd("DOCKER_BUILD");

         const activeModel = await storageModel.getActiveModel();
         if (!activeModel) {
            const {
               agents
            } = await agentAPI.current.getAgentTokenList({
               agent_types: [AgentType.ModelOnline, AgentType.Model].join(','),
            });
            const _agents = (await getSetupAgents(agents)).filter((agent) => agent.agent_type === AgentType.ModelOnline);
            if (!_agents?.length) {
               alert("No model only found");
               throw new Error("No model only found");
            }
            const newAgent = _agents[0];
            const hash = await getModelAgentHash(newAgent);
            if (!hash) {
               alert("Model hash not found");
               throw new Error("Model hash not found");
            }

            await storageModel.setActiveModel({
               id: newAgent.id,
               agent_id: newAgent.agent_id,
               agent_type: newAgent.agent_type,
               hash: hash,
            })
         } else {
            if (activeModel.agent_type === AgentType.Model) {
               await globalThis.electronAPI.modelInstallBaseModel(activeModel.hash);
            }
         }

         // console.time("MODEL_BASE");
         // await tryExecFunction(2, async () => {
         //    await globalThis.electronAPI.modelInstallBaseModel(MODEL_HASH);
         // });
         // // await globalThis.electronAPI.modelInstallBaseModel(MODEL_HASH);
         // console.timeEnd("MODEL_BASE");

         setChecking(false);
      } catch (error: any) {
         // alert(error?.message || "Something went wrong.");
         setHasError(true);
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
               {hasError && (
                  <BaseButton 
                     maxWidth="120px"
                     onClick={() => {
                        setHasError(false);
                        setChecking(true);
                        onInit(true).then().catch();
                     }}
                  >
                     Try again
                  </BaseButton>
               )}
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

export default Starter;