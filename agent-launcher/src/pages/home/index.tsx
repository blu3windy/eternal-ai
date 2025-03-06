import { Box, Flex } from "@chakra-ui/react";
import MainLayout from "../../components/layout";
import ChatAgent from "./chat-agent";
import TradeAgent from "./trade-agent";
import AgentProvider from "./provider";

type Props = {};

const Home = (_props: Props) => {
  return (
    <MainLayout>
      <AgentProvider>
        <Flex gap={"12px"}>
          <Box flex={1}>
            <ChatAgent />
          </Box>
          <Box w={"353px"}>
            <TradeAgent />
          </Box>
        </Flex>
      </AgentProvider>
    </MainLayout>
  );
};

export default Home;
