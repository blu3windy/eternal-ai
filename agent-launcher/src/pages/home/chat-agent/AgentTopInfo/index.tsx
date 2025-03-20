import s from "./styles.module.scss";
import {
   Button,
   Divider,
   Drawer,
   DrawerBody,
   DrawerCloseButton,
   DrawerContent,
   DrawerOverlay,
   Flex,
   Text,
   useDisclosure
} from "@chakra-ui/react";
import SelectModel from "@pages/home/chat-agent/AgentTopInfo/SelectModel";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AgentContext } from "@pages/home/provider";
import { formatCurrency } from "@utils/format.ts";
import Percent24h from "@components/Percent";
import InfoTooltip from "@components/InfoTooltip";
import { AgentType } from "@pages/home/list-agent";
import HeaderWallet from "@components/header/wallet";
import cx from 'clsx';
import AgentOnChainInfo from "@pages/home/trade-agent/onchain-info";
import BaseModal from "@components/BaseModal";
import ExportPrivateKey from "@pages/home/chat-agent/ExportPrivateKey";
import TradeAgent from "@pages/home/trade-agent";
import AgentTradeProvider from "@pages/home/trade-agent/provider";
import { addressFormater } from "@utils/string";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Avatar from "@components/Avatar";
import { BASE_CHAIN_ID } from "@constants/chains";
import CAgentContract from "@contract/agent";
import localStorageService from "@storage/LocalStorageService";

const AgentTopInfo = () => {
   const {
      selectedAgent,
      isCanChat,
      agentWallet,
      isBackupedPrvKey,
      isStopping,
      stopAgent,
      requireInstall,
      isRunning,
      startAgent,
   } = useContext(AgentContext);

   const {
      isOpen,
      onOpen,
      onClose
   } = useDisclosure();
   const {
      isOpen: isOpenDrawer,
      onOpen: onOpenDrawer,
      onClose: onCloseDrawer
   } = useDisclosure();

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   const color = useMemo(() => {
      return isCanChat || showBackupPrvKey ? 'black' : 'white';
   }, [isCanChat, showBackupPrvKey]);

   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);

   const description = selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

   const allowStopAgent = useMemo(() => {
      return [AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt].includes(selectedAgent?.agent_type);
   }, [selectedAgent])

    useEffect(() => {
      checkVersionCode();
   }, [selectedAgent])

   const checkVersionCode = async () => {
      setHaveNewVersionCode(false);
      if ([AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt].includes(selectedAgent?.agent_type)) {
         const chainId = selectedAgent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({
            contractAddress: selectedAgent.agent_contract_address,
            chainId: chainId
         });
         const codeVersion = await cAgent.getCurrentVersion();
         const values = await localStorageService.getItem(selectedAgent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : 0;
         if (oldCodeVersion > 0 && codeVersion > oldCodeVersion) {
            setHaveNewVersionCode(true);
         }
      }
   };

   const handleUpdateCode = async () => {
      await stopAgent(selectedAgent);
      await startAgent(selectedAgent, true);
   }

   const handleExportPrvKey = () => {
      onOpen();
   }

   const handleStopAgent = () => {
      stopAgent(selectedAgent);
   };

   const handleClickCreator = (e: any) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (selectedAgent?.tmp_twitter_info?.twitter_username)
         window.open(`https://x.com/${selectedAgent?.tmp_twitter_info?.twitter_username}`);
   };

   return (
      <>
         <Flex className={s.container} position={"relative"}>
            <Flex position={"absolute"} left={"16px"}>
               {
                  isCanChat && [AgentType.Infra, AgentType.CustomPrompt].includes(selectedAgent?.agent_type as AgentType) && (
                     <SelectModel showDescription={false}/>
                  )
               }
            </Flex>
            <Flex
               gap={"6px"} justifyContent={"center"} alignItems={"center"}
               className={cx(s.contentContainer, isCanChat || showBackupPrvKey ? '' : s.isSetup)}
               w="clamp(300px, 60%, 800px)" mx={"auto"}
            >
               <Flex gap={"6px"} alignItems={"center"} className={s.content}>
                  <InfoTooltip iconSize="sm" label={
                     <Flex direction={"column"} p={"8px"}>
                        <Flex direction={"column"} gap={"8px"}>
                           <Text fontSize={"16px"} fontWeight={500}>{selectedAgent?.agent_name}</Text>
                           <Flex
                              alignItems="center"
                              gap="4px"
                              onClick={handleClickCreator}
                           >
                              <Text color="#000000" fontSize="12px" fontWeight="400" opacity={0.7}>
                                 by
                              </Text>
                              {selectedAgent?.tmp_twitter_info?.twitter_avatar ? (
                                 <Avatar
                                    url={selectedAgent?.tmp_twitter_info?.twitter_avatar}
                                    width={16}
                                 />
                              ) : (
                                 <Jazzicon
                                    diameter={16}
                                    seed={jsNumberForAddress(selectedAgent?.creator || '')}
                                 />
                              )}
                              <Text color="#000000" fontSize="12px" fontWeight="400" opacity={0.7}>
                                 {selectedAgent?.tmp_twitter_info?.twitter_username
                                    ? `@${selectedAgent?.tmp_twitter_info?.twitter_username}`
                                    : addressFormater(selectedAgent?.creator)}
                              </Text>
                           </Flex>
                           <Text fontSize={"14px"} fontWeight={400} opacity={0.7}>{description}</Text>
                        </Flex>
                        <Divider color={"#E2E4E8"} my={"16px"}/>
                        <AgentOnChainInfo/>
                        {
                           allowStopAgent && requireInstall && isRunning && (
                              <>
                                 <Divider color={"#E2E4E8"} my={"16px"}/>
                                 <Button
                                    className={s.btnStop}
                                    onClick={handleStopAgent}
                                    isLoading={isStopping}
                                    isDisabled={isStopping}
                                    loadingText={"Stopping..."}
                                 >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="black"/>
                                       <path d="M6 18V6H18V18H6Z" fill="black"/>
                                    </svg>
                                    Stop running {selectedAgent?.agent_name}
                                 </Button>
                              </>
                           )
                        }
                        {
                           hasNewVersionCode && (
                              <>
                                 <Divider color={"#E2E4E8"} mt={"16px"} mb={'8px'}/>
                                 <Button
                                    className={s.btnUpdateCode}
                                    onClick={handleUpdateCode}
                                 >
                                    A new code version is available. Update now?
                                 </Button>
                              </>
                           )
                        }
                     </Flex>
                  } placement="top" iconColor={color}/>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                           <path
                              d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z"/>
                        </svg>
                     </Button>
                  )
               }
               <Button className={s.btnBuy} onClick={onOpenDrawer}>
                  Buy
               </Button>
            </Flex>
            <Flex justifyContent={"flex-end"} position={"absolute"} right={"16px"}>
               <HeaderWallet color={color}/>
            </Flex>
         </Flex>
         <BaseModal
            isShow={isOpen}
            onHide={onClose}
            title={'Export private key'}
            size="small"
         >
            <ExportPrivateKey/>
         </BaseModal>
         <Drawer
            isOpen={isOpenDrawer}
            placement="right"
            onClose={onCloseDrawer}
         >
            <DrawerOverlay/>
            <DrawerContent bg={'#EDEDF2'} minW={'420px'}>
               <DrawerCloseButton/>
               <DrawerBody>
                  <AgentTradeProvider>
                     <TradeAgent/>
                  </AgentTradeProvider>
               </DrawerBody>
            </DrawerContent>
         </Drawer>
      </>
   );
};

export default AgentTopInfo;
