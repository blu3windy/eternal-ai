import s from "./styles.module.scss";
import {Box, Button, Divider, Flex, Text} from "@chakra-ui/react";
import SelectModel from "@pages/home/chat-agent/AgentInfo/SelectModel";
import React, {useContext, useMemo} from "react";
import {AgentContext} from "@pages/home/provider";
import {formatCurrency} from "@utils/format.ts";
import Percent24h from "@components/Percent";
import InfoTooltip from "@components/InfoTooltip";
import {AgentType} from "@pages/home/list-agent";
import HeaderWallet from "@components/header/wallet";
import cx from 'clsx';
import AgentOnChainInfo from "@pages/home/trade-agent/onchain-info";

const AgentInfo = () => {
  const {
    currentModel,
    setCurrentModel,
    selectedAgent,
    setIsTrade,
    isTrade,
    isCanChat,
    agentWallet,
    isBackupedPrvKey,
  } = useContext(AgentContext);

  const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

  const color = useMemo(() => {
    return isCanChat || showBackupPrvKey ? 'black' : 'white';
  }, [isCanChat, showBackupPrvKey]);

  return (
    <Flex className={s.container}>
      <Flex justifyContent={"space-between"} w={"100%"}>
        {
          isCanChat && [AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(selectedAgent?.agent_type as AgentType) ? (
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
        <Flex gap={"6px"} alignItems={"center"} className={cx(s.contentContainer, isCanChat || showBackupPrvKey ? '' : s.isSetup)}>
          <Flex gap={"6px"} alignItems={"center"} className={s.content}>
            <InfoTooltip iconSize="sm" label={<AgentOnChainInfo />} placement="top" iconColor={color} />
            <Text className={s.text}>{selectedAgent?.agent_name}</Text>
            <Text className={s.text} opacity={0.7}>${selectedAgent?.token_symbol}</Text>
            <Divider orientation={'vertical'} borderColor={'#FFFFFF1A'} h={"32px"} m={'auto 0'}/>
            <Text className={s.text}>${formatCurrency(selectedAgent?.meme?.price_usd, 0, 6)}</Text>
            <Percent24h
              clsName={s.percent}
              percent={selectedAgent?.meme?.percent || 0}
            />
          </Flex>
          <Button className={s.btnBuy} onClick={() => setIsTrade((v) => !v)}>
            {isTrade ? "Chat" : "Buy"}
          </Button>
        </Flex>
      </Flex>
      <Flex minW={"350px"} justifyContent={"flex-end"}>
        <HeaderWallet color={color}/>
      </Flex>
    </Flex>
  );
};

export default AgentInfo;
