import { Box, Flex } from "@chakra-ui/react";
import cx from "clsx";
import { useContext, useMemo, useState } from "react";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentTopInfo from "./chat-agent/AgentTopInfo";
import AgentsList from "./list-agent";
import AgentProvider from "./provider/AgentProvider";
import { AgentContext } from "./provider/AgentContext";
import s from "./styles.module.scss";
import MonitorProvider from "@providers/Monitor/MonitorProvider";
import { GarbageProvider } from "@providers/GarbageDocker";
import { ChatAgentProvider } from "./chat-agent/ChatAgent/provider";
import useAgentState from "./provider/useAgentState";

type Props = {
   // some props
};

const HandleHome = () => {
   const { isCanChat, isBackupedPrvKey, selectedAgent, agentWallet, requireInstall, isRunning }
      = useContext(AgentContext);

   const showBackupPrvKey
      = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   const { isSearchMode } = useAgentState();

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   const showSetup = useMemo(() => {
      return requireInstall && !isRunning;
   }, [requireInstall, isRunning]);

   return (
      <Flex height={"100%"}>
         <Box flex={1} maxW={"460px"} minW={"460px"}>
            <AgentsList />
         </Box>
         <Box
            className={cx(
               s.detailContainer,
               isSearchMode || showSetup || (!isCanChat && !showBackupPrvKey) ? s.isSetup : ""
            )}
            flex={2}
         >
            <Flex w={"clamp(600px, 81%, 1200px)"} mx={"auto"}>
               <ChatAgent />
            </Flex>
         </Box>
      </Flex>
   );
};

const Home = (_props: Props) => {
   return (
      <MainLayout className={s.container}>
         <MonitorProvider>
            <AgentProvider>
               <ChatAgentProvider>
                  <GarbageProvider>
                     <FundAgentProvider>
                        <HandleHome />
                     </FundAgentProvider>
                  </GarbageProvider>
               </ChatAgentProvider>
            </AgentProvider>
         </MonitorProvider>
      </MainLayout>
   );
};

export default Home;
