import { Box } from "@chakra-ui/react";
import AgentDetail from "@pages/home/chat-agent/AgentDetail";
import BackupPrivateKey from "@pages/home/chat-agent/BackupPrivateKey";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import { ChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import CreateAgentWallet from "@pages/home/chat-agent/CreateAgentWallet";
import { AgentContext } from "../provider/AgentContext";
import { useContext } from "react";
import s from "./styles.module.scss";

function ChatAgent() {
   const {
      selectedAgent,
      agentWallet,
      isInstalled,
      isCanChat,
      isBackupedPrvKey,
      isRunning,
   } = useContext(AgentContext);

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   return (
      <Box className={s.container}>
         {/* <AgentTopInfo /> */}
         {isCanChat && isRunning ? (
            <ChatAgentProvider>
               <ChatBox />
            </ChatAgentProvider>
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
