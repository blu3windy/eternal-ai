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
   useDisclosure,
   Image,
} from '@chakra-ui/react';
import Avatar from '@components/Avatar';
import BaseModal from '@components/BaseModal';
import HeaderWallet from '@components/header/wallet';
import InfoTooltip from '@components/InfoTooltip';
import Percent24h from '@components/Percent';
import { BASE_CHAIN_ID } from '@constants/chains';
import CAgentContract from '@contract/agent';
import SelectModel from '@pages/home/chat-agent/AgentTopInfo/SelectModel';
import ExportPrivateKey from '@pages/home/chat-agent/ExportPrivateKey';
import { AgentType } from '@pages/home/list-agent/constants';
import { AgentContext } from '@pages/home/provider/AgentContext';
import TradeAgent from '@pages/home/trade-agent';
import AgentOnChainInfo from '@pages/home/trade-agent/onchain-info';
import AgentTradeProvider from '@pages/home/trade-agent/provider';
import CAgentTokenAPI from '@services/api/agents-token';
import localStorageService from '@storage/LocalStorageService';
import { formatCurrency } from '@utils/format.ts';
import { addressFormater, compareString } from '@utils/string';
import cx from 'clsx';
import { useContext, useEffect, useMemo, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import s from './styles.module.scss';
import ProcessingTasks from './ProcessingTasks';
import { IAgentToken } from '@services/api/agents-token/interface';
import DeleteAgentModal from '@pages/home/list-agent/AgentMonitor/DeleteAgentModal';
import storageModel from '@storage/StorageModel';
import { useDispatch } from 'react-redux';
import { requestReloadListAgent } from '@stores/states/common/reducer';

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
      isStarting,
      isInstalled,
      unInstallAgent,
      isUnInstalling,
      currentActiveModel,
   } = useContext(AgentContext);

   const dispatch = useDispatch();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

   const [isLiked, setIsLiked] = useState(false);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();

   const cAgentTokenAPI = new CAgentTokenAPI();

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   const showSetup = useMemo(() => {
      return requireInstall && !isRunning;
   }, [requireInstall, isRunning]);

   const color = useMemo(() => {
      return showSetup || (!isCanChat && !showBackupPrvKey) ? 'white' : 'black';
   }, [isCanChat, showBackupPrvKey, showSetup]);

   const deleteAble = useMemo(() => {
      return !(
         compareString(selectedAgent?.agent_name, currentActiveModel?.agent?.agent_name) ||
         currentActiveModel?.dependAgents?.find((address) =>
            compareString(address, selectedAgent?.agent_contract_address)
         ) ||
         compareString(selectedAgent?.agent_name, 'agent-router')
      );
   }, [selectedAgent, currentActiveModel]);

   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);
   const [isClickUpdateCode, setIsClickUpdate] = useState(false);

   const description = selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;
   const allowStopAgent = useMemo(() => {
      return (
         selectedAgent?.agent_type !== undefined &&
         [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(selectedAgent.agent_type)
      );
   }, [selectedAgent]);

   useEffect(() => {
      if (selectedAgent || !isRunning) {
         checkVersionCode();
         checkIsLiked();
      }
   }, [selectedAgent, isRunning]);

   const checkVersionCode = async () => {
      setHaveNewVersionCode(false);
      if (
         selectedAgent?.agent_type &&
         [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(selectedAgent.agent_type)
      ) {
         const chainId = selectedAgent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({
            contractAddress: selectedAgent?.agent_contract_address || '',
            chainId: chainId,
         });
         const codeVersion = await cAgent.getCurrentVersion();
         const values = await localStorageService.getItem(selectedAgent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : 1;
         if (codeVersion > 1 && codeVersion > oldCodeVersion) {
            setHaveNewVersionCode(true);
         }
      }
   };

   const checkIsLiked = async () => {
      if (!selectedAgent?.id) return;
      const res = await cAgentTokenAPI.checkAgentIsLiked(selectedAgent?.id);
      setIsLiked(res);
   };

   const handleLikeAgent = async () => {
      if (isLiked || !selectedAgent?.id) return;

      await cAgentTokenAPI.likeAgent(selectedAgent.id);
      setIsLiked(true);
   };

   const handleUpdateCode = async () => {
      setIsClickUpdate(true);
      if (!selectedAgent) return;
      await stopAgent(selectedAgent);
      await startAgent(selectedAgent, true);
      setIsClickUpdate(false);
   };

   const handleExportPrvKey = () => {
      onOpen();
   };

   const handleStopAgent = () => {
      if (!selectedAgent) return;
      stopAgent(selectedAgent);
   };

   const handleDeleteAgent = () => {
      if (!selectedAgent) return;
      unInstallAgent(selectedAgent);
   };

   const handleClickCreator = (e: any) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (selectedAgent?.tmp_twitter_info?.twitter_username)
         window.open(`https://x.com/${selectedAgent?.tmp_twitter_info?.twitter_username}`);
   };

   return (
      <>
         <Flex className={s.container} position={'relative'}>
            <Flex position={'absolute'} left={'16px'}>
               {isCanChat &&
                  [AgentType.Infra, AgentType.CustomPrompt].includes(
                     selectedAgent?.agent_type as AgentType
                  ) && <SelectModel showDescription={false} />}
            </Flex>
            <Flex
               gap={'6px'}
               justifyContent={'space-between'}
               alignItems={'center'}
               className={cx(
                  s.contentContainer,
                  showSetup || (!isCanChat && !showBackupPrvKey) ? s.isSetup : ''
               )}
               w="clamp(600px, 81%, 1200px)"
               mx={'auto'}
            >
               {/* {isCanChat &&
                  [AgentType.CustomPrompt].includes(
                     selectedAgent?.agent_type as AgentType
                  ) && (
                     <ProcessingTasks />
                  )} */}

               <Flex gap={'6px'} justifyContent={'space-between'} alignItems={'center'}>
                  <Flex gap={'6px'} alignItems={'center'} className={s.content}>
                     <InfoTooltip
                        iconSize="20px"
                        label={
                           <Flex direction={'column'} p={'8px'}>
                              <Flex direction={'column'} gap={'8px'}>
                                 <Flex
                                    alignItems={'center'}
                                    gap={'8px'}
                                    justifyContent={'space-between'}
                                 >
                                    <Flex direction={'column'} gap={'8px'}>
                                       <Text fontSize={'16px'} fontWeight={500}>
                                          {selectedAgent?.agent_name}
                                       </Text>
                                       <Flex
                                          alignItems="center"
                                          gap="4px"
                                          onClick={handleClickCreator}
                                       >
                                          <Text
                                             color="#000000"
                                             fontSize="12px"
                                             fontWeight="400"
                                             opacity={0.7}
                                          >
                                             by
                                          </Text>
                                          {selectedAgent?.tmp_twitter_info?.twitter_avatar ? (
                                             <Avatar
                                                url={
                                                   selectedAgent?.tmp_twitter_info?.twitter_avatar
                                                }
                                                width={16}
                                             />
                                          ) : (
                                             <Jazzicon
                                                diameter={16}
                                                seed={jsNumberForAddress(
                                                   selectedAgent?.creator || ''
                                                )}
                                             />
                                          )}
                                          <Text
                                             color="#000000"
                                             fontSize="12px"
                                             fontWeight="400"
                                             opacity={0.7}
                                          >
                                             {selectedAgent?.tmp_twitter_info?.twitter_username
                                                ? `@${selectedAgent?.tmp_twitter_info?.twitter_username}`
                                                : addressFormater(selectedAgent?.creator)}
                                          </Text>
                                       </Flex>
                                    </Flex>
                                    <Image
                                       src={`icons/${isLiked ? 'ic-liked.svg' : 'ic-like.svg'}`}
                                       width={'28px'}
                                       height={'28px'}
                                       onClick={handleLikeAgent}
                                       cursor={isLiked ? 'not-allowed' : 'pointer'}
                                    />
                                 </Flex>

                                 <Text fontSize={'14px'} fontWeight={400} opacity={0.7}>
                                    {description}
                                 </Text>
                              </Flex>
                              <Divider color={'#E2E4E8'} my={'16px'} />
                              <AgentOnChainInfo />
                              {allowStopAgent && requireInstall && isRunning && deleteAble && (
                                 <>
                                    <Divider color={'#E2E4E8'} my={'16px'} />
                                    <Button
                                       className={s.btnStop}
                                       onClick={handleStopAgent}
                                       isLoading={isStopping && !isClickUpdateCode}
                                       isDisabled={isStopping}
                                       loadingText={'Stopping...'}
                                    >
                                       <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <rect
                                             x="0.5"
                                             y="0.5"
                                             width="23"
                                             height="23"
                                             rx="11.5"
                                             stroke="black"
                                          />
                                          <path d="M6 18V6H18V18H6Z" fill="black" />
                                       </svg>
                                       Stop running {selectedAgent?.agent_name}
                                    </Button>
                                 </>
                              )}
                              {allowStopAgent && requireInstall && isInstalled && deleteAble && (
                                 <>
                                    <Divider color={'#E2E4E8'} my={'16px'} />
                                    <Button
                                       className={s.btnStop}
                                       onClick={handleDeleteAgent}
                                       isLoading={isUnInstalling}
                                       isDisabled={isUnInstalling}
                                       loadingText={'Deleting...'}
                                    >
                                       <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <g opacity="0.7">
                                             <path
                                                d="M4.625 8.375L5.46185 20.3C5.55375 21.6096 6.6429 22.625 7.9557 22.625H16.2943C17.6071 22.625 18.6963 21.6096 18.7882 20.3L19.625 8.375"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                             <path
                                                d="M9.125 4.625V2.875C9.125 2.18464 9.68465 1.625 10.375 1.625H13.875C14.5653 1.625 15.125 2.18464 15.125 2.875V4.625"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                             <path
                                                d="M19.625 4.625H4.625C3.52043 4.625 2.625 5.52045 2.625 6.625V8.125H21.625V6.625C21.625 5.52045 20.7296 4.625 19.625 4.625Z"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                             <path
                                                d="M12.125 11.125V19.625"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                             <path
                                                d="M8.375 11.125L8.875 19.625"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                             <path
                                                d="M15.875 11.125L15.375 19.625"
                                                stroke="black"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                             />
                                          </g>
                                       </svg>
                                       Delete {selectedAgent?.agent_name}
                                    </Button>
                                 </>
                              )}
                              {hasNewVersionCode && isInstalled && (
                                 <>
                                    <Divider color={'#E2E4E8'} mt={'16px'} mb={'8px'} />
                                    <Button
                                       className={s.btnUpdateCode}
                                       onClick={handleUpdateCode}
                                       isLoading={(isStopping || isStarting) && isClickUpdateCode}
                                       isDisabled={(isStopping || isStarting) && isClickUpdateCode}
                                       loadingText={isStarting ? 'Starting...' : 'Updating...'}
                                    >
                                       A new code version is available. Update now?
                                    </Button>
                                 </>
                              )}
                           </Flex>
                        }
                        placement="top"
                        iconColor={color}
                     />
                     <Text className={s.text}>{selectedAgent?.agent_name}</Text>
                     <Text className={s.text} opacity={0.7}>
                        ${selectedAgent?.token_symbol}
                     </Text>
                     <Divider
                        orientation={'vertical'}
                        borderColor={'#0000001F'}
                        h={'28px'}
                        m={'auto 0'}
                     />
                     <Text className={s.text}>
                        ${formatCurrency(selectedAgent?.meme?.price_usd, 0, 6)}
                     </Text>
                     <Percent24h clsName={s.percent} percent={selectedAgent?.meme?.percent || 0} />
                  </Flex>
                  {selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey && (
                     <Button className={s.btnExport} onClick={handleExportPrvKey}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                           <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z" />
                        </svg>
                     </Button>
                  )}
                  <Button className={s.btnBuy} onClick={onOpenDrawer}>
                     Buy
                  </Button>
               </Flex>
            </Flex>
            {/* <Flex justifyContent={"flex-end"} position={"absolute"} right={"16px"}>
               <HeaderWallet color={color} />
            </Flex> */}
         </Flex>
         <BaseModal isShow={isOpen} onHide={onClose} title={'Export private key'} size="small">
            <ExportPrivateKey />
         </BaseModal>
         <Drawer isOpen={isOpenDrawer} placement="right" onClose={onCloseDrawer}>
            <DrawerOverlay />
            <DrawerContent bg={'#EDEDF2'} minW={'420px'}>
               <DrawerCloseButton />
               <DrawerBody>
                  <AgentTradeProvider>
                     <TradeAgent />
                  </AgentTradeProvider>
               </DrawerBody>
            </DrawerContent>
         </Drawer>
         <DeleteAgentModal
            agentName={deleteAgent?.agent_name}
            isOpen={!!deleteAgent}
            onClose={() => {
               setDeleteAgent(undefined);
            }}
            onDelete={() => {
               if (deleteAgent) {
                  unInstallAgent(deleteAgent);
                  setDeleteAgent(undefined);
                  dispatch(requestReloadListAgent());
               }
            }}
         />
      </>
   );
};

export default AgentTopInfo;
