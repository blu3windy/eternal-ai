import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentsList, {AgentType} from "./list-agent";
import AgentProvider, { AgentContext } from "./provider";
import s from "./styles.module.scss";
import {useContext, useMemo} from "react";
import TradeAgent from "./trade-agent";
import AgentInfo from "./chat-agent/AgentInfo";
import { Box } from "@chakra-ui/react";
import cx from "clsx";

type Props = {
   // some props
};

const HandleHome = () => {
  const { isTrade, isCanChat } = useContext(AgentContext);

  return (
    <PanelGroup direction="horizontal">
      <Panel minSize={20} maxSize={25}>
        <AgentsList />
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={50} maxSize={60} className={cx(s.detailContainer, !isCanChat ? s.isSetup : '')}>
        <Box pl={"60px"} pr={"16px"}>
          <AgentInfo />
        </Box>
        {/* <TradeAgent /> */}
        {isTrade ? <TradeAgent /> : <ChatAgent />}
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
