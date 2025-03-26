import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { motion } from "framer-motion";
import { Flex, Image } from "@chakra-ui/react";
import { AgentType } from "@pages/home/list-agent/constants";
import { useMemo } from "react";
import styles from "./styles.module.scss";
import cs from "classnames";


export interface IProps {
   agent: IAgentToken;
   selectedAgent?: IAgentToken;
   onSelectAgent: (agent: IAgentToken) => void;
}

const Item = ({ agent, selectedAgent, onSelectAgent }: IProps) => {

   const isOnline = useMemo(() => agent?.agent_type === AgentType.ModelOnline, [agent?.agent_type]);
   const isSelected = useMemo(() => {
      return selectedAgent?.id === agent?.id;
   }, [selectedAgent, agent]);

   const requirements = useMemo(() => {
      let _str = "";
      if (isOnline) {
         _str = `No need install. Cost ${agent.infer_fee}EAI/prompt`;
      } else {
         const requirements = agent.required_info;
         _str = `Required ${[`Ram: ${requirements.ram || 4}GB`, `Disk: ${requirements.disk || 32}GB`, `Arch: ${requirements.arch || "arm"}`].join(" • ")} `;
      }

      return _str;
   }, [isOnline, agent.infer_fee, agent.required_info]);

   return (
      <Flex
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true }}
         as={motion.div}
         width="100%"
         gap="16px"
         alignItems="center"
         padding="12px 24px"
         className={cs(styles.item, {
            [styles.selected]: isSelected,
         })}
         onClick={() => {
            onSelectAgent(agent);
         }}
      >
         <Image
            src={agent?.thumbnail || agent?.token_image_url || agent?.twitter_info?.twitter_avatar}
            alt={agent?.agent_name}
            boxSize="48px"
            borderRadius="full"
            objectFit="cover"

         />
         <Flex
            flexDirection="column"
            justifyContent="center"
         >
            <Flex
               fontSize="16px"
               fontWeight="500"
               color="rgba(0, 0, 0, 1)"
            >
               {agent?.agent_name} {isOnline ? `(Online)` : ""}
            </Flex>
            <Flex
               fontSize="14px"
               fontWeight="400"
               color="rgba(0, 0, 0, 0.7)"
            >
               {requirements}
            </Flex>
         </Flex>
         <Flex
            width="24px"
            height="24px"
            borderRadius="full"
            border={`1.5px solid ${isSelected ? "#5400FB" : "#99A1A9"}`}
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            marginLeft="auto"
         >
            {isSelected && (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" fill="#5400FB"/>
               </svg>
            )}
         </Flex>
      </Flex>
   );
}

export default Item;