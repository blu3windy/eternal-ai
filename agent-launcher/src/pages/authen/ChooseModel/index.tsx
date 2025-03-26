import { Center, Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import CAgentTokenAPI from "@services/api/agents-token";
import { AgentType } from "@pages/home/list-agent/constants";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import Item from "@pages/authen/ChooseModel/Item.tsx";
import Loading from "@components/Loading";
import BaseButton from "@components/BaseButton";
import throttle from "lodash/throttle";
import storageModel from "@storage/StorageModel.ts";
import { BASE_CHAIN_ID } from "@constants/chains.ts";
import CAgentContract from "@contract/agent";
import { getSetupAgents } from "@pages/authen/ChooseModel/utils.ts";

interface IProps {
    onNext?: (agent: IAgentToken) => Promise<void>;
}

export const getModelAgentHash = async (agent: IAgentToken) => {
   if (agent && !!agent.agent_contract_address) {
      const chainId = agent?.network_id || BASE_CHAIN_ID;
      const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: chainId });
      const codeVersion = await cAgent.getCurrentVersion();
      const ipfsHash = await cAgent.getAgentCode(codeVersion);
      return ipfsHash?.replaceAll('\n', '');
   }
}


const ChooseModel = ({ onNext }: IProps) => {
   const agentAPI = useRef(new CAgentTokenAPI());
   const [agents, setAgents] = useState<IAgentToken[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [selectedAgent, setSelectedAgent] = useState<IAgentToken | undefined>(undefined);
   const [submitting, setSubmitting] = useState<boolean>(false);
   const _onNext = throttle(useCallback(async () => {
      if (!selectedAgent) return;
      try {
         const hash = await getModelAgentHash(selectedAgent);
         setSubmitting(true);
         if (!hash) {
            throw new Error('Model hash not found');
         }
         await storageModel.setActiveModel({
            id: selectedAgent.id,
            agent_id: selectedAgent.agent_id,
            agent_type: selectedAgent.agent_type,
            hash: hash,
         } as any)

         const electronAPI = window?.electronAPI;
         if (selectedAgent.agent_type === AgentType.Model) {
            await electronAPI?.modelInstallBaseModel(hash)
         }
         // await electronAPI?.modelInstall
         if (onNext) {
            await onNext(selectedAgent);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setSubmitting(false);
      }

   }, [onNext, selectedAgent]), 2000);

   const fetchData = async () => {
      try {
         setLoading(true);
         const {
            agents
         } = await agentAPI.current.getAgentTokenList({
            agent_types: [AgentType.ModelOnline, AgentType.Model].join(','),
         });
         const _agents = await getSetupAgents(agents);
         setAgents(_agents);
         setSelectedAgent(_agents[0]);
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
         <BaseButton
            onClick={_onNext}
            maxW="304px"
            alignSelf="center"
            isDisabled={!selectedAgent || submitting}
            isLoading={submitting}
         >
            Next
         </BaseButton>
      </Flex>
   );
}

export default ChooseModel;