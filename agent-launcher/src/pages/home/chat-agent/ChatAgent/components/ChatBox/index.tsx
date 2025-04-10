import { motion } from "framer-motion";
import React, { useContext, useMemo } from "react";
import s from "./styles.module.scss";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import WebView from "@components/WebView";

const ChatBox = () => {
   const { loading, onRetryErrorMessage } = useChatAgentProvider();

   const { isRunning, requireInstall, selectedAgent, isCustomUI, customUIPort, agentWallet } = useContext(AgentContext);


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

    const params = useMemo(() => {
      if (!selectedAgent?.required_wallet) {
         return '';
      }

      const queryParams = new URLSearchParams({
         PRIVATE_KEY: agentWallet?.privateKey || '',
         WALLET_ADDRESS: agentWallet?.address || ''
      }).toString();

      return queryParams;
   }, [selectedAgent?.required_wallet, agentWallet?.privateKey, agentWallet?.address]);

   const isRequireWallet = selectedAgent?.required_wallet && !!agentWallet;

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
               true ? (
                  <Box width="100%">
                     <WebView 
                        url={`http://localhost:${customUIPort}${params ? `?${params}` : ''}`}
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
         </div>
      </motion.div>
   );
};

export default ChatBox;
