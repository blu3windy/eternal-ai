import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import s from "./styles.module.scss";
import FormTradeAgentContainer from "./form-trade";

const TradeAgent = () => {
  return (
    <Flex className={s.container}>
      <Flex gap={"8px"} p={"24px"} flexDirection={"column"}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize={"16px"} fontWeight={"500"}>
            CineMaster-3000{" "}
            <Text as={"span"} opacity={0.7}>
              $TYW
            </Text>
          </Text>

          <Box
            cursor={"pointer"}
            background={"#fff"}
            padding={"10px"}
            borderRadius={"100px"}
          >
            <Image src="/icons/ic-chart.svg" />
          </Box>
        </Flex>
        <Text fontSize={"14px"}>
          Cryptoknight Drakon, born from fusion of medieval fantasy and
          blockchain...
        </Text>
      </Flex>
      <Divider borderColor={"rgba(0, 0, 0, 0.1)"} />
      <FormTradeAgentContainer />
    </Flex>
  );
};

export default TradeAgent;
