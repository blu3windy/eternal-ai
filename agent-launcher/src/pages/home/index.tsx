import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentsList, { AgentType } from "./list-agent";
import AgentProvider, { AgentContext } from "./provider";
import s from "./styles.module.scss";
import { useContext, useMemo } from "react";
import TradeAgent from "./trade-agent";
import AgentInfo from "./chat-agent/AgentInfo";
import { Box } from "@chakra-ui/react";
import cx from "clsx";
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
    <PanelGroup direction="horizontal">
      <Panel minSize={20} maxSize={25}>
        <AgentsList />
      </Panel>
      <PanelResizeHandle />
      <Panel
        minSize={50}
        maxSize={60}
        className={cx(
          s.detailContainer,
          isCanChat || showBackupPrvKey ? "" : s.isSetup
        )}
        id={"detailContainer"}
      >
        <Box p={"16px"}>
          <AgentInfo />
        </Box>

        {isTrade ? (
          <AgentTradeProvider>
            <TradeAgent />
          </AgentTradeProvider>
        ) : (
          <ChatAgent />
        )}
      </Panel>
      <PanelResizeHandle />
    </PanelGroup>
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
