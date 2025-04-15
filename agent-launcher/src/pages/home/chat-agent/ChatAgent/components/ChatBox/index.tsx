import { motion } from "framer-motion";
import React, { useContext, useMemo } from "react";
import s from "./styles.module.scss";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { Box, Button, Flex, Text, Image, HStack, useClipboard, useToast } from "@chakra-ui/react";
import WebView from "@components/WebView";
import AgentTradeProvider from "@pages/home/trade-agent/provider";
import AgentWallet from "@components/AgentWallet";

const ChatBox = () => {
   const { loading, onRetryErrorMessage } = useChatAgentProvider();

   const { isRunning, requireInstall, selectedAgent, isCustomUI, customUIPort, agentWallet, isBackupedPrvKey } = useContext(AgentContext);

   const { onCopy: onCopyAddress } = useClipboard(agentWallet?.address || '');
   const toast = useToast();

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
         WALLET_ADDRESS: agentWallet?.address || '',
         CHAIN_ID: selectedAgent?.network_id || ''
      }).toString();

      return queryParams;
   }, [selectedAgent?.required_wallet, agentWallet?.privateKey, agentWallet?.address]);

   const isShowWallet = useMemo(() => {
      return selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey;
   }, [selectedAgent, agentWallet, isBackupedPrvKey]);

   const handleCopyAddress = () => {
      onCopyAddress();
      toast({
        description: "Address copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    };

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
               isCustomUI ? (
                  <Box width="100%">
                     <WebView
                        url={`http://localhost:${customUIPort}${params ? `?${params}` : ''}`}
                        height={`calc(100vh - ${isShowWallet ? '150px' : '100px'})`}
                        width="100%"
                     />
                     <>
                        {isShowWallet && (
                           <Flex className={s.walletWrapper}>
                              <HStack>
                                 <Text fontSize={'14px'} fontWeight={400} color={'#000'} opacity={0.6}>{selectedAgent?.display_name || selectedAgent?.agent_name} Wallet: </Text>
                                 <Text fontSize={'14px'} fontWeight={400} color={'#000'}>{(agentWallet?.address || '').slice(0, 10)}...{(agentWallet?.address || '').slice(-4)}</Text>
                                 <Box cursor={'pointer'} onClick={handleCopyAddress}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <g opacity="0.5">
                                          <path d="M5.00104 4.39948V2.59987C5.00104 2.44077 5.06424 2.2882 5.17674 2.1757C5.28924 2.0632 5.44182 2 5.60091 2H12.7994C12.9584 2 13.111 2.0632 13.2235 2.1757C13.336 2.2882 13.3992 2.44077 13.3992 2.59987V10.998C13.3992 11.1571 13.336 11.3097 13.2235 11.4222C13.111 11.5347 12.9584 11.5979 12.7994 11.5979H10.9997V13.3975C10.9997 13.7287 10.7298 13.9974 10.3957 13.9974H3.20563C3.1265 13.998 3.04805 13.9828 2.97478 13.9529C2.90152 13.923 2.83489 13.879 2.77874 13.8232C2.72259 13.7674 2.67803 13.7011 2.64762 13.6281C2.61721 13.555 2.60156 13.4767 2.60156 13.3975L2.60336 4.99935C2.60336 4.66822 2.8733 4.39948 3.20683 4.39948H5.00104ZM6.20078 4.39948H10.9997V10.3982H12.1995V3.19974H6.20078V4.39948Z" fill="black" />
                                       </g>
                                    </svg>
                                 </Box>
                              </HStack>
                              <AgentTradeProvider>
                                 <AgentWallet color={'black'} />
                              </AgentTradeProvider>
                           </Flex>
                        )}
                     </>
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
