import s from "./styles.module.scss";
import {Box, Button, Divider, Flex, Text, useDisclosure} from "@chakra-ui/react";
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
import BaseModal from "@components/BaseModal";
import ExportPrivateKey from "@pages/home/chat-agent/ExportPrivateKey";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

  const color = useMemo(() => {
    return isCanChat || showBackupPrvKey ? 'black' : 'white';
  }, [isCanChat, showBackupPrvKey]);

  const handleExportPrvKey = () => {
    onOpen();
  }

  return (
    <Flex className={s.container}>
      <Flex justifyContent={"space-between"} w={"100%"} gap={"6px"}>
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
          {
            selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey && (
              <Button className={s.btnExport} onClick={handleExportPrvKey}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z"/></svg>
              </Button>
            )
          }
          <Button className={s.btnBuy} onClick={() => setIsTrade((v) => !v)}>
            {isTrade ? "Chat" : "Buy"}
          </Button>
        </Flex>
      </Flex>
      <Flex minW={"350px"} justifyContent={"flex-end"}>
        <HeaderWallet color={color}/>
      </Flex>
      <BaseModal
        isShow={isOpen}
        onHide={onClose}
        title={'Export private key'}
        size="small"
      >
        <ExportPrivateKey />
      </BaseModal>
    </Flex>
  );
};

export default AgentInfo;
