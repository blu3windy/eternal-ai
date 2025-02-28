import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MainLayout from "../../components/layout";
import FundAgentProvider from "../../providers/FundAgent";
import ChatAgent from "./chat-agent";
import AgentsList from "./list-agent";
import AgentProvider from "./provider";
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
          </PanelGroup>
        </FundAgentProvider>
      </AgentProvider>
    </MainLayout>
  );
};

export default Home;
