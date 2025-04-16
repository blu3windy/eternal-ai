import { Button, Flex, Grid, Image, Text } from '@chakra-ui/react';
import CustomMarkdown from "@components/CustomMarkdown";
import { DefaultAvatar } from "@components/DefaultAvatar";
import { INIT_WELCOME_MESSAGE } from '@pages/home/chat-agent/ChatAgent/constants';
import { AgentStatus, AgentStatusLabel, AgentType } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { MonitorContext } from '@providers/Monitor/MonitorContext';
import { ContainerData } from '@providers/Monitor/interface';
import { IChatMessage } from '@services/api/agent/types';
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import localStorageService from '@storage/LocalStorageService';
import { formatCurrency } from "@utils/format.ts";
import { compareString } from '@utils/string';
import cs from "clsx";
import { motion } from 'framer-motion';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import chatAgentDatabase from "../../../../database/chatAgentDatabase";
import LastChatMessage from './LastChatMessage';
import s from './styles.module.scss';
import useAgentState from '@pages/home/provider/useAgentState';
interface IProps {
   token: IAgentToken;
   addActiveAgent?: (agent: IAgentToken) => void;
   isLatest?: boolean;
}

const AgentItem = ({ token, addActiveAgent, isLatest }: IProps) => {
   const {
      selectedAgent,
      stopAgent,
      unInstallAgent,
      installAgent,
      setSelectedAgent,
      agentStates,
      handleUpdateCode
   } = useContext(AgentContext);
   const { containers } = useContext(MonitorContext);
   const { isSearchMode, setSelectedAgent: _setSelectedAgent, setShowSearchDetail }
     = useAgentState();

   const threadId = `${token?.id}-${token?.agent_name}`;
   const [messages, setMessages] = useState<IChatMessage[]>([]);
   const [sessionId, setSessionId] = useState<string | undefined>(undefined);
   const refEmptyMessage = useRef(true);


   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);

   const isRunning = useMemo(() => {
      if (token) {
         const matchingContainer = containers?.find((container: ContainerData) => compareString(container.agent?.agent_name, token?.agent_name));
         if (matchingContainer?.agent && [AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI].includes(matchingContainer?.agent?.agent_type)) {
            return matchingContainer ? matchingContainer?.state === 'running' || false : agentStates[token.id]?.isRunning;
         } else {
            return matchingContainer?.state === 'running' || agentStates[token.id]?.isRunning || false;
         }
      }

      return false;
   }, [token, agentStates, containers]);

   const isUpdating = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isUpdating || false;
      }

      return false;
   }, [token, agentStates]);

   const isInstalled = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isInstalled || false;
      }

      return false;
   }, [token, agentStates]);

   const runStatus = useMemo(() => {
      if (token) {
         return AgentStatusLabel[token.run_status as AgentStatus];
      }

      return '';
   }, [token]);

   const agentTypeAdditional = useMemo(() => {
      if (token) {
         if (token.agent_type === AgentType.ModelOnline) {
            return 'Online';
         }
      }

      return '';
   }, [token]);

   useEffect(() => {
      setHaveNewVersionCode(false);
      if (token || !isRunning) {
         checkVersionCode();
      }
   }, [token, isRunning, isInstalled]);

   const checkVersionCode = async () => {
      if (
         token?.agent_type
         && [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(token.agent_type)
      ) {
         const codeVersion = token?.code_version ? Number(token?.code_version) : 0;
         const values = await localStorageService.getItem(token.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : -1;
         if (oldCodeVersion > 0 && codeVersion >= 1 && codeVersion !== oldCodeVersion) {
            setHaveNewVersionCode(true);
         } else {
            setHaveNewVersionCode(false);
         }
      }
   };

   const description = useMemo(() => {
      if ([AgentType.Infra, AgentType.Model, AgentType.CustomPrompt].includes(token.agent_type)) {
         return token?.short_description || token?.personality;
      } else {
         return token?.short_description || token?.token_desc || token?.twitter_info?.description;
      }
   }, [token]);

   const avatarUrl
      = token?.thumbnail
      || token?.token_image_url
      || token?.twitter_info?.twitter_avatar;

   const initialLoadChatItems = useCallback(async () => {
      const threadItems = await chatAgentDatabase.getSessions(threadId);

      if (threadItems?.length === 0) {
         const sessionId = await chatAgentDatabase.createSession(threadId);
         setSessionId(sessionId);
         // await chatAgentDatabase.migrateMessages(threadId);
      } else {
         const lastSessionActive = await chatAgentDatabase.getLastSessionActive(threadId);

         setSessionId(lastSessionActive?.id);
      }
   }, [threadId]);

   useEffect(() => {
      if (sessionId) {
         (async () => {
            setMessages([]);
            refEmptyMessage.current = true;
            const items = await chatAgentDatabase.loadChatItems(sessionId);
            if (items.length > 0) {
               refEmptyMessage.current = false;
            }
            const filterMessages = items
               .filter((item) => item.createdAt)
               .map((item) => {
                  return item;
               });

            setMessages(filterMessages as any);
         })();
      }
   }, [sessionId]);

   useEffect(() => {
      if (threadId) {
         initialLoadChatItems();
      }
   }, [threadId]);

   useEffect(() => {
      if (!sessionId || !isLatest) return;
      
      if (!isRunning) return;

      const pollInterval = setInterval(async () => {
         try {
            const latestMessages = await chatAgentDatabase.loadChatItems(sessionId);
            
            if (latestMessages.length > messages.length) {
               setMessages(latestMessages);
            } else if (latestMessages.length === messages.length) {
               const hasUpdates = latestMessages.some((latestMsg, index) => {
                  const currentMsg = messages[index];
                  return (
                     latestMsg.status !== currentMsg.status
                     || latestMsg.msg !== currentMsg.msg
                     || latestMsg.updatedAt !== currentMsg.updatedAt
                  );
               });
               
               if (hasUpdates) {
                  setMessages(latestMessages);
               }
            }
         } catch (error) {
            console.error('Error polling for message updates:', error);
         }
      }, 10000);

      return () => clearInterval(pollInterval);
   }, [sessionId, messages, isLatest, isRunning]);

   const lastMessage = messages[messages.length - 1];
   const questionMessage = messages[messages.length - 2];
   const isInitialMessage = questionMessage?.msg === INIT_WELCOME_MESSAGE;

   const showLastMessage = useMemo(() => {
      return (lastMessage && ['received', 'receiving', 'sync-receiving'].includes(lastMessage?.status)) || (questionMessage && !isInitialMessage);
   }, [lastMessage, questionMessage, isInitialMessage]);

   const handleGoToChat = (e: any, token_address?: any) => {
      
      if (token_address) {
         e?.preventDefault();
         e?.stopPropagation();
         if (isSearchMode) {
            _setSelectedAgent(token);
            setShowSearchDetail(true);
         } else {
            setSelectedAgent(token);
            addActiveAgent && addActiveAgent(token);
         }
      }
   };

   const iconSize = '60px';

   if (!token.is_public && token.agent_name === 'Proxy') {
      return <></>;
   }

   return (
      <Flex
         as={motion.div}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: "0.5s" }}
         key={token.id}
         className={cs(s.container, token?.id === selectedAgent?.id ? s.isSelected : '')}
         flexDirection="column"
         position={'relative'}
         onClick={(e) =>
            handleGoToChat(e, token?.id || token?.token_address || token?.agent_id)
         }
         w={'100%'}
      >
         <Grid
            className={s.content}
            templateColumns={`${iconSize} 1fr`}
            gap="12px"
            w={'100%'}
         >
            <Flex position={"relative"}>
               {avatarUrl ? (
                  <Image
                     w={iconSize}
                     objectFit={'cover'}
                     src={avatarUrl}
                     maxHeight={iconSize}
                     maxWidth={iconSize}
                     borderRadius={'50%'}
                  />
               ) : (
                  <DefaultAvatar
                     width={iconSize}
                     height={iconSize}
                     name={token?.display_name || token?.agent_name}
                     fontSize={14}
                  />
               )}
               {/*          {
            isUtilityAgent && (
              <Image src={'icons/ic-utility-agent.svg'} w={"16px"} h={"16px"} position={"absolute"} top={"24px"} right={"0px"}/>
            )
          }*/}
            </Flex>
            <Flex flexDirection="column" w={'100%'} gap={"8px"}>
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"}>
                  <Flex gap={"4px"} direction={'column'}>
                     <Text className={s.nameText}>
                        {token?.display_name || token?.agent_name}{' '}
                     </Text>
                     {token?.author && <Text fontSize={"12px"} color={"#000"} opacity={0.5}><Text as={'span'} fontWeight={400}>by</Text> <Text as='span' fontWeight={600}>{token?.author}</Text></Text>}
                  </Flex>
                  <Flex>
                     <Flex gap={"8px"}>
                        <Flex gap="4px" alignItems={'center'}>
                           <Image src="icons/ic-mc.svg" w="15px" h="15px" />
                           <Text as={'span'} color="#657786" fontSize="12px" fontWeight="400">
                              {Number(token?.meme?.market_cap) > 0
                                 ? `$${formatCurrency(
                                    token?.meme?.market_cap,
                                    0,
                                    3,
                                    'BTC',
                                    false,
                                    true,
                                 )}`
                                 : '$0'}
                           </Text>
                        </Flex>
                        <Flex gap="4px" alignItems={'center'}>
                           <Image src="icons/ic-downloaded.svg" w="15px" h="15px" />
                           <Text color="#657786" fontSize="12px" fontWeight="400">{formatCurrency(token.installed_count, 0, 0)}</Text>
                        </Flex>
                        {/* {!!token?.rating && (
                           <Flex gap="4px" alignItems="center">
                              <Image src="icons/ic-yellow-star.svg" w="15px" h="15px" marginTop="-2px" />
                              <Text color="#657786" fontSize="12px" fontWeight="400">{formatCurrency(token.rating, 0, 0)}</Text>
                           </Flex>
                        )} */}
                     </Flex>
                  </Flex>
               </Flex>
               {
                  isLatest ? (
                     <>
                        {
                           showLastMessage && (
                              <LastChatMessage
                                 messages={[]}
                                 updateMessage={() => { }}
                                 key={lastMessage.id}
                                 message={['received', 'receiving', 'sync-receiving'].includes(lastMessage?.status) ? lastMessage : questionMessage}
                                 onRetryErrorMessage={() => { }}
                                 isSending={false}
                                 initialMessage={false}
                              />
                           )
                        }
                     </>
                  ) : (
                     <>
                        {
                           description && (
                              <div className={cs(s.descriptionText, "markdown")}>
                                 <CustomMarkdown
                                    content={description}
                                 />
                              </div>
                           )
                        }
                     </>
                  )
               }
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"} mt={"4px"}>
                  <Flex gap={"8px"}>
                     {token?.run_status && <Text className={token?.run_status === AgentStatus.Local ? s.onChainTag : s.agentTypeTag}>{runStatus}</Text>}
                     {/* {agentTypeAdditional && <Text className={s.agentTypeTag}>{agentTypeAdditional}</Text>} */}
                     {/* <Image src="icons/ic-creator.svg" w="14px" h="14px" />
                     <Text fontSize={"12px"} fontWeight={"500"} color={"#000"} opacity={0.7}>
                        {formatLongAddress(token?.creator)}
                     </Text> */}
                  </Flex>
                  {hasNewVersionCode && isInstalled && (
                     <Button
                        className={s.btnUpdate}
                        onClick={(e) => {
                           e?.preventDefault();
                           e?.stopPropagation();
                           handleUpdateCode(token);
                        }}
                        isLoading={isUpdating}
                        isDisabled={isUpdating}
                        loadingText={'Updating...'}
                     >
                        Update
                     </Button>
                  )}
               </Flex>
            </Flex>
         </Grid >
      </Flex >
   );
};

export default AgentItem;
