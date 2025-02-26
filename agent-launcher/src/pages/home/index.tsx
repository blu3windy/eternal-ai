import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import MainLayout from "../../components/layout";
import ChatAgent from "./chat-agent";
import TradeAgent from "./trade-agent";
import AgentProvider from "./provider";
import AgentsList from "./list-agent";
import FundAgentProvider from "../../providers/FundAgent";

type Props = {};

const Home = (_props: Props) => {
  return (
    <MainLayout>
      <AgentProvider>
        <FundAgentProvider>
          <Flex>
            <SimpleGrid gridTemplateColumns={"500px 1fr"} flex={1} bg={"#FFF"}>
              <AgentsList />
              <ChatAgent />
            </SimpleGrid>
            <Box w={"353px"}>
              <TradeAgent />
            </Box>
          </Flex>
        </FundAgentProvider>
      </AgentProvider>
    </MainLayout>
  );
};

export default Home;
