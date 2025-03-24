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

type Props = {
   // some props
};

const HandleHome = () => {
   const { isCanChat, isBackupedPrvKey, selectedAgent, agentWallet } =
      useContext(AgentContext);

   const showBackupPrvKey =
      selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   return (
      <Flex height={"100%"}>
         <Box flex={1} maxW={"460px"}>
            <AgentsList />
         </Box>
         <Box
            className={cx(
               s.detailContainer,
               isCanChat || showBackupPrvKey ? "" : s.isSetup
            )}
            flex={2}
         >
            <AgentTopInfo />
            <Flex w={"clamp(300px, 60%, 800px)"} mx={"auto"} maxW={"800px"}>
               <ChatAgent />
            </Flex>
         </Box>
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
