import {Box, Flex, Image, Text} from "@chakra-ui/react";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import s from './styles.module.scss';
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import {formatLongAddress} from "@utils/format.ts";
import useFundAgent from "../../../../providers/FundAgent/useFundAgent.ts";

const AgentWalletInfo = () => {
  const { selectedAgent, agentWallet } = useContext(AgentContext);

  const { setDepositAgentID } = useFundAgent();

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied.');
  };

  const handleDeposit = () => {
    setDepositAgentID(selectedAgent?.agent_id);
  }

  return (
    <Flex className={s.container} justifyContent={"space-between"} alignItems={"center"}>
      <Flex onClick={() => onClickCopy(agentWallet?.address || '')} cursor={"pointer"} alignItems={"center"} gap={"4px"}>
        <Text fontSize={"13px"} fontWeight={400} opacity={0.7}>{formatLongAddress(agentWallet?.address || '')} </Text>
        <Image
          h={'16px'}
          src={`/icons/ic-copy-grey.svg`}
        />
      </Flex>
      <Flex gap={"4px"} alignItems={"center"}>
        <Text as={"span"} fontSize={"13px"} fontWeight={400} opacity={0.7}>Balance</Text>
        <Text as={"span"} fontSize={"13px"} fontWeight={400} opacity={0.7}>12 EAI</Text>
        •
        <Text as={"span"} fontSize={"13px"} fontWeight={400} textDecoration={"underline"} cursor={'pointer'} onClick={handleDeposit}>Topup</Text>&nbsp;
      </Flex>
    </Flex>
  )
}

export default AgentWalletInfo;