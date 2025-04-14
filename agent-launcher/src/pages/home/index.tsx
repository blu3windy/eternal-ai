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
import { useSelector } from "react-redux";
import { layoutViewSelector } from "@stores/states/layout-view/selector";
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
   // some props
};

const HandleHome = () => {
   const { isOpenAgentBar, isOpenRightBar, rightBarView } = useSelector(layoutViewSelector);
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
         <AnimatePresence>
            {isOpenAgentBar && ( 
               <Box
                  flex={1}
                  maxW={"460px"}
                  minW={"460px"}
                  as={motion.div}
                  // initial={{ opacity: 0, x: -460 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -460 }}
               >
                  <AgentsList />
               </Box>
            )}
         </AnimatePresence>

         <Box
            className={cx(
               s.detailContainer,
               isSearchMode || showSetup || (!isCanChat && !showBackupPrvKey) ? s.isSetup : ""
            )}
            flex={1}
            as={motion.div}
            // initial={{ opacity: 0, x: 460 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 460 }}
         >
            <Flex
               as={motion.div}
               w={"clamp(600px, 81%, 1200px)"}
               mx={"auto"}
               // initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
            >
               <ChatAgent />
            </Flex>
         </Box>

         <AnimatePresence>
            {isOpenRightBar && ( 
               <Box
                  flex={1}
                  as={motion.div}
                  // initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
               >
                  {rightBarView}
               </Box>
            )}
         </AnimatePresence>
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
