import { Box } from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import { ChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import React, { useContext, useMemo } from "react";
import { AgentContext } from "@pages/home/provider";
import BackupPrivateKey from "@pages/home/chat-agent/BackupPrivateKey";
import CreateAgentWallet from "@pages/home/chat-agent/CreateAgentWallet";
import AgentDetail from "@pages/home/chat-agent/AgentDetail";
import { AgentType } from "@pages/home/list-agent";

function ChatAgent() {
   const {
      selectedAgent,
      agentWallet,
      isInstalled,
      isCanChat,
      isBackupedPrvKey,
      isCustomUI,
   } = useContext(AgentContext);

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   return (
      <Box className={s.container}>
         {/* <AgentTopInfo /> */}
         {isCanChat ? (
            <>
            {
               isCustomUI ? (
                  <Box />
               ) : (
                  <ChatAgentProvider>
                     <ChatBox />
                  </ChatAgentProvider>
               )
            }
            </>
         ) : (
            <>
               {
                  showBackupPrvKey ? (
                     <BackupPrivateKey />
                  ) : (
                     <>
                        {
                           isInstalled && selectedAgent?.required_wallet && !agentWallet ? (
                              <CreateAgentWallet />
                           ) : (
                              <AgentDetail />
                           )
                        }
                     </>
                  )
               }
            </>
         )}
      </Box>
   );
}

export default ChatAgent;
