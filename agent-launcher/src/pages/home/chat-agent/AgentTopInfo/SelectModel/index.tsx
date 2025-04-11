import {
   Box,
   Button,
   Circle,
   Divider,
   Flex,
   IconButton,
   Image,
   Menu,
   MenuButton,
   MenuItem,
   MenuList,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Text,
   useDisclosure
} from '@chakra-ui/react';
import BaseModal from "@components/BaseModal";
import Loading from '@components/Loading';
import { AgentStatus, AgentStatusLabel, AgentType, SYSTEM_AGENTS } from '@pages/home/list-agent/constants';
import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import storageModel from '@storage/StorageModel';
import cs from 'classnames';
import { useContext, useEffect, useMemo, useState } from 'react';
import SetupEnvModel from '../../SetupEnvironment';
import s from './styles.module.scss';
import AgentDetail from '../../AgentDetail';
import DeleteAgentModal from '@pages/home/list-agent/AgentMonitor/DeleteAgentModal';
import { compareString } from '@utils/string';
import { AgentDetailProvider } from './AgentDetailProvider';

export const RenameModels: any = {
   'NousResearch/Hermes-3-Llama-3.1-70B-FP8': 'Hermes 3 70B',
   'PrimeIntellect/INTELLECT-1-Instruct': 'INTELLECT-1 10B',
   'neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16': 'Llama 3.1 405B',
   'unsloth/Llama-3.3-70B-Instruct-bnb-4bit': 'Llama 3.3 70B',
   'DeepSeek-R1-Distill-Llama-70B': 'DeepSeek-R1',
   'NousResearch/DeepHermes-3-Llama-3-8B-Preview': 'DeepHermes 3',
   'unsloth/r1-1776-GGUF': 'DeepSeek-R1 1776',
};

export const RenameDescriptionModels: any = {
   'DeepSeek-R1-Distill-Llama-70B': 'Ideal for Math, code, and reasoning tasks',
   'NousResearch/DeepHermes-3-Llama-3-8B-Preview':
      'Enabled toggling between intuitive and reasoning-based response modes.',
};

const PAGE_SIZE = 5;

type Props = {
   disabled?: boolean;
   title?: string;
   className?: string;
   showDescription?: boolean;
};

