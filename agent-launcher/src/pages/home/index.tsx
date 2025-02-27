import MainLayout from "../../components/layout";
import ChatAgent from "./chat-agent";
import TradeAgent from "./trade-agent";
import AgentProvider from "./provider";
import AgentsList from "./list-agent";
import FundAgentProvider from "../../providers/FundAgent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import s from "./styles.module.scss";

type Props = {};

const Home = (_props: Props) => {
  return (
    <MainLayout className={s.container}>
      <AgentProvider>
        <FundAgentProvider>
          <PanelGroup direction="horizontal">
            <Panel minSize={20} maxSize={25}>
              <AgentsList />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={50} maxSize={60}>
              <ChatAgent />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={20} maxSize={25}>
              <TradeAgent />
            </Panel>
          </PanelGroup>
        </FundAgentProvider>
      </AgentProvider>
    </MainLayout>
  );
};

export default Home;
