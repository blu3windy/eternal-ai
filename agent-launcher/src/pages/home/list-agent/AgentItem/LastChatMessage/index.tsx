import { Box, Flex, Text } from "@chakra-ui/react";
import SvgInset from "@components/SvgInset";
import cs from "classnames";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import s from "./styles.module.scss";
import { WaitingAnimation } from "@components/ChatMessage/WaitingForGenerate/WaitingForGenerateText";
import CustomMarkdown from "@components/CustomMarkdown";
import { COMPUTER_USE_TAG_REGEX, MARKDOWN_TAGS, THINK_TAG_REGEX } from "@components/CustomMarkdown/constants";
import { INIT_WELCOME_MESSAGE } from "@pages/home/chat-agent/ChatAgent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useDispatch } from "react-redux";
import { IChatMessage } from "src/services/api/agent/types.ts";

dayjs.extend(duration);

type Props = {
   message: IChatMessage;
   ref: any;
   onRetryErrorMessage: (messageId: string) => void;
   isSending: boolean;
   initialMessage?: boolean;
   updateMessage: (id: string, data: Partial<IChatMessage>, isUpdateDB?: boolean) => void;
   messages: IChatMessage[];
};

const LastChatMessage = ({ messages, message, ref, isLast, onRetryErrorMessage, isSending, initialMessage, updateMessage }: Props) => {
   const dispatch = useDispatch();
   const { selectedAgent } = useContext(AgentContext);
   const [hours, setHours] = useState<number | null>(0);
   const [minutes, setMinutes] = useState<number | null>(0);
   const [seconds, setSeconds] = useState<number | null>(0);
   const [showTaskText, setShowTaskText] = useState(false);
   const [isOpenProcessingTask, setIsOpenProcessingTask] = useState(false);

   useEffect(() => {
      const createdAt = message?.createdAt ? new Date(message?.createdAt).getTime() : new Date().getTime();
      const now = new Date().getTime();

      const remainingTime = (now - createdAt);

      if (message.status === "waiting" || message.status === "receiving") {
         const waitingTime = 1000 * 60 * 3;
         if (remainingTime < waitingTime) {
            const timeout = setTimeout(() => {
               updateMessage(message.id, {
                  status: message.status === "waiting" ? "sync-waiting" : "sync-receiving",
                  updatedAt: new Date().getTime(),
               });
            }, waitingTime - remainingTime);

            return () => {
               clearTimeout(timeout);
            };
         } else {
            updateMessage(message.id, {
               status: message.status === "waiting" ? "sync-waiting" : "sync-receiving",
               updatedAt: new Date().getTime(),
            });
         }
      } else if (message.status === "sync-waiting" || message.status === "sync-receiving") {
         const waitingTime = 1000 * 60 * 30;
         if (remainingTime < waitingTime) {
            const timeout = setTimeout(() => {
               updateMessage(message.id, {
                  status: "failed",
                  msg: "Server is not responding",
               });
            }, waitingTime - remainingTime);
            return () => {
               clearTimeout(timeout);
            };
         } else {
            updateMessage(message.id, {
               status: "failed",
               msg: "Server is not responding",
            });
         }
      }
   }, [message.status, updateMessage, message.id]);

   const renderMessage = useMemo(() => {
      // const textStr = removeInvalidTags(message.msg || '')
      const textStr = message.msg || '';
      if (message.status === "receiving" || message.status === "sync-receiving") {
         return (textStr || ''); // replace computer use tag;
      }
      return `${textStr || ''}`
         .replace(COMPUTER_USE_TAG_REGEX, ''); // replace computer use tag
   }, [message?.msg, message?.status]);

   const resultMessage = useMemo(() => {
      return `${renderMessage || ''}`
         .replace(THINK_TAG_REGEX, '');
   }, [renderMessage])

   const processingWebViewUrl = useMemo(() => {
      try {
         const matches = `${renderMessage || ''}`.match(COMPUTER_USE_TAG_REGEX);
         if (matches?.length) {
            let url = matches[0] || '';
            url = url.replace(`<${MARKDOWN_TAGS.COMPUTER_USE}>`, '').replace(`</${MARKDOWN_TAGS.COMPUTER_USE}>`, '');
            return url;
         }
      } catch (error) {
         return null;
      }
   }, [renderMessage]);

   const renderContent = () => {
      return (
         <>
            {renderMarkdown()}
         </>
      );
   };

   const renderWaitingMessage = () => {
      return (
         <Flex gap="8px" alignItems="center">
            <WaitingAnimation color={message?.is_reply ? "black" : "white"} />
            {showTaskText && (
               <Text
                  position={'absolute'}
                  left={'70px'}
                  whiteSpace={'nowrap !important'}
                  fontSize="16px"
                  fontWeight="400"
                  color={message?.is_reply ? "black" : "white"}
               >{selectedAgent?.display_name} is looking up information. Check your active tasks to track the progress <Text as={'span'} cursor={'pointer'} textDecoration={'underline'} onClick={() => setIsOpenProcessingTask(true)}>here</Text>.</Text>
            )}
         </Flex>
      );
   }

   const renderResponseTime = () => {
      return (
         <>
         {message?.is_reply && !!message?.createdAt && !!message?.updatedAt && (
               <Box w='100%' display={"flex"} alignItems={"center"} gap={"12px"} justifyContent={message?.is_reply ? "flex-start" : "flex-end"} mt={message?.is_reply ? "0px" : "-20px"}>
                  <Text className={s.txLink}>{`${minutes && minutes > 0 ? `${minutes}m` : ""} ${seconds && seconds > 0 ? `${seconds}s` : ""}`}</Text>
               </Box>
            )}
         </>
      )
   }

   const renderMarkdown = () => {
      if (message.type === 'human') {
         return (
            <div
               className={cs(s.markdown, "markdown-body", {
                  [s.markdown__human]: true
               })}
            >
               <p className={s.twoLineText}>{message.msg}</p>
            </div>
         )
      }
      if (message.status === "waiting" || message.status === "sync-waiting") {
         return renderWaitingMessage();
      }

      if ((message.status === "receiving" || message.status === "sync-receiving") && !!processingWebViewUrl) {
         return (
            <div
               className={cs(s.markdown, "markdown-body", {
               })}
            >
               <div className={s.twoLineText}>
                  <CustomMarkdown id={message.id} status={message.status} content={renderMessage.replace(COMPUTER_USE_TAG_REGEX, '')} />
               </div>
            </div>
         );
      }

      if (message.status === "failed") {
         return (
            <div
               className={cs(s.markdown, {
                  [s.markdown__failed]: message.status === "failed",
               })}
            >
               <span className={s.twoLineText}>{message.msg || "Something went wrong!"}</span>
               {!isSending && (
                  <span
                     className={s.retry}
                     onClick={() => {
                        message.replyTo && onRetryErrorMessage(message.replyTo);
                     }}
                  >
                     <SvgInset size={18} svgUrl="/svg/ic-retry-v2.svg" />
                  </span>
               )}
            </div>
         );
      }

      return (
         <div
            className={cs(s.markdown, {
               [s.markdown__received]: message.status === "received",
            })}
         >
            <div className={s.twoLineText}>
               <CustomMarkdown id={message.id} status={message.status} content={renderMessage} />
            </div>
         </div>
      );
   };

   const isMessageInitial = useMemo(() => !message?.is_reply && message?.msg === INIT_WELCOME_MESSAGE, [message]);

   if (isMessageInitial) {
      return <></>;
   }

   return (
      <>
         <div className={s.wrapper} ref={ref}>
            <Box
               className={cs(s.content, { [s.question]: !message?.is_reply }, { [s.reply]: message?.is_reply }, { [s.failed]: message?.status === "failed" })}
               // alignSelf={message?.is_reply ? "flex-start" : "flex-end"}
               position={"relative"}
            >
               {renderContent()}
            </Box>
         </div>
      </>

   );
};

export default memo(LastChatMessage);
