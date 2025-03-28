import BaseModal from "@components/BaseModal";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { agentTasksProcessingSelector } from "@stores/states/agent-chat/selector";
import { Content } from "agent-server-definition";
import { TaskItem } from "@stores/states/agent-chat/type";

function ProcessingTaskModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
   const pendingTasks = useSelector(agentTasksProcessingSelector);

   const renderIcon = (data: TaskItem) => {
      if (data.status === "processing") {
         return <Image src="icons/ic-loading-bar.gif" alt="loading" width="24px" mixBlendMode="exclusion" />;
      }
      if (data.status === "done") {
         return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M10.0003 1.66699C5.40033 1.66699 1.66699 5.40033 1.66699 10.0003C1.66699 14.6003 5.40033 18.3337 10.0003 18.3337C14.6003 18.3337 18.3337 14.6003 18.3337 10.0003C18.3337 5.40033 14.6003 1.66699 10.0003 1.66699ZM13.3587 8.50034L9.46698 12.3836C9.35031 12.5086 9.19198 12.567 9.02531 12.567C8.86698 12.567 8.70865 12.5086 8.58365 12.3836L6.64199 10.442C6.40033 10.2004 6.40033 9.8003 6.64199 9.55863C6.88366 9.31697 7.28366 9.31697 7.52532 9.55863L9.02531 11.0587L12.4753 7.617C12.717 7.367 13.117 7.367 13.3587 7.617C13.6003 7.85867 13.6003 8.25034 13.3587 8.50034Z"
                  fill="#00AA6C"
               />
            </svg>
         );
      }
      if (data.status === "failed") {
         return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
               <linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#f44f5a" />
                  <stop offset=".443" stop-color="#ee3d4a" />
                  <stop offset="1" stop-color="#e52030" />
               </linearGradient>
               <path
                  fill="url(#hbE9Evnj3wAjjA2RX0We2a)"
                  d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
               />
               <linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#a8142e" />
                  <stop offset=".179" stop-color="#ba1632" />
                  <stop offset=".243" stop-color="#c21734" />
               </linearGradient>
               <path
                  fill="url(#hbE9Evnj3wAjjA2RX0We2b)"
                  d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
               />
            </svg>
         );
      }
      return <></>;
   };

   const renderMessage = (message: Content) => {
      if (typeof message === "string") {
         return message;
      }
      if (Array.isArray(message)) {
         return message
            .filter((item) => {
               return item.type === "text";
            })
            .map((item) => item.text)
            .join(" ");
      }
      return "";
   };
   return (
      <BaseModal
         isShow={isOpen}
         onHide={() => {
            setIsOpen(false);
         }}
         size="small"
         className={styles.popoverContent}
      >
         <Box className={styles.containerOverview}>
            <Text fontSize="22px" fontWeight="600" mb="4" color="white">
               Task processing
            </Text>

            <Box bg="rgba(255, 255, 255, 0.10)" borderRadius="12px" maxHeight={"400px"} overflowY={"auto"} className={styles.taskListScroll}>
               {pendingTasks.length ? (
                  <>
                     {pendingTasks.map((task, index) => (
                        <Flex
                           gap="16px"
                           key={task.id}
                           padding={"16px"}
                           borderBottom={index === pendingTasks.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.10)"}
                           _hover={{
                              cursor: "pointer",
                           }}
                        >
                           <Flex
                              width={"48px"}
                              minWidth={"48px"}
                              height={"48px"}
                              borderRadius={"50%"}
                              border="1px solid rgba(255, 255, 255, 1)"
                              alignItems={"center"}
                              justifyContent={"center"}
                           >
                              {renderIcon(task)}
                           </Flex>
                           <Flex flex={1} flexDirection={"column"} gap={"4px"} overflow={"hidden"}>
                              <Text color="#fff" fontSize={"16px"} fontWeight={"500"} lineHeight={"150%"}>
                                 {task.agent.agent_name || "Agent"}
                              </Text>
                              <Text color="#fff" fontSize={"14px"} fontWeight={"500"} lineHeight={"140%"} overflow={"hidden"} whiteSpace={"nowrap"} opacity={"0.7"}>
                                 {renderMessage(task.message)}
                              </Text>
                           </Flex>
                        </Flex>
                     ))}
                  </>
               ) : (
                  <Flex padding={"16px"} justifyContent={"center"} alignItems={"center"}>
                     <Text color="#fff" fontSize={"16px"} fontWeight={"500"} lineHeight={"150%"}>
                        No task processing
                     </Text>
                  </Flex>
               )}
            </Box>
         </Box>
      </BaseModal>
   );
}

export default ProcessingTaskModal;
