import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import s from "./styles.module.scss";
import FormTradeAgentContainer from "./form-trade";
import { useContext } from "react";
import { AgentContext } from "../provider";
import TokenChart from "./chart-token";
import AgentOnChainInfo from "./onchain-info";

const TradeAgent = () => {
  const { selectedAgent } = useContext(AgentContext);
  return (
    <Flex className={s.container}>
      <TokenChart />
      <Flex className={s.tradeContainer}>
        <Flex gap={"8px"} p={"24px"} flexDirection={"column"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize={"16px"} fontWeight={"500"}>
              {selectedAgent?.agent_name}{" "}
              <Text as={"span"} opacity={0.7}>
                ${selectedAgent?.token_symbol}
              </Text>
            </Text>

            {/* <Box
              cursor={"pointer"}
              background={"#fff"}
              padding={"10px"}
              borderRadius={"100px"}
            >
              <Image src="/icons/ic-chart.svg" />
            </Box> */}
          </Flex>
          <Text fontSize={"14px"}>{selectedAgent?.token_desc}</Text>
        </Flex>
        <Divider borderColor={"rgba(0, 0, 0, 0.1)"} />
        <FormTradeAgentContainer />
        <Box p={"0px 24px"}>
          <AgentOnChainInfo />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TradeAgent;
