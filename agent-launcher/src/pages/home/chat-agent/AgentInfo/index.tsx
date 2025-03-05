import s from "./styles.module.scss";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import SelectModel from "@pages/home/chat-agent/AgentInfo/SelectModel";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import {formatCurrency} from "@utils/format.ts";
import Percent24h from "@components/Percent";
import InfoTooltip from "@components/InfoTooltip";
import {AgentType} from "@pages/home/list-agent";
import HeaderWallet from "@components/header/wallet";

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
    isInstalled,
    isStarting,
    startAgent
  } = useContext(AgentContext);

  const description =
    selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

  const handleStartStop = () => {
    if (isRunning) {
      stopAgent(selectedAgent);
    } else {
      startAgent(selectedAgent);
    }
  };

  return (
    <Flex className={s.container}>
      <Flex justifyContent={"space-between"} w={"100%"}>
        {
          selectedAgent?.agent_type === AgentType.UtilityJS ? (
            <SelectModel
              currentModel={currentModel}
              setCurrentModel={setCurrentModel}
              chainId={selectedAgent?.network_id}
              showDescription={false}
            />
          ) : (
            <Box/>
          )
        }
        <Flex gap={"6px"} alignItems={"center"}>
          {isInstalled && (
            <Button
              className={s.btnInstall}
              onClick={handleStartStop}
              isLoading={isStarting || isStopping}
              isDisabled={isStarting || isStopping}
              loadingText={isStarting ? "Starting..." : "Stopping..."}
            >
              {isRunning ? "Stop" : "Start"}
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
      <Flex minW={"350px"} justifyContent={"flex-end"}>
        <HeaderWallet color={"black"}/>
      </Flex>
    </Flex>
  );
};

export default AgentInfo;