const ItemToken = ({
   onSelect,
   onDelete,
   onClose,
   agent,
   isSelected,
   onShowSetupEnv,
   onShowAgentDetail,
}: {
   onSelect: any;
   onDelete: any;
   onClose: any;
   agent: IAgentToken;
   isSelected: boolean;
   onShowSetupEnv: (agent: IAgentToken) => void;
   onShowAgentDetail: (agent: IAgentToken) => void;
}) => {
   const { agentStates, installAgent, } = useContext(AgentContext);

   const isStarting = useMemo(() => {
      return agentStates[agent.id]?.isStarting;
   }, [agentStates, agent]);

   const isInstalling = useMemo(() => {
      return agentStates[agent.id]?.isInstalling;
   }, [agentStates, agent]);

   const isInstalled = useMemo(() => {
      return agentStates[agent.id]?.isInstalled;
   }, [agentStates, agent]);

   const isUnInstalling = useMemo(() => {
      return agentStates[agent.id]?.isUnInstalling;
   }, [agentStates, agent]);

   const avatarUrl
      = agent?.thumbnail
      || agent?.token_image_url
      || agent?.twitter_info?.twitter_avatar;

   const requirements = agent?.required_info;

   const modelSize = useMemo(() => {
      return requirements?.disk || 0;
   }, [agent]);

   const allowStopAgent = useMemo(() => {
      return !SYSTEM_AGENTS.some(id => compareString(id, agent?.id));
   }, [agent]);

   const handleRemoveAgent = (e: any) => {
      e?.preventDefault();
      e?.stopPropagation();

      onDelete(agent);
      onClose();
   }

   const handleViewDetail = (e: any) => {
      e?.preventDefault();
      e?.stopPropagation();
      onShowAgentDetail(agent);
   }

   const handleInstall = async () => {
      if (isInstalled) return;
      if (!agent) return;

      if (agent?.env_example) {
         const environment = await storageModel.getEnvironment({ contractAddress: agent?.agent_contract_address, chainId: agent?.network_id });
         console.log('environment', environment);

         if (!environment) {
            onShowSetupEnv(agent);
            return;
         }
      }

      installAgent(agent);
   };

   const runStatus = useMemo(() => {
      if (agent) {
         return AgentStatusLabel[agent.run_status as AgentStatus];
      }

      return '';
   }, [agent]);

   const allowSelect = useMemo(() => {
      return isInstalled || agent?.agent_type === AgentType.ModelOnline;
   }, [isInstalled, agent]);

   return (
      <>
         <Flex
            className={cs(
               s.itemToken,
               // compareString(model.name, 'chainId') && s.active,
               !allowSelect && s.disabled,
            )}
            onClick={() => {
               if (allowSelect) {
                  onSelect(agent);
               }
            }}
         >
            <Flex alignItems={'center'} justifyContent={'space-between'}>
               <Flex alignItems={'flex-start'} gap="16px">
                  {avatarUrl ? (
                     <Image
                        className={s.itemIcon}
                        src={avatarUrl}
                        borderRadius={'50%'}
                     />
                  ) : (
                     <Image
                        className={s.itemIcon}
                        src={`icons/ic-llama.png`}
                     />
                  )}

                  <Flex direction="column" gap="4px">
                     <Text className={s.itemTitle}>
                        {agent?.display_name || agent?.agent_name}
                     </Text>
                     <Flex gap={"4px"} alignItems={"center"}>
                        <Text className={s.itemAmount}>
                           {runStatus}
                        </Text>
                        {
                           agent?.agent_type === AgentType.Model && (
                              <>
                                 <Image src={`icons/ic-dot.svg`} w={'6px'} h={'6px'} />
                                 <Text className={s.itemAmount}>
                                    {modelSize} GB
                                 </Text>
                              </>
                           )
                        }
                        <>
                           <Image src={`icons/ic-dot.svg`} w={'6px'} h={'6px'} />
                           <Text className={s.itemAmount} textDecoration={"underline"} onClick={handleViewDetail}>
                              View detail
                           </Text>
                        </>
                     </Flex>
                  </Flex>
               </Flex>
               {
                  isSelected ? (
                     <Circle size={'24px'} className={s.itemDot}>
                        <Circle size={'16px'} />
                     </Circle>
                  ) : isStarting || isInstalling ? (
                     <Loading />
                  ) : !isInstalled ? (
                     <Box onClick={handleInstall}>
                        <Image src={`icons/ic-install.svg`} w={'24px'} h={'24px'} />
                     </Box>
                  ) : (
                     <Box />
                  )
               }
            </Flex>
         </Flex>
      </>
   );
};

const AddMoreRow = ({ onClose, onLoadMore }: { onClose: () => void, onLoadMore: () => void, }) => {
   const { setIsSearchMode, setCategory } = useContext(AgentContext);

   return (
      <Flex
         onClick={() => {
            // setCategory(CategoryOption.Model);
            // setIsSearchMode(true);
            // onClose();
            onLoadMore();
         }}
         alignItems="center"
         gap="12px"
         cursor="pointer"
         p="16px 24px"
      >
         <Text fontSize="16px" fontWeight="400">
            Load more
         </Text>
      </Flex>
   );
};

