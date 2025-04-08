import { Box, Spinner, usePrevious } from "@chakra-ui/react";
import cn from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import s from "./ChatList.module.scss";
import { IChatMessage } from "src/services/api/agent/types.ts";
import { INIT_WELCOME_MESSAGE } from "@pages/home/chat-agent/ChatAgent/constants.ts";
import ChatMessage from "@pages/home/chat-agent/ChatAgent/components/ChatMessage";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";

interface IProps {
   onRetryErrorMessage: (messageId: string) => void;
   isSending: boolean;
}

const ChatList = ({ onRetryErrorMessage, isSending = false }: IProps) => {
   const { messages, isLoadingMessages, scrollableRef, loading, scrollRef, updateMessage } = useChatAgentProvider();

   const messageLengthPrevious = usePrevious(messages?.length);

   const topMostRef = useRef<HTMLDivElement | null>(null);
   const [isFetching, setIsFetching] = useState(false);

   const prevCountRef = useRef<number>(messages.length);
   useEffect(() => {
      if (prevCountRef.current < messages.length) {
         prevCountRef.current = messages.length;
      }
   }, [messages]);

   // useEffect(() => {
   //    setTimeout(() => {
   //       // scrollableRef?.current?.scrollToBottom();
   //       scrollRef.current?.scrollIntoView({ behavior: "smooth" });
   //    }, 300);
   // }, []);

   useLayoutEffect(() => {
      if (!messageLengthPrevious && messageLengthPrevious !== messages?.length) {
         scrollRef?.current?.scrollIntoView && scrollRef?.current?.scrollIntoView({ behavior: "auto" });
      }
   }, [messageLengthPrevious, messages?.length]);

   const renderBody = () => {
      const onRetryErrorMessageOverride = (messageId: string) => {
         onRetryErrorMessage(messageId);
         // scrollableRef.current?.scrollToBottom();
         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      return (
         <ScrollableFeed className={s.scroll} ref={scrollableRef}>
            {messages?.map((message: IChatMessage, index: number) => {
               const isLast = index === messages.length - 1;

               const isInitialMessage = messages[0]?.msg === INIT_WELCOME_MESSAGE;

               if (index === 0) {
                  return (
                     <Box key={message.id} ref={topMostRef}>
                        <ChatMessage
                           messages={messages}
                           updateMessage={updateMessage}
                           message={message}
                           isLast={isLast}
                           onRetryErrorMessage={onRetryErrorMessageOverride}
                           isSending={isSending}
                        />
                     </Box>
                  );
               }

               return (
                  <ChatMessage
                     messages={messages} 
                     updateMessage={updateMessage}
                     key={message.id}
                     message={message}
                     isLast={isLast}
                     onRetryErrorMessage={onRetryErrorMessageOverride}
                     isSending={isSending}
                     initialMessage={isInitialMessage && index === 1}
                  />
               );
            })}
            <div ref={scrollRef} />
         </ScrollableFeed>
      );
   };

   return (
      <div
         className={cn(s.wrapper, {
            [s.empty_list as any]: messages.length === 0 && !isLoadingMessages,
         })}
         // style={{ '--box-height': `${CHAT_BOX_HEIGHT}px` } as any}
      >
         {isFetching && <Spinner size="md" position={"absolute"} left={"50%"} transform={"translateX(-50%)"} />}
         {renderBody()}
      </div>
   );
};

export default ChatList;
