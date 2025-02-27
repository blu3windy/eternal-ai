import s from './styles.module.scss';
import {Button, Flex, Text} from "@chakra-ui/react";
import SelectModel from "@pages/home/chat-agent/AgentInfo/SelectModel";
import {useContext, useState} from "react";
import {AgentContext} from "@pages/home/provider";
import {formatCurrency} from "@utils/format.ts";
import Percent24h from "@components/Percent";

const AgentInfo = () => {
  const { currentModel, setCurrentModel, selectedAgent } = useContext(AgentContext);

  return (
    <Flex className={s.container} justifyContent={"space-between"}>
      <SelectModel
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        chainId={selectedAgent?.network_id}
      />
      <Flex gap={"6px"} alignItems={"center"}>
        <Text>{selectedAgent?.agent_name}</Text>
        <Text opacity={0.6}>${selectedAgent?.token_symbol}</Text>
        •
        <Text>
          ${formatCurrency(selectedAgent?.meme?.price_usd, 0, 6)}
        </Text>
        <Percent24h
          clsName={s.percent}
          percent={selectedAgent?.meme?.percent || 0}
        />
        <Button className={s.btnBuy}>Buy</Button>
      </Flex>

    </Flex>
  )
};

export default AgentInfo;