const SelectModel = ({
   disabled,
   className,
   showDescription = true,
}: Props) => {
   const { installedModelAgents, availableModelAgents, startAgent, unInstallAgent, installAgent, agentStates } = useContext(AgentContext);
   const {
      selectedAgent,
      isCanChat,
      agentWallet,
      isBackupedPrvKey,
      requireInstall,
      isRunning,
   } = useContext(AgentContext);

   const [activeModel, setActiveModel] = useState<any>(null);
   const [page, setPage] = useState<number>(0);

   // Filter out installed agents from available agents
   const filteredAvailableAgents = useMemo(() => {
      if (!installedModelAgents || !availableModelAgents) return [];
      
      const installedIds = installedModelAgents.map(agent => agent.id);
      return availableModelAgents.filter(agent => !installedIds.includes(agent.id));
   }, [installedModelAgents, availableModelAgents]);

   // Combine installed agents with available agents (up to PAGE_SIZE)
   const models = useMemo(() => {
      if (!installedModelAgents) return [];
      
      // Sort installed agents: ModelOnline first, then by prompt_calls (descending)
      const sortedInstalledAgents = [...installedModelAgents].sort((a, b) => {
         // ModelOnline agents come first
         if (a.agent_type === AgentType.ModelOnline && b.agent_type !== AgentType.ModelOnline) return -1;
         if (a.agent_type !== AgentType.ModelOnline && b.agent_type === AgentType.ModelOnline) return 1;
         
         // If both are ModelOnline or both are not, sort by prompt_calls
         const aCalls = a.prompt_calls || 0;
         const bCalls = b.prompt_calls || 0;
         return bCalls - aCalls; // Descending order
      });
      
      // Always show all installed agents
      const result = [...sortedInstalledAgents];
      
      // If we have less than PAGE_SIZE installed agents, add from available
      if (result.length < PAGE_SIZE) {
         const remainingCount = PAGE_SIZE - result.length;
         const availableToShow = filteredAvailableAgents.slice(0, remainingCount);
         result.push(...availableToShow);
      }
      
      return result;
   }, [installedModelAgents, filteredAvailableAgents]);

   // For load more functionality
   const additionalModels = useMemo(() => {
      if (page === 0) return [];
      
      // Calculate how many installed agents we've already shown
      const shownInstalledCount = Math.min(installedModelAgents?.length || 0, PAGE_SIZE);
      
      // Calculate how many available agents we've already shown
      const shownAvailableCount = Math.min(
         filteredAvailableAgents.length,
         Math.max(0, PAGE_SIZE - shownInstalledCount) + (page - 1) * PAGE_SIZE
      );
      
      // Get the next batch of available agents
      return filteredAvailableAgents.slice(shownAvailableCount, shownAvailableCount + PAGE_SIZE);
   }, [page, installedModelAgents, filteredAvailableAgents]);

   // Determine if we should show load more button
   const showLoadMore = useMemo(() => {
      const totalShown = models.length + additionalModels.length;
      const totalAvailable = (installedModelAgents?.length || 0) + filteredAvailableAgents.length;
      return totalShown < totalAvailable;
   }, [models, additionalModels, installedModelAgents, filteredAvailableAgents]);

   const checkActiveModel = async () => {
      const model = await storageModel.getActiveModel();
      if (model?.id !== activeModel?.id) {
         setActiveModel(model);
      }
   };

   useEffect(() => {
      checkActiveModel();

      const intervalId = setInterval(checkActiveModel, 2000);

      return () => {
         clearInterval(intervalId);
      };
   }, []);

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   const showSetup = useMemo(() => {
      return requireInstall && !isRunning;
   }, [requireInstall, isRunning]);

   const color = useMemo(() => {
      return showSetup || (!isCanChat && !showBackupPrvKey) ? 'white' : 'black';
   }, [isCanChat, showBackupPrvKey, showSetup]);

   const { isOpen, onOpen, onClose } = useDisclosure();

   const isDisabled = useMemo(() => {
      return disabled; // || Object.keys(supportModelObj || {}).length <= 1;
   }, [disabled]);

   if (!availableModelAgents || availableModelAgents.length === 0) {
      return null;
   }

   const handleLoadMore = () => {
      setPage(page + 1);
   }

   const [setupEnvAgent, setSetupEnvAgent] = useState<IAgentToken | null>(null);
   const [agentDetail, setAgentDetail] = useState<IAgentToken | null>(null);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();

   const isInstalled = useMemo(() => {
      return agentDetail ? agentStates[agentDetail.id]?.isInstalled : false;
   }, [agentStates, agentDetail]);

   const isUnInstalling = useMemo(() => {
      return agentDetail ? agentStates[agentDetail.id]?.isUnInstalling : false;
   }, [agentStates, agentDetail]);

   const allowStopAgent = useMemo(() => {
      return agentDetail ? !SYSTEM_AGENTS.some(id => compareString(id, agentDetail?.id)) : false;
   }, [agentDetail]);

   return (
      <>
         <Box className={cs(s.container, className)}>
            <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose}>
               <PopoverTrigger>
                  <Flex
                     className={s.dropboxButton}
                     pl="20px"
                     onClick={isDisabled ? undefined : onOpen}
                     cursor={isDisabled ? 'not-allowed' : 'pointer'}
                  >
                     <Box flex={1}>
                        <Text className={s.title} color={color}>
                           {activeModel?.display_name || activeModel?.agent_name}
                        </Text>
                        {showDescription && (
                           <Text className={s.amount} color={color}>
                              {activeModel?.personality}
                           </Text>
                        )}
                     </Box>
                     <Image src={`icons/ic-angle-down${color === 'white' ? '-white' : ''}.svg`} />
                  </Flex>
               </PopoverTrigger>
               <PopoverContent className={s.poperContainer}>
                  {/* Show installed and initial available agents */}
                  {models.map((t, _i) => (
                     <>
                        <ItemToken
                           key={t.id}
                           agent={t}
                           onSelect={async (agent: IAgentToken) => {
                              await startAgent(agent);
                           }}
                           onClose={onClose}
                           isSelected={activeModel?.id === t.id}
                           onDelete={(agent: IAgentToken) => {
                              setDeleteAgent(agent);
                           }}
                           onShowSetupEnv={(agent) => setSetupEnvAgent(agent)}
                           onShowAgentDetail={(agent) => setAgentDetail(agent)}
                        />
                        <Divider color={'#E2E4E8'} my={'0px'} />
                     </>
                  ))}
                  
                  {/* Show additional available agents when load more is clicked */}
                  {additionalModels.map((t, _i) => (
                     <>
                        <ItemToken
                           key={t.id}
                           agent={t}
                           onSelect={async (agent: IAgentToken) => {
                              await startAgent(agent);
                           }}
                           onClose={onClose}
                           isSelected={activeModel?.id === t.id}
                           onDelete={(agent: IAgentToken) => {
                              setDeleteAgent(agent);
                           }}
                           onShowSetupEnv={(agent) => setSetupEnvAgent(agent)}
                           onShowAgentDetail={(agent) => setAgentDetail(agent)}
                        />
                        <Divider color={'#E2E4E8'} my={'0px'} />
                     </>
                  ))}
                  
                  {/* Show load more button if there are more agents to load */}
                  {showLoadMore && (
                     <AddMoreRow onClose={onClose} onLoadMore={handleLoadMore} />
                  )}
               </PopoverContent>
            </Popover>
         </Box>

         {setupEnvAgent && (
            <BaseModal
               isShow={!!setupEnvAgent}
               onHide={() => setSetupEnvAgent(null)}
               size="small"
               title="Setup Environment"
            >
               <SetupEnvModel
                  environments={setupEnvAgent?.env_example}
                  agent={setupEnvAgent}
                  onSubmit={async () => {
                     setSetupEnvAgent(null);
                     installAgent(setupEnvAgent);
                  }}
               />
            </BaseModal>
         )}

         {agentDetail && (
            <BaseModal
               isShow={!!agentDetail}
               onHide={() => setAgentDetail(null)}
               size="extra"
               className={s.agentDetailModalContent}
            >
               <Box w='100%'>
                  {allowStopAgent && isInstalled && (
                     <Flex justifyContent={'flex-end'}>
                        <Menu>
                           <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0197 5.5C11.1907 5.5 10.5146 4.829 10.5146 4C10.5146 3.171 11.1816 2.5 12.0096 2.5H12.0197C12.8487 2.5 13.5197 3.171 13.5197 4C13.5197 4.829 12.8487 5.5 12.0197 5.5ZM13.5197 12C13.5197 11.171 12.8487 10.5 12.0197 10.5H12.0096C11.1816 10.5 10.5146 11.171 10.5146 12C10.5146 12.829 11.1907 13.5 12.0197 13.5C12.8487 13.5 13.5197 12.829 13.5197 12ZM13.5197 20C13.5197 19.171 12.8487 18.5 12.0197 18.5H12.0096C11.1816 18.5 10.5146 19.171 10.5146 20C10.5146 20.829 11.1907 21.5 12.0197 21.5C12.8487 21.5 13.5197 20.829 13.5197 20Z" fill="#686A6C" />
                                 </svg>
                              }
                              variant="ghost"
                           />
                           <MenuList>
                              <MenuItem>
                                 <Button
                                    onClick={() => setDeleteAgent(agentDetail)}
                                    isLoading={isUnInstalling}
                                    isDisabled={isUnInstalling}
                                    loadingText={'Deleting...'}
                                    background={'transparent'}
                                    w={'100%'}
                                    _hover={{
                                       background: 'transparent',
                                    }}
                                    justifyContent={'flex-start'}
                                 >
                                    Delete
                                 </Button>
                              </MenuItem>
                           </MenuList>
                        </Menu>
                     </Flex>
                  )}
                  <AgentDetailProvider 
                     agent={agentDetail}
                     agentStates={agentStates}
                  >
                     <AgentDetail />
                  </AgentDetailProvider>
               </Box>
            </BaseModal>
         )}

         <DeleteAgentModal
            agentName={deleteAgent?.display_name || deleteAgent?.agent_name}
            isOpen={!!deleteAgent}
            onClose={() => setDeleteAgent(undefined)}
            onDelete={() => {
               if (deleteAgent) {
                  unInstallAgent(deleteAgent);
                  setDeleteAgent(undefined);
               }
            }}
         />
      </>
   );
};

export default SelectModel;
