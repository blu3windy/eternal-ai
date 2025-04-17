import { Box, Flex, HStack, Image, Text, useClipboard, useToast } from "@chakra-ui/react";
import AgentWallet from "@components/AgentWallet";
import WebView from "@components/WebView";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import { AgentContext } from "@pages/home/provider/AgentContext";
import AgentTradeProvider from "@pages/home/trade-agent/provider";
import { motion } from "framer-motion";
import { useContext, useMemo } from "react";
import s from "./styles.module.scss";
import { useSelector } from "react-redux";
import { layoutViewSelector } from "@stores/states/layout-view/selector";

const ChatBox = () => {
   const { loading, onRetryErrorMessage } = useChatAgentProvider();

   const { isRunning, requireInstall, selectedAgent, isCustomUI, customUIPort, agentWallet, isBackupedPrvKey } = useContext(AgentContext);

   const { onCopy: onCopyAddress } = useClipboard(agentWallet?.address || '');
   const toast = useToast();

   const { isOpenRightBar } = useSelector(layoutViewSelector);

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
         <Box
            w="clamp(600px, 100%, 1200px)"
            mx={'auto'}
         // className={s.chatList}
         // style={
         //   {
         //     // maxHeight: innerMaxHeight,
         //     // minHeight: innerMaxHeight,
         //   }
         // }
         >
            {
               !isOpenRightBar && (
                  <Box w={"40px"} />
               )
            }
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
                                    <Image src={'icons/ic-copy-gray.svg'} width={'16px'} height={'16px'} />
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
            {
               !isOpenRightBar && (
                  <Box w={"40px"} />
               )
            }
         </Box>
      </motion.div>
   );
};

export default ChatBox;
