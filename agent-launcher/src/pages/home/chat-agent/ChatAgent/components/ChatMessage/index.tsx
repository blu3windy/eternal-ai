import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import s from "./ChatMessage.module.scss";
import pdfMake from "pdfmake";
import { mdpdfmake } from "mdpdfmake";
import cs from "classnames";
import { INIT_WELCOME_MESSAGE } from "../../constants";
import SvgInset from "@components/SvgInset";
// import {WaitingAnimation} from '@/modules/chat/components/ChatMessage/WaitingForGenerate/WaitingForGenerateText';
import { formatLongAddress } from "@utils/format";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { IChatMessage } from "src/services/api/agent/types.ts";
import { AgentContext } from "@pages/home/provider/AgentContext";
import CustomMarkdown from "@components/CustomMarkdown";
import { compareString, removeInvalidTags } from "@utils/string.ts";
import { getExplorerByChain } from "@utils/helpers.ts";
import { motion } from "framer-motion";
import { WaitingAnimation } from "@components/ChatMessage/WaitingForGenerate/WaitingForGenerateText";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { openWithUrl } from "@stores/states/floating-web-view/reducer";
import { THINK_TAG_REGEX, COMPUTER_USE_TAG_REGEX, MARKDOWN_TAGS, IMAGE_SLIDER_TAG_REGEX, IMAGE_SLIDE_ITEM_TAG_REGEX } from "@components/CustomMarkdown/constants";
import ProcessingTaskModal from "@pages/home/list-agent/BottomBar/ProcessingTaskModal";

dayjs.extend(duration);

type Props = {
   message: IChatMessage;
   ref: any;
   isLast: boolean;
   onRetryErrorMessage: (messageId: string) => void;
   isSending: boolean;
   initialMessage?: boolean;
   updateMessage: (id: string, data: Partial<IChatMessage>, isUpdateDB?: boolean) => void;
   messages: IChatMessage[];
};

