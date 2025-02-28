import {Box, Button, Flex, Text, Image} from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import {ChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import AgentInfo from "@pages/home/chat-agent/AgentInfo";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";

function ChatAgent() {
  const { selectedAgent, isInstalled, installAgent } = useContext(AgentContext);

  const description = selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

  const handleInstall = () => {
    installAgent(selectedAgent);
  }

   return (
     <Box className={s.container}>
       <AgentInfo />
       {
         isInstalled ? (
           <ChatAgentProvider>
             <ChatBox />
           </ChatAgentProvider>
         ) : (
           <Flex className={s.installContainer} direction={"column"} w={'100%'} alignItems={"center"} gap={"20px"}>
             <Flex direction={"column"} alignItems={"center"}>
               <Image src="/images/bg-agent-chat.png" w={"80%"}/>
               <Text className={s.nameText} mt={"-60px"}>{selectedAgent?.agent_name}</Text>
             </Flex>
             {
               description && (
                 <Text className={s.descriptionText}>{description}</Text>
               )
             }
             <Button className={s.btnInstall} onClick={handleInstall}>Install</Button>
           </Flex>
         )
       }

     </Box>
   );
}

export default ChatAgent;