import { Center, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import CAgentTokenAPI from "@services/api/agents-token";
import { AgentType } from "@pages/home/list-agent";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import Item from "@pages/authen/ChooseModel/Item.tsx";
import Loading from "@components/Loading";
import BaseButton from "@components/BaseButton";

const ChooseModel = () => {
   const agentAPI = useRef(new CAgentTokenAPI());
   const [agents, setAgents] = useState<IAgentToken[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [selectedAgent, setSelectedAgent] = useState<IAgentToken | undefined>(undefined);

   const fetchData = async () => {
      try {
         setLoading(true);
         const {
            agents
         } = await agentAPI.current.getAgentTokenList({
            agent_types: [AgentType.ModelOnline, AgentType.Model].join(','),
         });
         console.log('agents', agents);
         setAgents(agents);
         setSelectedAgent(agents[0]);
      } catch (error) {
         console.log('agents error', error);
         console.error(error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchData().then().catch();
   }, [])

   return (
      <Flex
         flexDirection="column"
         maxWidth="580px"
         gap="32px"
      >
         <Flex flexDirection="column" gap="20px">
            <Text
               fontSize="28px"
               fontWeight="500"
               textAlign="center"
               color="rgba(0, 0, 0, 1)"
            >
               Setup model
            </Text>
            <Text
               fontSize="18px"
               fontWeight="400"
               textAlign="center"
               color="rgba(0, 0, 0, 0.7)"
            >
               Choose model you want and suit for your device. You can change this after
            </Text>
         </Flex>
         <Flex
            flexDirection="column"
            gap="16px"
            maxH="360px"
            overflowY="auto"
            css={{
               '&::-webkit-scrollbar': {
                  width: '3px',
               },
               '&::-webkit-scrollbar-track': {
                  background: 'transparent',
               },
               '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 'full',
               },
            }}
         >
            {loading && <Center><Loading /></Center>}
            {agents.map((item) => (
               <Item
                  key={item.id}
                  agent={item}
                  selectedAgent={selectedAgent}
                  onSelectAgent={(agent) => {
                     setSelectedAgent(agent);
                  }}
               />
            ))}
         </Flex>
         <BaseButton maxW="304px" alignSelf="center">
            Next
         </BaseButton>
      </Flex>
   );
}

export default ChooseModel;