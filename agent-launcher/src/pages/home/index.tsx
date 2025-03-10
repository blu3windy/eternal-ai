import { Box, Flex } from "@chakra-ui/react";
import cx from "clsx";
import { useContext } from "react";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentInfo from "./chat-agent/AgentInfo";
import AgentsList from "./list-agent";
import AgentProvider, { AgentContext } from "./provider";
import s from "./styles.module.scss";
import TradeAgent from "./trade-agent";
import AgentTradeProvider from "./trade-agent/provider";

type Props = {
  // some props
};

const HandleHome = () => {
  const { isTrade, isCanChat, isBackupedPrvKey, selectedAgent, agentWallet } =
    useContext(AgentContext);

  const showBackupPrvKey =
    selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

  return (
    <Flex height={"100%"}>
      <Box flex={1} maxW={"400px"}>
        <AgentsList />
      </Box>
      <Box
        className={cx(
          s.detailContainer,
          isCanChat || showBackupPrvKey ? "" : s.isSetup
        )}
        flex={2}
      >
        <Box p={"16px"}>
          <AgentInfo />
        </Box>

        {isTrade ? (
          <AgentTradeProvider>
            <TradeAgent />
          </AgentTradeProvider>
        ) : (
          <Flex w={"100%"}>
            <ChatAgent />
            <Box minW={"350px"} />
          </Flex>
        )}
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
