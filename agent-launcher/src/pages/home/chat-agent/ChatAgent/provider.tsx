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
import {v4} from 'uuid';
import {INIT_WELCOME_MESSAGE} from './constants';
import {ChatCompletionPayload, IChatMessage} from "../../../../services/api/agent/types.ts";
import AgentAPI from "../../../../services/api/agent";
import {AgentContext} from "@pages/home/provider";
import chatAgentDatabase, {PersistedMessageType} from "../../../../database/chatAgentDatabase.ts";
import {Wallet} from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

type IChatAgentProviderContext = {
  isStopReceiving?: boolean;
  messages: IChatMessage[];
  isLoadingMessages: boolean;
  setIsLoadingMessages: (value: boolean) => void;
  publishEvent: (message: string) => void;
  scrollableRef: React.RefObject<ScrollableFeed>;
  loading: boolean;
  info?: {
    name: string;
    personality: string;
  };
  animatedId: string[];
  addAnimatedId: (_: string) => void;

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
  animatedId: [],
  addAnimatedId: () => {},

  chatInputRef: undefined,
  isFocusChatInput: false,
  setIsFocusChatInput: () => {},
  isAllowChat: false,
});

export const ChatAgentProvider = ({ children }: PropsWithChildren) => {
  const scrollableRef = useRef<ScrollableFeed | null>(null);

  const [loading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<
    { name: string; personality: string } | undefined
  >(undefined);

  const { selectedAgent } = useContext(AgentContext);

  // const { wallet } = useAppAuthenticated();
  // const { latestAddress } = useWagmiContext();

  const id = selectedAgent?.id;

  const wallet = new Wallet("0x5776efc21d0e98afd566d3cb46e2eb1ccd7406f4feaee9c28b0fcffc851cc8b3", new JsonRpcProvider("https://eth.llamarpc.com"));
  const latestAddress = '0x12345678';

  console.log('stephen: wallet', wallet);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const chatInputRef = React.useRef<any>();
  const [isFocusChatInput, setIsFocusChatInput] = React.useState(false);

  const threadId = selectedAgent?.agent_name || 'Agent';

  const isAllowChat = useMemo(() => {
    if(selectedAgent) {
      return Number(selectedAgent?.wallet_balance) > 0;
    }

    return false;
  }, [selectedAgent]);

  useEffect(() => {
    chatAgentDatabase.loadChatItems(threadId).then((items) => {
      if (items?.length === 0) {
        //
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
            sendMessageToServer(lastMessage.id, Number(id), lastMessage.msg);
          }
        }
      }
    });
  }, [threadId]);

  useEffect(() => {
    if (!!selectedAgent && messages.length === 0) {
      publishEvent(INIT_WELCOME_MESSAGE);
    }
  }, [selectedAgent, messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isStopReceiving =
    lastMessage?.status === 'receiving' || lastMessage?.status === 'waiting';

  const publishEvent = async (message: string) => {
    if (!message) return;

    if (!message || lastMessage?.status === 'waiting' || isStopReceiving) {
      return;
    }
    if (message) {
      setIsLoading(true);

      const userMessageId = v4();

      const newMessage: IChatMessage = {
        id: userMessageId,
        senderId: wallet?.address || latestAddress || '',
        msg: message,
        status: 'sent',
        type: 'human',
        is_reply: false,
        name: 'You',
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
        is_reply: true,
        name: selectedAgent?.agent_name || 'Agent',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, responseMsg]);

      chatAgentDatabase.addChatItem({
        ...responseMsg,
        threadId: threadId,
      });

      await sendMessageToServer(messageId, Number(id), message);
    }
  };

  const sendMessageToServer = async (
    messageId: string,
    agentId: number,
    sendTxt: string,
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
        ...filteredMessages.map((item) => ({
          role: item.type === 'ai' ? 'assistant' : 'user',
          content: item.msg,
        })),
        { role: 'user', content: sendTxt },
      ];

      const params: ChatCompletionPayload = {
        messages: historyMessages,
        agentId: agentId,
      };
      if (selectedAgent?.kb_id) {
        const kbId = `${selectedAgent?.kb_id}`.replace('kb-', '');
        params['kb_id'] = `kb-${kbId}`;
      }

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
    } catch (e) {
      updateMessage(messageId, {
        status: 'failed',
        msg: (e as any).message || 'Something went wrong!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = (id: string, data: Partial<IChatMessage>) => {
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
          prev[matchedMessageIndex].status === 'waiting' ||
          prev[matchedMessageIndex].status === 'receiving' ||
          prev[matchedMessageIndex].status === 'pre-done'
        ) {
          const updatedMessage = {
            ...prev[matchedMessageIndex],
            ...data,
            updatedAt: new Date().toISOString(),
            queryMessageState:
              data?.queryMessageState ||
              prev[matchedMessageIndex]?.queryMessageState,
            tx_hash:
              data?.onchain_data?.propose_tx ||
              prev[matchedMessageIndex]?.tx_hash,
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

        await sendMessageToServer(messageId, Number(id), targetMessage?.msg);
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
