import { Box, Divider, Flex, Text, Image } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AgentContext } from "../provider/AgentContext";
import TokenChart from "./chart-token";
import Curving from "./curving";
import FormTradeAgentContainer from "./form-trade";
import s from "./styles.module.scss";
import Percent24h from "@components/Percent";
import { formatCurrency } from "@utils/format";
import HeaderWallet from "@components/header/wallet";

const TradeAgent = () => {
  const { selectedAgent } = useContext(AgentContext);
  const [isShowChart, setIsShowChart] = useState(false);

  return (
    <Flex className={s.container}>
      <Flex className={s.tradeContainer}>
        <Box mt={'32px'}>
          {/* <Flex gap={"8px"} p={"24px"} flexDirection={"column"}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Text fontSize={"16px"} fontWeight={"500"}>
                {selectedAgent?.agent_name}{" "}
                <Text as={"span"} opacity={0.7}>
                  ${selectedAgent?.token_symbol}
                </Text>
              </Text>
            </Flex>
            <Text fontSize={"14px"}>{selectedAgent?.token_desc}</Text>
          </Flex> */}
          <Flex gap={"8px"} p={"4px"} flexDirection={"column"} alignItems={'flex-end'} marginRight={'-4px'}>
            <HeaderWallet color={'black'} />
          </Flex>
          <Flex gap={"8px"} p={"4px"} flexDirection={"column"} mt={'20px'}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Flex direction={'column'}>
                <Text fontSize={"12px"} fontWeight={"400"} opacity={0.7}>
                  Price
                </Text>
                <Text fontSize={"28px"} fontWeight={"400"}>
                  ${formatCurrency(selectedAgent?.meme?.price_usd, 0, 6)}
                </Text>
              </Flex>
              <Flex direction={'column'}>
                <Text textAlign={'right'} fontSize={"12px"} fontWeight={"400"} opacity={0.7}>
                  24H %
                </Text>
                <Flex gap={'8px'} alignItems={'center'}>
                  <Percent24h 
                    clsName={s.percent}
                    percent={selectedAgent?.meme?.percent || 0}
                  />
                  <Image
                    w={'28px'}
                    h={'28px'}
                    cursor={'pointer'}
                    src={`icons/ic-chart-1.png`}
                    onClick={()  => setIsShowChart(true)}
                  />
                </Flex>
              </Flex>
            </Flex>

          </Flex>
          <Divider borderColor={"rgba(0, 0, 0, 0.1)"} mt={'12px'} mb={'16px'}/>
          {isShowChart 
            ? 
              <Flex position={'relative'} paddingTop={'32px'} h={'100%'}>
                <TokenChart />
                <Flex position={'absolute'} left={'0px'} top={'0px'}>
                  <Image
                    h={'32px'}
                    cursor={'pointer'}
                    src={`icons/ic-back-chart.png`}
                    onClick={()  => setIsShowChart(false)}
                  />
                </Flex>
              </Flex>
            : 
              <FormTradeAgentContainer />
            }
        </Box>
        <Box p={"4px"}>
          <Curving />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TradeAgent;
