import { motion } from "framer-motion";
import React, { useContext, useMemo } from "react";
import s from "./styles.module.scss";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import { AgentContext } from "@pages/home/provider";
import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import WebView from "@components/WebView";

const ChatBox = () => {
   const { loading, onRetryErrorMessage } = useChatAgentProvider();

   const { isRunning, requireInstall, selectedAgent, isStarting, startAgent, agentWallet, isCustomUI, customUIPort } = useContext(AgentContext);

   const handleStartAgent = () => {
      startAgent(selectedAgent);
   };

   const containerMaxHeight = useMemo(() => {
      const element = document.getElementById("detailContainer");
      if (element) {
         const weight = requireInstall ? (isRunning ? 0.91 : 0.96) : 0.96;
         const base = Math.floor(element.clientHeight * weight);
         return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
      }
      return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
   }, [requireInstall, isRunning]);

   const innerMaxHeight = useMemo(() => {
      return `calc(100vh - 72px - 120px)`;
   }, [requireInstall, isRunning]);

   const avatarUrl
    = selectedAgent?.thumbnail
    || selectedAgent?.token_image_url
    || selectedAgent?.twitter_info?.twitter_avatar;

   return (
      <motion.div
         className={s.container}
         style={
            {
               // maxHeight: containerMaxHeight,
            }
         }
      >
         <div
            // className={s.chatList}
            // style={
            //   {
            //     // maxHeight: innerMaxHeight,
            //     // minHeight: innerMaxHeight,
            //   }
            // }
         >
            {
               requireInstall && !isRunning ? (
                  <Flex
                     direction={"column"}
                     justifyContent={"center"}
                     alignItems={"center"}
                     gap={"16px"}
                     className={s.chatList}
                     style={{
                        height: innerMaxHeight,
                        overflow: "auto",
                        // minHeight: innerMaxHeight,
                     }}
                  >
                     <Image src={avatarUrl} alt={selectedAgent?.agent_name} width={"280px"} height={"280px"} borderRadius={"50%"} />
                     <Text fontSize={"24px"} fontWeight={500} color={"#FFF"} mt={"16px"}>{selectedAgent?.agent_name}</Text>
                     <Text fontSize={"16px"} fontWeight={400} opacity={0.8} color={"#FFF"}>You're all set! Your agent is installed{agentWallet ? ', and your wallet is ready.' : '.' }</Text>
                     <Button
                        className={s.btnStart}
                        onClick={handleStartAgent}
                        isLoading={isStarting}
                        isDisabled={isStarting}
                        loadingText={"Starting..."}
                        mt={"16px"}
                     >
                        {/*                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.147 10.3468L7.31449 16.2351C7.25175 16.2769 7.17885 16.3008 7.10357 16.3044C7.02829 16.308 6.95344 16.2911 6.88699 16.2555C6.82055 16.22 6.765 16.167 6.72625 16.1024C6.68751 16.0377 6.66703 15.9638 6.66699 15.8884V4.11176C6.66703 4.0364 6.68751 3.96245 6.72625 3.8978C6.765 3.83315 6.82055 3.78022 6.88699 3.74465C6.95344 3.70907 7.02829 3.69219 7.10357 3.69579C7.17885 3.69939 7.25175 3.72334 7.31449 3.7651L16.147 9.65343C16.2041 9.69148 16.2508 9.74303 16.2832 9.80351C16.3156 9.86398 16.3325 9.93151 16.3325 10.0001C16.3325 10.0687 16.3156 10.1362 16.2832 10.1967C16.2508 10.2572 16.2041 10.3087 16.147 10.3468Z"
                    fill="white"
                  />
                </svg>*/}
                Start running {selectedAgent?.agent_name}
                     </Button>
                  </Flex>
               ) : (
                  <>
                     {
                        isCustomUI ? (
                           <Box width="100%">
                              <WebView 
                                 url={`http://localhost:${customUIPort}`}
                                 height="calc(100vh - 100px)"
                                 width="100%"
                              />
                           </Box>
                        ) : (
                           <>
                              <div
                                 className={s.chatList}
                                 style={{
                                    height: innerMaxHeight,
                                    overflow: "auto",
                                    // minHeight: innerMaxHeight,
                                 }}
                              >
                                 <ChatList
                                    onRetryErrorMessage={onRetryErrorMessage}
                                    isSending={loading}
                                 />
                              </div>
                              <InputText isSending={loading} />
                           </>
                        )
                     }
                  </>
               )
            }
         </div>
      </motion.div>
   );
};

export default ChatBox;
