/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
   createContext,
   PropsWithChildren,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { v4 } from 'uuid';
import { INIT_WELCOME_MESSAGE } from './constants';
import { ChatCompletionPayload, IChatMessage } from "../../../../services/api/agent/types.ts";
import AgentAPI from "../../../../services/api/agent";
import { AgentContext } from "@pages/home/provider";
import chatAgentDatabase, { PersistedMessageType } from "../../../../database/chatAgentDatabase.ts";
import { AgentType } from "@pages/home/list-agent";
import CAgentTokenAPI from "@services/api/agents-token";

type IChatAgentProviderContext = {
  isStopReceiving?: boolean;
  messages: IChatMessage[];
  isLoadingMessages: boolean;
  setIsLoadingMessages: (value: boolean) => void;
  publishEvent: (message: string, attachments?: IChatMessage['attachments']) => void;
  scrollableRef: React.RefObject<ScrollableFeed>;
   scrollRef: any;
  loading: boolean;
  info?: {
    name: string;
    personality: string;
  };

  chatInputRef: any;
  isFocusChatInput: boolean;
  setIsFocusChatInput: (_: boolean) => void;
  isAllowChat: boolean;
};

const ChatAgentProviderContext = createContext<IChatAgentProviderContext>({
   messages: [],
   isLoadingMessages: true,
   setIsLoadingMessages: () => {},
   publishEvent: () => {},
   scrollableRef: { current: null },
   loading: false,
   info: undefined,

   chatInputRef: undefined,
   isFocusChatInput: false,
   setIsFocusChatInput: () => {},
   isAllowChat: false,
   scrollRef: undefined,
});

