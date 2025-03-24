import { Box, Flex } from "@chakra-ui/react";
import cx from "clsx";
import { useContext, useMemo } from "react";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentTopInfo from "./chat-agent/AgentTopInfo";
import AgentsList, { AgentType } from "./list-agent";
import AgentProvider, { AgentContext } from "./provider";
import s from "./styles.module.scss";
import { ChatAgentProvider } from "./chat-agent/ChatAgent/provider";

type Props = {
   // some props
};

const HandleHome = () => {
   const { isCanChat, isBackupedPrvKey, selectedAgent, agentWallet, requireInstall, isRunning } =
      useContext(AgentContext);

   const showBackupPrvKey =
      selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   const showSetup = useMemo(() => {
      return requireInstall && !isRunning;
   }, [requireInstall, isRunning]);

   return (
      <Flex height={"100%"}>
         <Box flex={1} maxW={"460px"}>
            <AgentsList />
         </Box>
         <ChatAgentProvider>
            <Box
               className={cx(
                  s.detailContainer,
                  showSetup || (!isCanChat && !showBackupPrvKey) ? s.isSetup : "",
               )}
               flex={2}
            >
               <AgentTopInfo />
               <Flex w={"clamp(300px, 60%, 800px)"} mx={"auto"}>
                  <ChatAgent />
               </Flex>
            </Box>
         </ChatAgentProvider>
      </Flex>
   );
};

const Home = (_props: Props) => {
   return (
      <MainLayout className={s.container}>
         <AgentProvider>
            <FundAgentProvider>
               <HandleHome />
            </FundAgentProvider>
         </AgentProvider>
      </MainLayout>
   );
};

export default Home;
