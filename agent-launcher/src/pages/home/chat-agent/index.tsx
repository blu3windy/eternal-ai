import {Box} from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import {ChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import AgentInfo from "@pages/home/chat-agent/AgentInfo";

function ChatAgent() {
   return (
     <Box className={s.container}>
       <AgentInfo />
       <ChatAgentProvider>
         <ChatBox />
       </ChatAgentProvider>
     </Box>
   );
}

export default ChatAgent;