export const ChatAgentProvider = ({ children }: PropsWithChildren) => {
   const scrollableRef = useRef<ScrollableFeed | null>(null);
   const scrollRef = useRef<any>(null);

   const [loading, setIsLoading] = useState(false);
   const [info, setInfo] = useState<
    { name: string; personality: string } | undefined
  >(undefined);

   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
   const [messages, setMessages] = useState<IChatMessage[]>([]);

   const chatInputRef = React.useRef<any>();
   const [isFocusChatInput, setIsFocusChatInput] = React.useState(false);

   const { selectedAgent, agentWallet } = useContext(AgentContext);

   const id = selectedAgent?.id;
   const threadId = `${selectedAgent?.id}-${selectedAgent?.agent_name}`;

   const cPumpAPI = new CAgentTokenAPI();

   console.log('stephen: messages', messages);
   console.log('====')

   const isAllowChat = useMemo(() => {
      return true;
      // if(selectedAgent) {
      //    return Number(selectedAgent?.wallet_balance) > 0;
      // }
      //
      // return false;
   }, []);

   useEffect(() => {
      if (threadId) {
         setMessages([]);
         chatAgentDatabase.loadChatItems(threadId).then((items) => {
            if (items?.length === 0) {
               publishEvent(INIT_WELCOME_MESSAGE);
            } else {
               const filterMessages = items
                  ?.filter((item) => item.status !== 'failed')
                  // .filter((item) => item.status !== 'waiting')
                  .filter((item) => !!item.msg)
                  .map((item) => ({
                     ...item,
                     status: 'received',
                  }));
               setMessages(filterMessages as any);

               if (filterMessages) {
                  const lastMessage = filterMessages[filterMessages.length - 1];

                  if (lastMessage.status === 'waiting') {
                     sendMessageToServer(lastMessage.id, Number(id), lastMessage.msg, lastMessage.attachments);
                  }
               }
            }
         });
      }
   }, [threadId]);

   const lastMessage = messages[messages.length - 1];
   const isStopReceiving
    = lastMessage?.status === 'receiving' || lastMessage?.status === 'waiting';

   const publishEvent = async (message: string, attachments?: IChatMessage['attachments']) => {

      if (!message || lastMessage?.status === 'waiting' || isStopReceiving) {
         return;
      }
      if (message) {
         setIsLoading(true);

         const userMessageId = v4();

         const newMessage: IChatMessage = {
            id: userMessageId,
            senderId: agentWallet?.address || '',
            msg: message,
            status: 'sent',
            type: 'human',
            is_reply: false,
            name: 'You',
            attachments,
            createdAt: new Date().toISOString(),
         };

         setMessages((prev) => [...prev, newMessage]);

         chatAgentDatabase.addChatItem({
            ...newMessage,
            threadId: threadId,
         });

         const messageId = v4();
         const responseMsg: IChatMessage = {
            id: messageId,
            senderId: id?.toString() || '',
            msg: '',
            status: 'waiting',
            type: 'ai',
            replyTo: userMessageId,
            is_reply: true,
            name: selectedAgent?.agent_name || 'Agent',
            createdAt: new Date().toISOString(),
         };

         setMessages((prev) => [...prev, responseMsg]);

         chatAgentDatabase.addChatItem({
            ...responseMsg,
            threadId: threadId,
         });

         await sendMessageToServer(messageId, Number(id), message, attachments);

         cPumpAPI.saveAgentPromptCount(Number(id));
      }
   };

   const sendMessageToServer = async (
      messageId: string,
      agentId: number,
      sendTxt: string,
      attachments?: IChatMessage['attachments']
   ) => {
      try {
         let filteredMessages = messages
            .filter((item) => item.status !== 'failed')
            .filter((item) => !!item.msg);

         // remove pair of welcome message
         if (filteredMessages.find((item) => item.msg === INIT_WELCOME_MESSAGE)) {
            filteredMessages = filteredMessages.slice(2);
         }

         // double check if the welcome message is still there
         filteredMessages = filteredMessages.filter(
            (item) => item.msg !== INIT_WELCOME_MESSAGE,
         );

         // take last 4 pair messages
         filteredMessages = filteredMessages.slice(-4);


         const historyMessages = [
            {
                role: 'system',
                content: selectedAgent?.personality || '',
            },
            ...filteredMessages.reduce((acc: any[], item, index) => {
                if (index > 0 && 
                    filteredMessages[index - 1].type !== 'ai' && 
                    item.type !== 'ai') {
                    acc.push({
                        role: 'assistant',
                        content: ''
                    });
                }
        
                // Handle messages with attachments
                if (item.attachments && item.attachments.length > 0) {
                  const messageContent: any[] = [];
                    
                    // Add text content if exists
                    if (item.msg) {
                     messageContent.push({
                            type: 'text',
                            text: item.msg
                        });
                    }
        
                    // Add image attachments
                    item.attachments.forEach(attachment => {
                        if (attachment.type.startsWith('image/')) {
                           messageContent.push({
                                type: 'image_url',
                                image_url: {
                                    url: attachment.url,
                                    detail: ''
                                }
                            });
                        }
                    });
        
                    acc.push({
                        role: item.type === 'ai' ? 'assistant' : 'user',
                        content: messageContent
                    });
                } else {
                    // Regular text message without attachments
                    acc.push({
                        role: item.type === 'ai' ? 'assistant' : 'user',
                        content: item.msg
                    });
                }
        
                return acc;
            }, []),
            // Handle the final message with potential attachments
            {
                role: 'user',
                content: sendTxt && attachments?.length 
                    ? [
                        { type: 'text', text: sendTxt },
                        ...attachments.map(attachment => ({
                            type: 'image_url',
                            image_url: {
                                url: attachment.url,
                                detail: ''
                            }
                        }))
                      ]
                    : sendTxt
            },
        ];

         const params: ChatCompletionPayload = {
            messages: historyMessages,
            agentId: agentId,
            model_name: selectedAgent?.agent_base_model,
         };
         if (selectedAgent?.kb_id) {
            const kbId = `${selectedAgent?.kb_id}`.replace('kb-', '');
            params['kb_id'] = `kb-${kbId}`;
         }

         if ([AgentType.Infra, AgentType.CustomPrompt].includes(selectedAgent?.agent_type as any)) {
            const res: string = await AgentAPI.chatAgentUtility({ agent: selectedAgent!, prvKey: agentWallet?.privateKey, messages: [ { role: 'user', content: sendTxt }] });
            console.log('res>>>>>', res);
            
            updateMessage(messageId, {
               msg: res,
               status: 'received',
            });
         } else if (selectedAgent?.agent_type === AgentType.Model) {
            let isGeneratedDone = false;
            await AgentAPI.chatAgentModelStreamCompletions({
               payload: {
                  ...params,
               },
               streamHandlers: {
                  onStream: (content: string, chunk: string, options) => {
                     const text = content;

                     if (isGeneratedDone) {
                        setIsLoading(false);
                        updateMessage(messageId, {
                           msg: text,
                           status: 'pre-done',
                           queryMessageState: options?.message,
                           onchain_data: options.onchain_data,
                        });
                     } else {
                        isGeneratedDone = !!options?.isGeneratedDone;
                        updateMessage(messageId, {
                           msg: text,
                           status: text.trim().length ? 'receiving' : 'waiting',
                           queryMessageState: options?.message,
                           onchain_data: options.onchain_data,
                        });
                     }
                  },
                  onFinish: (content: string, options) => {
                     updateMessage(messageId, {
                        status: 'received',
                        queryMessageState: options?.message,
                        onchain_data: options.onchain_data,
                     });
                  },
                  onFail: (err: any) => {
                     // updateMessage(messageId, {
                     //   status: 'failed',
                     //   msg: (err as any)?.message || 'Something went wrong!',
                     // });
                  },
               },
            });
         } else {
            let isGeneratedDone = false;
            await AgentAPI.chatStreamCompletions({
               payload: {
                  ...params,
               },
               streamHandlers: {
                  onStream: (content: string, chunk: string, options) => {
                     const text = content;

                     if (isGeneratedDone) {
                        setIsLoading(false);
                        updateMessage(messageId, {
                           msg: text,
                           status: 'pre-done',
                           queryMessageState: options?.message,
                           onchain_data: options.onchain_data,
                        });
                     } else {
                        isGeneratedDone = !!options?.isGeneratedDone;
                        updateMessage(messageId, {
                           msg: text,
                           status: text.trim().length ? 'receiving' : 'waiting',
                           queryMessageState: options?.message,
                           onchain_data: options.onchain_data,
                        });
                     }
                  },
                  onFinish: (content: string, options) => {
                     updateMessage(messageId, {
                        status: 'received',
                        queryMessageState: options?.message,
                        onchain_data: options.onchain_data,
                     });
                  },
                  onFail: (err: any) => {
                     // updateMessage(messageId, {
                     //   status: 'failed',
                     //   msg: (err as any)?.message || 'Something went wrong!',
                     // });
                  },
               },
            });
         }
      } catch (e) {
         updateMessage(messageId, {
            status: 'failed',
            msg: (e as any).message || 'Something went wrong!',
         });
      } finally {
         setIsLoading(false);
         scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
   };

   const updateMessage = (id: string, data: Partial<IChatMessage>) => {
      try {
         setMessages((prev) => {
            const matchedMessageIndex = prev.findLastIndex((i) => i.id === id);
            if (matchedMessageIndex !== -1) {
               if (data.status === 'failed') {
                  if (prev[matchedMessageIndex].msg) {
                     prev[matchedMessageIndex].status = 'received';
                  } else {
                     prev[matchedMessageIndex].status = 'failed';
                  }
                  return [...prev];
               } else if (
                  prev[matchedMessageIndex].status === 'waiting'
                  || prev[matchedMessageIndex].status === 'receiving'
                  || prev[matchedMessageIndex].status === 'pre-done'
               ) {
                  const updatedMessage = {
                     ...prev[matchedMessageIndex],
                     ...data,
                     updatedAt: new Date().toISOString(),
                     queryMessageState:
                        data?.queryMessageState
                        || prev[matchedMessageIndex]?.queryMessageState,
                     tx_hash:
                        data?.onchain_data?.propose_tx
                        || prev[matchedMessageIndex]?.tx_hash,
                  };
                  prev[matchedMessageIndex] = updatedMessage;

                  chatAgentDatabase.updateChatItem(
                     updatedMessage as PersistedMessageType,
                  );
               }

               const replyToMessageId = prev[matchedMessageIndex].replyTo;
               const userMessageIndex = prev.findLastIndex(
                  (i) => i.id === replyToMessageId,
               );

               if (userMessageIndex !== -1) {
                  const updatedUserMessage = {
                     ...prev[userMessageIndex],
                     tx_hash:
                        data?.onchain_data?.infer_tx || prev[userMessageIndex]?.tx_hash,
                  };

                  prev[userMessageIndex] = updatedUserMessage;

                  chatAgentDatabase.updateChatItem(
                     updatedUserMessage as PersistedMessageType,
                  );
               }

               return [...prev];
            }
            return prev;
         });
      } catch (err) {

      } finally {
         setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
         }, 200);
      }
   };

   const onRetryErrorMessage = useCallback(
      async (id: string) => {
         if (isStopReceiving) return;

         const targetMessage = messages.find((i) => i.id === id);
         if (targetMessage) {
            const userMessageId = v4();
            const newMessage: IChatMessage = {
               ...targetMessage,
               id: userMessageId,
               createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, newMessage]);

            chatAgentDatabase.addChatItem({
               ...newMessage,
               threadId: threadId,
            });

            const messageId = v4();
            const responseMsg: IChatMessage = {
               id: messageId,
               senderId: id,
               msg: '',
               status: 'waiting',
               type: 'ai',
               replyTo: userMessageId,
               name: selectedAgent?.agent_name || 'Agent',
               is_reply: true,
               createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, responseMsg]);

            chatAgentDatabase.addChatItem({
               ...responseMsg,
               threadId: threadId,
            });

            await sendMessageToServer(messageId, Number(id), targetMessage?.msg, targetMessage.attachments);
         }
      },
      [messages, id, isStopReceiving],
   );

   const value = useMemo(() => {
      return {
         messages,
         isLoadingMessages,
         setIsLoadingMessages,
         publishEvent,
         scrollableRef,
         loading,
         info,
         setInfo,
         chatInputRef,
         isFocusChatInput,
         setIsFocusChatInput,
         onRetryErrorMessage,
         isStopReceiving,
         isAllowChat,
         scrollRef,
      };
   }, [
      messages,
      isLoadingMessages,
      setIsLoadingMessages,
      publishEvent,
      scrollableRef,
      loading,
      info,
      setInfo,
      chatInputRef,
      isFocusChatInput,
      setIsFocusChatInput,
      onRetryErrorMessage,
      isStopReceiving,
      isAllowChat,
      scrollRef
   ]);

   return (
      <ChatAgentProviderContext.Provider value={value}>
         {children}
      </ChatAgentProviderContext.Provider>
   );
};

export const useChatAgentProvider = (): any => {
   const values = useContext(ChatAgentProviderContext);
   return values;
};
