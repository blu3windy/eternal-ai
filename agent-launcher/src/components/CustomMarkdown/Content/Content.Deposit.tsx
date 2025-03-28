import { Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import s from "./styles.module.scss";
import { formatCurrency } from "@utils/format";
import { AgentContext } from "@pages/home/provider/AgentContext";

export const depositRegex =
  /(\d+)\s?\$EAI.*?(0x[a-fA-F0-9]{5,}).*?\b(in\s+(\w+))/i;

const ContentDeposit = (props) => {
  const { agentWallet } = useContext(AgentContext);

  const { matchDeposit } = props;
  const amount = matchDeposit[1];
  const address = matchDeposit[2];
  const network = matchDeposit[4];

  const walletAddress = agentWallet?.address;

  console.log("agentWallet", matchDeposit);

  return (
    <Flex className={s.contentDeposit}>
      <Text>
        Send {formatCurrency(amount)} $EAI to the provided wallet to cover
        network fees, so your agent can execute your orders seamlessly.
      </Text>
      <Flex mt={"5px"} alignItems={"flex-end"} gap={"6px"}>
        <Text fontSize={"12px"} opacity={"0.8"}>
          Network
        </Text>
        <Text fontSize={"14px"} fontWeight={"500"}>
          {network}
        </Text>
      </Flex>
      <Flex alignItems={"flex-end"} gap={"6px"}>
        <Text fontSize={"12px"} opacity={"0.8"}>
          Address
        </Text>
        <Text fontSize={"14px"} fontWeight={"500"}>
          {walletAddress}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ContentDeposit;
