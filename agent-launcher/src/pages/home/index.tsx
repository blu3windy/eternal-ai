import {Box, Flex, SimpleGrid} from "@chakra-ui/react";
import MainLayout from "../../components/layout";
import ChatAgent from "./chat-agent";
import TradeAgent from "./trade-agent";
import AgentProvider from "./provider";
import AgentsList from "./list-agent";

type Props = {};

const Home = (_props: Props) => {
  return (
    <MainLayout>
      <AgentProvider>
        <Flex gap={"12px"}>
          <SimpleGrid gridTemplateColumns={"365px 1fr"} flex={1}>
            <AgentsList />
            <ChatAgent />
          </SimpleGrid>
          <Box w={"353px"}>
            <TradeAgent />
          </Box>
        </Flex>
      </AgentProvider>
    </MainLayout>
  );
};

export default Home;
