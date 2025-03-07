import { Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import s from "./styles.module.scss";
import { formatCurrency } from "@utils/format";
import { AgentContext } from "@pages/home/provider";

export const depositRegex =
  /(\d+)\s?\$EAI.*?(0x[a-fA-F0-9]{5,}).*?\b(in\s+(\w+))/i;

const ContentDeposit = (props) => {
  const { agentWallet } = useContext(AgentContext);

  const { matchDeposit } = props;
  const amount = matchDeposit[1];
  const address = matchDeposit[2];
  const network = matchDeposit[3];

  const walletAddress = agentWallet?.address;

  console.log("agentWallet", agentWallet);

  return (
    <Flex className={s.contentDeposit}>
      <Text>
        Insufficient balance! You need at least {formatCurrency(amount)} $EAI to
        proceed with address {walletAddress} in {network}.
      </Text>
    </Flex>
  );
};

export default ContentDeposit;
