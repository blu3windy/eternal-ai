import s from "./styles.module.scss";
import {Button, Flex, Text} from "@chakra-ui/react";
import SelectModel from "@pages/home/chat-agent/AgentInfo/SelectModel";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import {formatCurrency} from "@utils/format.ts";
import Percent24h from "@components/Percent";
import InfoTooltip from "@components/InfoTooltip";

const AgentInfo = () => {
  const {
    currentModel,
    setCurrentModel,
    selectedAgent,
    stopAgent,
    isStopping,
    setIsTrade,
    isTrade,
    isRunning,
  } = useContext(AgentContext);

  const description =
    selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

  const handleInstall = (e: any) => {
    stopAgent(selectedAgent);
  };

  return (
    <Flex className={s.container} justifyContent={"space-between"}>
      <SelectModel
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        chainId={selectedAgent?.network_id}
        showDescription={false}
      />
      <Flex gap={"6px"} alignItems={"center"}>
        {isRunning && (
          <Button
            className={s.btnInstall}
            onClick={handleInstall}
            isLoading={isStopping}
            isDisabled={isStopping}
            loadingText={"Stopping..."}
          >
            Stop
          </Button>
        )}
        <InfoTooltip iconSize="sm" label={description} placement="top" />
        <Text>{selectedAgent?.agent_name}</Text>
        <Text opacity={0.6}>${selectedAgent?.token_symbol}</Text>•
        <Text>${formatCurrency(selectedAgent?.meme?.price_usd, 0, 6)}</Text>
        <Percent24h
          clsName={s.percent}
          percent={selectedAgent?.meme?.percent || 0}
        />
        <Button className={s.btnBuy} onClick={() => setIsTrade((v) => !v)}>
          {isTrade ? "Chat" : "Buy"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default AgentInfo;
