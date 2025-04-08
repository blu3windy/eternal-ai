/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AgentType } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext.tsx";
import CAgentTokenAPI from "@services/api/agents-token";
import { addOrUpdateTaskItem, removeTaskItem } from "@stores/states/agent-chat/reducer.ts";
import { TaskItem } from "@stores/states/agent-chat/type.ts";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { v4 } from "uuid";
import chatAgentDatabase, { PersistedMessageType } from "../../../../database/chatAgentDatabase.ts";
import AgentAPI from "../../../../services/api/agent";
import { ChatCompletionPayload, IChatMessage } from "../../../../services/api/agent/types.ts";
import { INIT_WELCOME_MESSAGE } from "./constants";
import HandleMessageProcessing from "./HandleMessageProcessing.tsx";

type IChatAgentProviderContext = {
   isStopReceiving?: boolean;
   messages: IChatMessage[];
   isLoadingMessages: boolean;
   setIsLoadingMessages: (value: boolean) => void;
   publishEvent: (message: string, attachments?: IChatMessage["attachments"]) => void;
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

   updateMessage: (id: string, data: Partial<IChatMessage>, isUpdateDB?: boolean) => void;
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
   updateMessage: () => {},
});

export const ChatAgentProvider = ({ children }: PropsWithChildren) => {
   const dispatch = useDispatch();
   const scrollableRef = useRef<ScrollableFeed | null>(null);
   const scrollRef = useRef<any>(null);

   const [loading, setIsLoading] = useState(false);
   const [info, setInfo] = useState<{ name: string; personality: string } | undefined>(undefined);

   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
   const [messages, setMessages] = useState<IChatMessage[]>([]);

   const chatInputRef = React.useRef<any>();
   const [isFocusChatInput, setIsFocusChatInput] = React.useState(false);

   const { selectedAgent, agentWallet } = useContext(AgentContext);

   const id = selectedAgent?.id;
   const threadId = `${selectedAgent?.id}-${selectedAgent?.agent_name}`;

   const cPumpAPI = new CAgentTokenAPI();

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
               //  publishEvent(INIT_WELCOME_MESSAGE);
            } else {
               // const filterMessages = items
               //    ?.filter((item) => item.status !== 'failed')
               //    // .filter((item) => item.status !== 'waiting')
               //    .filter((item) => !!item.msg)
               //    .map((item) => ({
               //       ...item,
               //       status: 'received',
               //    }));

               const filterMessages = items
                  .filter((item) => item.createdAt)
                  .map((item) => {
                     if (item.status === "waiting") {
                        const now = new Date();
                        const createdAt = new Date(item.createdAt || "");
                        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

                        if (diffMinutes >= 3) {
                           if ([AgentType.Infra, AgentType.CustomPrompt].includes(selectedAgent?.agent_type as any)) {
                              const updateMessage = {
                                 ...item,
                                 status: "sync-waiting",
                              };
                              return updateMessage;
                           }

                           if (item.msg) {
                              const updateMessage = {
                                 ...item,
                                 status: "received",
                              };
                              return updateMessage;
                           }

                           const updateMessage = {
                              ...item,
                              msg: "Something went wrong!",
                              status: "failed",
                           };
                           return updateMessage;
                        }
                     }
                     return item;
                  });

               setMessages(filterMessages as any);
            }
         });
      }
   }, [threadId]);

   const lastMessage = messages[messages.length - 1];
   const isStopReceiving = lastMessage?.status === "receiving" || lastMessage?.status === "waiting";

   const publishEvent = async (message: string, attachments?: IChatMessage["attachments"]) => {
      if (!message || lastMessage?.status === "waiting" || isStopReceiving) {
         return;
      }
      if (message) {
         setIsLoading(true);

         const userMessageId = v4();

         const newMessage: IChatMessage = {
            id: userMessageId,
            senderId: agentWallet?.address || "",
            msg: message,
            status: "sent",
            type: "human",
            is_reply: false,
            name: "You",
            attachments,
            createdAt: new Date().getTime()
         };

         setMessages((prev) => [...prev, newMessage]);
         setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
         }, 0);

         chatAgentDatabase.addChatItem({
            ...newMessage,
            threadId: threadId,
         });

         const messageId = v4();
         const responseMsg: IChatMessage = {
            id: messageId,
            senderId: id?.toString() || "",
            msg: "",
            status: "waiting",
            type: "ai",
            replyTo: userMessageId,
            is_reply: true,
            name: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
            createdAt: new Date().getTime()
         };

         setMessages((prev) => [...prev, responseMsg]);

         setTimeout(() => {
            chatAgentDatabase.addChatItem({
               ...responseMsg,
               threadId: threadId,
            });
         }, 10);

         await sendMessageToServer(messageId, Number(id), message, attachments);

         cPumpAPI.saveAgentPromptCount(Number(id));
      }
   };

   const updateTaskItem = (task: Omit<TaskItem, "createdAt" | "updatedAt">) => {
      dispatch(
         addOrUpdateTaskItem({
            id: threadId,
            taskItem: task,
         })
      );

      if (task.status === "done" || task.status === "failed") {
         // setTimeout(() => {
         //    dispatch(
         //       removeTaskItem({
         //          id: threadId,
         //          taskItem: task,
         //       })
         //    );
         // }, 5000);
         setTimeout(() => {
            dispatch(
               removeTaskItem({
                  id: threadId,
                  taskItem: task,
               })
            );
         }, 0);
         // dispatch(
         //    removeTaskItem({
         //       id: threadId,
         //       taskItem: task,
         //    })
         // );
      }
   };

   const sendMessageToServer = async (messageId: string, agentId: number, sendTxt: string, attachments?: IChatMessage["attachments"]) => {
      const getStreamerHandler = (messageId: string) => {
         let isGeneratedDone = false;
         return {
            onStream: (content: string, chunk: string, options) => {
               const text = content;

               if (isGeneratedDone) {
                  setIsLoading(false);
                  updateMessage(messageId, {
                     msg: text,
                     status: "pre-done",
                     queryMessageState: options?.message,
                     onchain_data: options.onchain_data,
                  });
               } else {
                  isGeneratedDone = !!options?.isGeneratedDone;
                  updateMessage(messageId, {
                     msg: text,
                     status: text.trim().length ? "receiving" : "waiting",
                     queryMessageState: options?.message,
                     onchain_data: options.onchain_data,
                  });
               }
            },
            onFinish: (content: string, options) => {
               updateMessage(messageId, {
                  status: "received",
                  queryMessageState: options?.message,
                  onchain_data: options.onchain_data,
               });
               updateTaskItem({
                  id: messageId,
                  status: "done",
               } as TaskItem);
            },
            onFail: (err: any) => {
               // updateMessage(messageId, {
               //   status: 'failed',
               //   msg: (err as any)?.message || 'Something went wrong!',
               // });
               updateTaskItem({
                  id: messageId,
                  status: "failed",
               } as TaskItem);
            },
         };
      };

      // Utility function to handle API response
      const handleApiResponse = (response: any, messageId: string, sendTxt: string) => {
         // If response is undefined/null, it means it's a streaming response
         // which is handled by streamHandlers
         if (!response) {
            return;
         }

         // Handle non-streaming response
         if (!response.success) {
            updateMessage(messageId, {
               msg: response.error || "Error occurred",
               status: "failed",
            });
            updateTaskItem({
               id: messageId,
               status: "failed",
               message: sendTxt,
               title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
               agent: selectedAgent!,
               agentType: selectedAgent?.agent_type || AgentType.Normal,
            } as TaskItem);
         } else {
            updateMessage(messageId, {
               msg: response.data.choices[0].message.content,
               status: "received",
            });
            updateTaskItem({
               id: messageId,
               status: "done",
            } as TaskItem);
         }
      };

      try {
         let filteredMessages = messages.filter((item) => item.status !== "failed").filter((item) => !!item.msg);

         // remove pair of welcome message
         if (filteredMessages.find((item) => item.msg === INIT_WELCOME_MESSAGE)) {
            filteredMessages = filteredMessages.slice(2);
         }

         // double check if the welcome message is still there
         filteredMessages = filteredMessages.filter((item) => item.msg !== INIT_WELCOME_MESSAGE);

         // take last 4 pair messages
         filteredMessages = filteredMessages.slice(-4);

         const historyMessages = [
            // {
            //    role: "system",
            //    content: selectedAgent?.personality || "",
            // },
            ...filteredMessages.reduce((acc: any[], item, index) => {
               if (index > 0 && filteredMessages[index - 1].type !== "ai" && item.type !== "ai") {
                  acc.push({
                     role: "assistant",
                     content: "",
                  });
               }

               // Handle messages with attachments
               if (item.attachments && item.attachments.length > 0) {
                  const messageContent: any[] = [];

                  // Add text content if exists
                  if (item.msg) {
                     messageContent.push({
                        type: "text",
                        text: item.msg,
                     });
                  }

                  // Add image attachments
                  item.attachments.forEach((attachment) => {
                     if (attachment.type.startsWith("image/")) {
                        messageContent.push({
                           type: "image_url",
                           image_url: {
                              url: attachment.url,
                              detail: "",
                           },
                        });
                     }
                  });

                  acc.push({
                     role: item.type === "ai" ? "assistant" : "user",
                     content: messageContent,
                  });
               } else {
                  // Regular text message without attachments
                  acc.push({
                     role: item.type === "ai" ? "assistant" : "user",
                     content: item.msg,
                  });
               }

               return acc;
            }, []),
            // Handle the final message with potential attachments
            {
               role: "user",
               content:
                  sendTxt && attachments?.length
                     ? [
                          {
                             type: "text",
                             text: sendTxt,
                          },
                          ...attachments.map((attachment) => ({
                             type: "image_url",
                             image_url: {
                                url: attachment.url,
                                detail: "",
                             },
                          })),
                       ]
                     : sendTxt,
            },
         ];

         const params: ChatCompletionPayload = {
            messages: historyMessages,
            agentId: agentId,
            model_name: selectedAgent?.agent_base_model,
         };
         if (selectedAgent?.kb_id) {
            const kbId = `${selectedAgent?.kb_id}`.replace("kb-", "");
            params["kb_id"] = `kb-${kbId}`;
         }

         if ([AgentType.Infra, AgentType.CustomPrompt].includes(selectedAgent?.agent_type as any)) {
            const content =
               sendTxt && attachments?.length
                  ? [
                       { type: "text", text: sendTxt },
                       ...attachments.map((attachment) => ({
                          type: "image_url",
                          image_url: {
                             url: attachment.url,
                             detail: "",
                          },
                       })),
                    ]
                  : sendTxt;

            updateTaskItem({
               id: messageId,
               status: "processing",
               message: content as any,
               title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
               agent: selectedAgent!,
               agentType: selectedAgent?.agent_type || AgentType.Normal,
            });

            try {
               const response = await AgentAPI.chatAgentUtilityStreamCompletions({
                  agent: selectedAgent!,
                  payload: {
                     ...params,
                  },
                  streamHandlers: getStreamerHandler(messageId),
                  id: messageId,
                  prvKey: agentWallet?.privateKey,
               });

               handleApiResponse(response, messageId, sendTxt);
            } catch (error) {
               console.error('Error in chatAgentUtilityStreamCompletions:', error);
               updateMessage(messageId, {
                  msg: error instanceof Error ? error.message : "Error occurred",
                  status: "failed",
               });
               updateTaskItem({
                  id: messageId,
                  status: "failed",
                  message: sendTxt,
                  title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
                  agent: selectedAgent!,
                  agentType: selectedAgent?.agent_type || AgentType.Normal,
               } as TaskItem);
            }
         } else if ([AgentType.Model, AgentType.ModelOnline].includes(selectedAgent?.agent_type as any)) {
            updateTaskItem({
               id: messageId,
               status: "processing",
               message: sendTxt,
               title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
               agent: selectedAgent!,
               agentType: selectedAgent?.agent_type || AgentType.Normal,
            });

            try {
               const response = await AgentAPI.chatAgentModelStreamCompletions({
                  payload: params,
                  streamHandlers: getStreamerHandler(messageId),
               });

               handleApiResponse(response, messageId, sendTxt);
            } catch (error) {
               updateMessage(messageId, {
                  msg: error instanceof Error ? error.message : "Error occurred",
                  status: "failed",
               });
               updateTaskItem({
                  id: messageId,
                  status: "failed",
                  message: sendTxt,
                  title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
                  agent: selectedAgent!,
                  agentType: selectedAgent?.agent_type || AgentType.Normal,
               } as TaskItem);
            }
         } else {
            updateTaskItem({
               id: messageId,
               status: "processing",
               message: sendTxt,
               title: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
               agent: selectedAgent!,
               agentType: selectedAgent?.agent_type || AgentType.Normal,
            });
            await AgentAPI.chatStreamCompletions({
               payload: {
                  ...params,
               },
               streamHandlers: getStreamerHandler(messageId),
            });
         }
      } catch (e) {
         const errorMessage = (e as any)?.response?.data?.error || "Something went wrong!";
         console.log(">>>> e", e, (e as any).message, (e as any).response?.data);
         updateMessage(messageId, {
            status: "failed",
            msg: errorMessage,
         });
         updateTaskItem({
            id: messageId,
            status: "failed",
         } as TaskItem);
      } finally {
         setIsLoading(false);
         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }
   };

   const updateMessage = useCallback((id: string, data: Partial<IChatMessage>, isUpdateDB = true) => {
      try {
         setMessages((prev) => {
            const matchedMessageIndex = prev.findLastIndex((i) => i.id === id);
            if (matchedMessageIndex !== -1) {
               prev[matchedMessageIndex] = {
                  ...prev[matchedMessageIndex],
                  ...data,
               };
               if (prev[matchedMessageIndex].status === "waiting" || prev[matchedMessageIndex].status === "receiving" || prev[matchedMessageIndex].status === "pre-done") {
                  const updatedMessage = {
                     ...prev[matchedMessageIndex],
                     ...data,
                     queryMessageState: data?.queryMessageState || prev[matchedMessageIndex]?.queryMessageState,
                     tx_hash: data?.onchain_data?.propose_tx || prev[matchedMessageIndex]?.tx_hash,
                  };
                  prev[matchedMessageIndex] = updatedMessage;
               }

               const replyToMessageId = prev[matchedMessageIndex].replyTo;
               const userMessageIndex = prev.findLastIndex((i) => i.id === replyToMessageId);

               if (userMessageIndex !== -1) {
                  const updatedUserMessage = {
                     ...prev[userMessageIndex],
                     tx_hash: data?.onchain_data?.infer_tx || prev[userMessageIndex]?.tx_hash,
                  };

                  prev[userMessageIndex] = updatedUserMessage;
               }

               if (isUpdateDB) {
                  chatAgentDatabase.updateChatItem(prev[matchedMessageIndex] as PersistedMessageType);
               }
               return [...prev];
            }
            return prev;
         });
      } catch (err) {
         //
      } finally {
         setTimeout(() => {
            scrollRef.current?.scrollIntoView({
               behavior: "smooth",
            });
         }, 200);
      }
   }, []);

   const onRetryErrorMessage = useCallback(
      async (id: string) => {
         if (isStopReceiving) return;

         const targetMessage = messages.find((i) => i.id === id);
         if (targetMessage) {
            const userMessageId = v4();
            const newMessage: IChatMessage = {
               ...targetMessage,
               id: userMessageId,
               createdAt: new Date().getTime()
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
               msg: "",
               status: "waiting",
               type: "ai",
               replyTo: userMessageId,
               name: selectedAgent?.display_name || selectedAgent?.agent_name || "Agent",
               is_reply: true,
               createdAt: new Date().getTime()
            };

            setMessages((prev) => [...prev, responseMsg]);

            chatAgentDatabase.addChatItem({
               ...responseMsg,
               threadId: threadId,
            });

            await sendMessageToServer(messageId, Number(id), targetMessage?.msg, targetMessage.attachments);
         }
      },
      [messages, id, isStopReceiving]
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
         updateMessage,
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
      scrollRef,
      updateMessage,
   ]);

   return (
      <ChatAgentProviderContext.Provider value={value}>
         {children}
         <HandleMessageProcessing updateMessage={updateMessage} />
      </ChatAgentProviderContext.Provider>
   );
};

export const useChatAgentProvider = (): any => {
   const values = useContext(ChatAgentProviderContext);
   return values;
};
