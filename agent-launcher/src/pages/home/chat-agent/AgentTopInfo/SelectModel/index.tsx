import {
   Box,
   Circle,
   Divider,
   Flex,
   Image,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Text,
   useDisclosure
} from '@chakra-ui/react';
import Loading from '@components/Loading';
import { AgentType, CategoryOption } from '@pages/home/list-agent/constants';
import { AgentContext } from "@pages/home/provider";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import cs from 'classnames';
import { useContext, useEffect, useMemo, useState } from 'react';
import CAgentTokenAPI from "../../../../../services/api/agents-token";
import s from './styles.module.scss';
import storageModel from '@storage/StorageModel';

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
   models,
   isSelected,
}: {
  onSelect: any;
  onDelete: any;
  onClose: any;
  agent: IAgentToken,
  models: any;
  isSelected: boolean;
}) => {
   const { agentStates } = useContext(AgentContext);

   const isStarting = useMemo(() => {
      return agentStates[agent.id]?.isStarting;
   }, [agentStates, agent]);

   const avatarUrl
      = agent?.thumbnail
      || agent?.token_image_url
      || agent?.twitter_info?.twitter_avatar;

   const modelSize = useMemo(() => {
      return agent?.sizeGb || 0;
   }, [agent]);

   const handleRemoveAgent = e => {
      e?.preventDefault();
      e?.stopPropagation();

      onDelete(agent);
      onClose();
   }

   return (
      <Flex
         className={cs(
            s.itemToken,
            // compareString(model.name, 'chainId') && s.active,
            // isDisabled && s.disabled,
         )}
         onClick={() => {
            onSelect(agent);
            onClose();
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
                     {agent?.agent_name}
                  </Text>
                  <Flex gap={"4px"} alignItems={"center"}>
                     <Text className={s.itemAmount}>
                        {
                           agent?.agent_type === AgentType.ModelOnline ? "Online" : `${modelSize} GB`
                        }
                     </Text>
                     {
                        agent.agent_type !== AgentType.ModelOnline && (
                           <>
                              <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path opacity="0.7" d="M2.9375 5.13068C2.53646 5.13068 2.17022 5.03291 1.83878 4.83736C1.50734 4.63849 1.24219 4.37334 1.04332 4.0419C0.847775 3.71046 0.75 3.34422 0.75 2.94318C0.75 2.53883 0.847775 2.17259 1.04332 1.84446C1.24219 1.51302 1.50734 1.24953 1.83878 1.05398C2.17022 0.855113 2.53646 0.755682 2.9375 0.755682C3.34186 0.755682 3.7081 0.855113 4.03622 1.05398C4.36766 1.24953 4.63116 1.51302 4.8267 1.84446C5.02557 2.17259 5.125 2.53883 5.125 2.94318C5.125 3.34422 5.02557 3.71046 4.8267 4.0419C4.63116 4.37334 4.36766 4.63849 4.03622 4.83736C3.7081 5.03291 3.34186 5.13068 2.9375 5.13068Z" fill="black"/>
                              </svg>
                              <Text className={s.itemAmount} textDecoration={"underline"} onClick={handleRemoveAgent}>
                                 Remove
                              </Text>
                           </>
                        )
                     }
                  </Flex>
               </Flex>
            </Flex>
            {
               isSelected ? (
                  <Circle size={'24px'} className={s.itemDot}>
                     <Circle size={'16px'} />
                  </Circle>
               ) : isStarting ? (
                  <Loading />
               ) : (
                  <Box />
               )
            }
         </Flex>
      </Flex>
   );
};

const AddMoreRow = ({ onClose }: { onClose: () => void }) => {
   const {  setIsSearchMode, setCategory } = useContext(AgentContext);

   return (
      <Flex
         onClick={() => {
            setCategory(CategoryOption.Model);
            setIsSearchMode(true);
            onClose();
         }}
         alignItems="center"
         gap="12px"
         cursor="pointer"
         p="16px 24px"
      >
         <Image src="icons/ic-plus.svg" w="20px" h="20px" />
         <Text fontSize="16px" fontWeight="400">
        Add more
         </Text>
      </Flex>
   );
};

const SelectModel = ({
   disabled,
   className,
   showDescription = true,
}: Props) => {
   const { installedModelAgents, startAgent, unInstallAgent } = useContext(AgentContext);
   const {
      selectedAgent,
      isCanChat,
      agentWallet,
      isBackupedPrvKey,
      requireInstall,
      isRunning,
   } = useContext(AgentContext);

   const [activeModel, setActiveModel] = useState<any>(null);

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

   const [models, setModels] = useState<any>();

   const { isOpen, onOpen, onClose } = useDisclosure();

   const cPumpAPI = new CAgentTokenAPI();

   const fetchModelDescription = async () => {
      try {
         const rs = await cPumpAPI.getModelDescription();
         setModels(rs);
      } catch (error) {}
   };

   useEffect(() => {
      fetchModelDescription();
   }, []);

   const isDisabled = useMemo(() => {
      return disabled; // || Object.keys(supportModelObj || {}).length <= 1;
   }, [disabled]);

   if (!installedModelAgents || installedModelAgents.length === 0) {
      return null;
   }

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
                           {activeModel?.agent_name}
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
               <PopoverContent
                  width={'100%'}
                  className={s.poperContainer}
                  border={'1px solid #E5E7EB'}
                  boxShadow={'0px 0px 24px -6px #0000001F'}
                  borderRadius={'16px'}
                  background={'#fff'}
                  minW={'600px'}
               >
                  {installedModelAgents.map((t, i) => (
                     <>
                        <ItemToken
                           key={t.id}
                           agent={t}
                           onSelect={(agent: IAgentToken) => {
                              startAgent(agent);
                           }}
                           onClose={onClose}
                           models={models}
                           isSelected={activeModel?.id === t.id}
                           onDelete={(agent: IAgentToken) => {
                              unInstallAgent(agent);
                           }}
                        />
                        <Divider color={'#E2E4E8'} my={'0px'} />
                     </>
                  ))}
                  
                  <AddMoreRow onClose={onClose} />
               </PopoverContent>
            </Popover>
         </Box>
      </>
   );
};

export default SelectModel;
