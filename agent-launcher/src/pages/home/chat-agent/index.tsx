import { Box, Flex } from "@chakra-ui/react";
import AgentDetail from "@pages/home/chat-agent/AgentDetail";
import BackupPrivateKey from "@pages/home/chat-agent/BackupPrivateKey";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import { ChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import CreateAgentWallet from "@pages/home/chat-agent/CreateAgentWallet";
import { AgentContext } from "../provider/AgentContext";
import { useContext } from "react";
import s from "./styles.module.scss";
import AgentTopInfo from "./AgentTopInfo";
import useAgentState from "../provider/useAgentState";
import BaseModal from "@components/BaseModal";
import RatingForm from "./Rating/RatingForm";

function ChatAgent() {
   const {
      selectedAgent,
      agentWallet,
      isInstalled,
      isCanChat,
      isBackupedPrvKey,
      isRunning,
   } = useContext(AgentContext);
   const { isSearchMode, showSearchDetail } = useAgentState();

   const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

   // const isAllowChat = useMemo(() => {
   //    return ![AgentType.Model].includes(selectedAgent?.agent_type);
   // }, [selectedAgent]);

   if (isSearchMode && showSearchDetail) {
      return (
         <Box className={s.container}>
            <AgentDetail />
         </Box>
      );
   }

   return (
      <Box className={s.container}>
         {/* <AgentTopInfo /> */}
         {isCanChat && isRunning ? (
            <Box>
               <AgentTopInfo />
               <ChatBox />
            </Box>
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
         <BaseModal
            isShow={true}
            onHide={() => {}}
         >
            <RatingForm
               onClose={() => {}}
            />
         </BaseModal>
      </Box>
   );
}

export default ChatAgent;