const ChatMessage = ({ messages, message, ref, isLast, onRetryErrorMessage, isSending, initialMessage, updateMessage }: Props) => {
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

   useEffect(() => {
      let timer: NodeJS.Timeout;

      if (message?.status === 'waiting') {
         timer = setTimeout(() => {
            setShowTaskText(true);
         }, 5000);
      } else {
         setShowTaskText(false);

         if (timer) {
            clearTimeout(timer);
         }
      }

      return () => {
         if (timer) {
            clearTimeout(timer);
         }
      };
   }, [message?.status]);

   const calcTime = () => {
      const diff = dayjs.duration(dayjs(message?.updatedAt).diff(dayjs(message?.createdAt)));
      if (diff.milliseconds() <= 0) {
         setHours(null);
         setMinutes(null);
         setSeconds(null);
         return;
      }
      setHours(diff.hours());
      setMinutes(diff.minutes());
      setSeconds(diff.seconds());
   };

   useEffect(() => {
      if (message?.createdAt && message?.updatedAt) {
         calcTime();
      }
   }, [message]);

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
            {message.attachments?.map((attachment, index) => (
               <Box key={index} mt={2}>
                  <Image
                     src={attachment.url}
                     alt="Attached image"
                     maxW="300px"
                     borderRadius="md"
                     loading="lazy"
                     fallback={
                        <Box w="300px" h="200px" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
                           <Text color="gray.500">Loading image...</Text>
                        </Box>
                     }
                  />
               </Box>
            ))}
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
               <p>{message.msg}</p>
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
               <CustomMarkdown id={message.id} status={message.status} content={renderMessage.replace(COMPUTER_USE_TAG_REGEX, '')} />
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
               <span>{message.msg || "Something went wrong!"}</span>
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

      const isPdfExport = message.status === "received" && message.type === "ai" && !!resultMessage;
      return (
         <div
            className={cs(s.markdown, "markdown-body", {
               [s.markdown__received]: message.status === "received",
            })}
         >
            {isPdfExport && (
               <div className={s.exportPdf}>
                  <motion.div
                     initial={{ y: 0, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: 0, opacity: 0 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                     className={`${s.snackbar}`}
                     onClick={() => {
                        const printContent = message.msg
                           .replace(THINK_TAG_REGEX, '')
                           .replace(COMPUTER_USE_TAG_REGEX, '')
                           .replace(IMAGE_SLIDER_TAG_REGEX, (_, sliderInnerText) => {
                              return sliderInnerText
                                 .replace(/\n/g, "")
                                 .match(IMAGE_SLIDE_ITEM_TAG_REGEX)
                                 .map(item => item.replace(/<\/?slide-item>/g, ''))
                                 .join('\n');
                           });

                        mdpdfmake(printContent).then((docDefinition) => {
                           console.log(docDefinition);
                           // Use docDefinition with a PDFMake instance to generate a PDF
                           pdfMake.createPdf(docDefinition).download(`${selectedAgent?.display_name || selectedAgent?.agent_name || "Agent"}-${dayjs().format("YYYY-MM-DD-hh:mm:ss")}.pdf`);
                        });
                     }}
                     style={{
                        cursor: "pointer",
                     }}
                  >
                     <Text>Export to PDF</Text>
                  </motion.div>
               </div>
            )}
            <CustomMarkdown id={message.id} status={message.status} content={renderMessage} />
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
            {message?.is_reply && (
               <Flex direction="row" alignItems="center" gap="6px" width="100%" justifyContent={message?.is_reply ? "flex-start" : "flex-end"}>
                  <Flex gap="8px" alignItems="center" width="100%" flexDirection={message?.is_reply ? "row" : "row-reverse"}>
                     {message?.is_reply && selectedAgent?.token_image_url && <Image src={selectedAgent.token_image_url} width="24px" height="24px" borderRadius="24px" />}
                     <Text fontSize="15px" fontWeight="600" width="fit-content">
                        {message.name}
                     </Text>
                  </Flex>
               </Flex>
            )}
            <Box
               className={cs(s.content, { [s.question]: !message?.is_reply }, { [s.reply]: message?.is_reply }, { [s.failed]: message?.status === "failed" })}
               alignSelf={message?.is_reply ? "flex-start" : "flex-end"}
               position={"relative"}
            >
               {renderContent()}
               {processingWebViewUrl && (
                  <Box
                     position={"absolute"}
                     right={"-40px"}
                     bottom={0}
                     borderRadius={"50%"}
                     border="1px solid #F4F4F4"
                     background={"white"}
                     boxShadow={"2px 2px 8px 0px rgba(0, 0, 0, 0.15)"}
                     width={"32px"}
                     height={"32px"}
                     display={"flex"}
                     alignItems={"center"}
                     justifyContent={"center"}
                     transition={"all 0.2s ease-in-out"}
                     _hover={{
                        cursor: "pointer",
                        transform: "translateY(-2px)",
                        transition: "transform 0.2s ease-in-out",
                     }}
                     onClick={() => {
                        const replyToMessage = messages.find(item => item.id === message.replyTo);
                        dispatch(openWithUrl({
                           url: processingWebViewUrl,
                           task: 'Searching',
                           taskProcessing: replyToMessage?.msg || ''
                        }))
                     }}
                  >
                     <SvgInset svgUrl="icons/ic-computer.svg" size={16} />
                  </Box>
               )}
            </Box>

            {(message.status === "receiving" || message.status === "waiting") && message.queryMessageState && !compareString(message.queryMessageState, "DONE") && (
               <Box paddingLeft={"12px"}>
                  <Text opacity={"0.6"} color="#fff" fontSize={"12px"} fontWeight={"400"} lineHeight={"120%"}>
                     {message.queryMessageState}
                  </Text>
               </Box>
            )}
            {renderResponseTime()}
         </div>
         <ProcessingTaskModal
            key={`processing-task-${isOpenProcessingTask}`}
            isOpen={isOpenProcessingTask}
            setIsOpen={() => {
               setIsOpenProcessingTask((prev) => !prev);
            }}
         />
      </>

   );
};

export default memo(ChatMessage);
