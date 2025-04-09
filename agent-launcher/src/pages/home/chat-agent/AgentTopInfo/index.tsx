import {
   Box,
   Button,
   Divider,
   Drawer,
   DrawerBody,
   DrawerCloseButton,
   DrawerContent,
   DrawerOverlay,
   Flex,
   Image,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import Avatar from '@components/Avatar';
import BaseModal from '@components/BaseModal';
import InfoTooltip from '@components/InfoTooltip';
import Percent24h from '@components/Percent';
import { BASE_CHAIN_ID } from '@constants/chains';
import CAgentContract from '@contract/agent';
import SelectModel from '@pages/home/chat-agent/AgentTopInfo/SelectModel';
import DeleteAgentModal from '@pages/home/list-agent/AgentMonitor/DeleteAgentModal';
import { AgentType, SYSTEM_AGENTS } from '@pages/home/list-agent/constants';
import { AgentContext } from '@pages/home/provider/AgentContext';
import TradeAgent from '@pages/home/trade-agent';
import AgentOnChainInfo from '@pages/home/trade-agent/onchain-info';
import AgentTradeProvider from '@pages/home/trade-agent/provider';
import CAgentTokenAPI from '@services/api/agents-token';
import { IAgentToken } from '@services/api/agents-token/interface';
import localStorageService from '@storage/LocalStorageService';
import storageModel from '@storage/StorageModel';
import { formatCurrency } from '@utils/format.ts';
import { addressFormater, compareString } from '@utils/string';
import cx from 'clsx';
import { useContext, useEffect, useMemo, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import SetupEnvModel from '../SetupEnvironment';
import s from './styles.module.scss';
import debounce from 'lodash.debounce';


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
      isStarting,
      isInstalled,
      unInstallAgent,
      isUnInstalling,
      installAgent,
      installedModelAgents,
   } = useContext(AgentContext);

   const [isShowSetupEnvModel, setIsShowSetupEnvModel] = useState(false);
   const [environments, setEnvironments] = useState<JSON>();

   const { isOpen, onOpen, onClose } = useDisclosure();
   const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

   const [isLiked, setIsLiked] = useState(false);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();

   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);
   const [isClickUpdateCode, setIsClickUpdate] = useState(false);

   const cAgentTokenAPI = new CAgentTokenAPI();

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   const showSetup = useMemo(() => {
      return requireInstall && !isRunning;
   }, [requireInstall, isRunning]);

   const color = useMemo(() => {
      if (hasNewVersionCode && isInstalled) {
         return 'red';
      }
      return showSetup || (!isCanChat && !showBackupPrvKey) ? 'white' : 'black';
   }, [isCanChat, showBackupPrvKey, showSetup, hasNewVersionCode, isInstalled]);
   
   const colorWallet = useMemo(() => {
      return showSetup || (!isCanChat && !showBackupPrvKey) ? 'white' : 'black';
   }, [isCanChat, showBackupPrvKey, showSetup, hasNewVersionCode, isInstalled]);

   const description = selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

   const allowStopAgent = useMemo(() => {
      return !SYSTEM_AGENTS.some(id => compareString(id, selectedAgent?.id));
   }, [selectedAgent]);

   const getEnvironments = async () => {
      const storageEnv = await storageModel.getEnvironment({
         contractAddress: selectedAgent?.agent_contract_address || '',
         chainId: selectedAgent?.network_id,
      });
      const baseEnv = JSON.parse(selectedAgent?.env_example || "{}");
      const environments = Object.assign(baseEnv, storageEnv);
      setEnvironments(environments);
   };

   useEffect(() => {
      setHaveNewVersionCode(false);
      if (selectedAgent || !isRunning) {
         checkVersionCode();
         checkIsLiked();
      }
   }, [selectedAgent, isRunning, isInstalled]);

   useEffect(() => {
      if (selectedAgent) {
         getEnvironments();
      }
   }, [selectedAgent]);

   const checkVersionCode = async () => {
      if (
         selectedAgent?.agent_type
         && [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(selectedAgent.agent_type)
      ) {
         let codeVersion = selectedAgent?.code_version ? Number(selectedAgent?.code_version) : 0;
         if (codeVersion === 0) {
            const chainId = selectedAgent?.network_id || BASE_CHAIN_ID;
            const cAgent = new CAgentContract({
               contractAddress: selectedAgent?.agent_contract_address || '',
               chainId: chainId,
            });
            codeVersion = await cAgent.getCurrentVersion();
         }
         const values = await localStorageService.getItem(selectedAgent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : -1;

         if (oldCodeVersion > 0 && codeVersion > 1 && codeVersion > oldCodeVersion) {
            setHaveNewVersionCode(true);
         } else {
            setHaveNewVersionCode(false);
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
      await stopAgent(selectedAgent, true);
      await unInstallAgent(selectedAgent, false);
      await installAgent(selectedAgent, true);
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

   const showSelectModel = useMemo(() => {
      return isCanChat && installedModelAgents && installedModelAgents.length > 0 && [AgentType.Infra, AgentType.CustomPrompt].includes(
         selectedAgent?.agent_type as AgentType
      );
   }, [isCanChat, installedModelAgents, selectedAgent]);

   return (
      <>
         <Flex className={s.container} position={'relative'}>
            {/* <Flex position={'absolute'} left={'16px'}>
               {isCanChat &&
                  [AgentType.Infra, AgentType.CustomPrompt].includes(
                     selectedAgent?.agent_type as AgentType
                  ) && <SelectModel showDescription={false} />}
            </Flex> */}
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
               {
                  showSelectModel ? (
                     <SelectModel showDescription={false} />
                  ) : (<Box />)
               }

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
                                          {selectedAgent?.display_name || selectedAgent?.agent_name}
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
                              {!!environments && selectedAgent?.env_example && (
                                 <>
                                    <Divider color={'#E2E4E8'} my={'16px'} />
                                    <Button
                                       className={s.btnStop}
                                       onClick={async () => {
                                          handleStopAgent();
                                          setIsShowSetupEnvModel(true);
                                       }}
                                       isDisabled={isStopping}
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path d="M20.19 17.59L13.6 20.65C12.59 21.12 11.41 21.12 10.4 20.65L3.81 17.59C2.73 17.09 2.73 15.55 3.81 15.05L3.95001 14.99L9.76999 17.68C10.47 18.01 11.22 18.18 12 18.18C12.78 18.18 13.53 18.01 14.23 17.68L20.05 14.99L20.19 15.05C21.27 15.55 21.27 17.09 20.19 17.59ZM20.19 10.72L20.06 10.66L15.4 12.83L14.23 13.37C13.53 13.69 12.78 13.86 12 13.86C11.22 13.86 10.47 13.69 9.76999 13.37L8.60001 12.83L3.94 10.66L3.81 10.72C2.73 11.23 2.73 12.77 3.81 13.27L5.73001 14.16L10.4 16.32C10.91 16.56 11.45 16.68 12 16.68C12.55 16.68 13.09 16.56 13.6 16.32L18.27 14.16L20.19 13.27C21.27 12.77 21.27 11.23 20.19 10.72ZM20.19 6.41L13.6 3.35001C13.09 3.12001 12.55 3 12 3C11.45 3 10.91 3.12001 10.4 3.35001L3.81 6.41C2.73 6.91 2.73 8.45001 3.81 8.95001L3.94 9.01001L4.82999 9.42001L5.72 9.84L10.4 12.01C10.91 12.24 11.45 12.36 12 12.36C12.55 12.36 13.09 12.24 13.6 12.01L18.28 9.84L19.17 9.42001L20.06 9.01001L20.19 8.95001C21.27 8.45001 21.27 6.91 20.19 6.41Z" fill="black"/>
                                       </svg>
                                       Update environment
                                    </Button>
                                 </>
                              )}
                              {allowStopAgent && requireInstall && isRunning && (
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
                                       Stop
                                    </Button>
                                 </>
                              )}
                              {allowStopAgent && requireInstall && isInstalled && (
                                 <>
                                    <Divider color={'#E2E4E8'} my={'16px'} />
                                    <Button
                                       className={s.btnStop}
                                       onClick={() => setDeleteAgent(selectedAgent)}
                                       isLoading={isUnInstalling && !isClickUpdateCode}
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
                                       Delete
                                    </Button>
                                 </>
                              )}
                              {hasNewVersionCode && (
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
                        showIcon
                     >
                        <Flex ml={'4px'} cursor={'pointer'} gap={'6px'} alignItems={'center'}>
                           <Text className={s.text}>{selectedAgent?.display_name || selectedAgent?.agent_name}</Text>
                           <Text className={s.text} opacity={0.7}>
                              ${selectedAgent?.token_symbol}
                           </Text>
                        </Flex>
                     </InfoTooltip>
                     
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
                  {/* {selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey && (
                     <AgentTradeProvider>
                        <AgentWallet color={colorWallet}/>
                     </AgentTradeProvider>
                  )} */}
                  <Button className={s.btnBuy} onClick={onOpenDrawer}>
                     Buy
                  </Button>
               </Flex>
            </Flex>
            {/* <Flex justifyContent={"flex-end"} position={"absolute"} right={"16px"}>
               <HeaderWallet color={color} />
            </Flex> */}
         </Flex>
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
            agentName={deleteAgent?.display_name || deleteAgent?.agent_name}
            isOpen={!!deleteAgent}
            onClose={() => {
               setDeleteAgent(undefined);
            }}
            onDelete={() => {
               if (deleteAgent) {
                  unInstallAgent(deleteAgent);
                  setDeleteAgent(undefined);
               }
            }}
         />
         {!!environments && isShowSetupEnvModel && (
            <BaseModal isShow={isShowSetupEnvModel} onHide={() => {
               // storageModel.setEnvironment({
               //    contractAddress: selectedAgent?.agent_contract_address || '',
               //    chainId: selectedAgent?.network_id,
               // }, JSON.stringify(environments || {}));
               setIsShowSetupEnvModel(false);
            }} title={'Setup environment'} size="small">
               <SetupEnvModel
                  agent={selectedAgent}
                  environments={JSON.stringify(environments || "")}
                  onSubmit={async () => {
                     try {
                        await getEnvironments();
                        setIsShowSetupEnvModel(false);
                     } catch (error) {
                        console.log(error);
                     }
                  }}
               />
            </BaseModal>
         )}
      </>
   );
};

export default AgentTopInfo;
