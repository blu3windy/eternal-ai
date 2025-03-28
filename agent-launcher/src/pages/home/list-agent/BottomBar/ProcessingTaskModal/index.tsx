import BaseModal from "@components/BaseModal";
import styles from "./styles.module.scss";
import { useCallback, useEffect, useState } from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { agentTasksProcessingSelector } from "@stores/states/agent-chat/selector";
import { TaskItem } from "@stores/states/agent-chat/type";
import { motion } from "framer-motion";
import uniqBy from "lodash.uniqby";

function TaskItemRenderer({ task, isLast, onRemoveTask }: { task: TaskItem; isLast: boolean; onRemoveTask: (taskId: string) => void }) {
   useEffect(() => {
      if (task.status === "done" || task.status === "failed") {
         setTimeout(() => {
            onRemoveTask(task.id);
         }, 5000);
      }
   }, [task.status, onRemoveTask, task.id]);

   const renderIcon = () => {
      if (task.status === "processing") {
         return <Image src="icons/ic-loading-bar.gif" alt="loading" width="24px" mixBlendMode="exclusion" />;
      }
      if (task.status === "done") {
         return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M16.556 1H7.444L1 7.444V16.555L7.444 22.999H16.555L22.999 16.555V7.444L16.556 1ZM10.532 16.446L6.587 12.5L8.001 11.086L10.47 13.554L15.94 7.587L17.415 8.939L10.533 16.446H10.532Z"
                  fill="#00FFA2"
               />
            </svg>
         );
      }
      if (task.status === "failed") {
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

   const renderMessage = () => {
      if (typeof task.message === "string") {
         return task.message;
      }
      if (Array.isArray(task.message)) {
         return task.message
            .filter((item) => {
               return item.type === "text";
            })
            .map((item) => item.text)
            .join(" ");
      }
      return "";
   };

   const getItemBorder = () => {
      if (task.status === "done") {
         return "1px solid #00FFA2";
      }
      if (task.status === "failed") {
         return "1px solid #ba1632";
      }
      return "1px solid rgba(255, 255, 255, 1)";
   };

   return (
      <Flex
         gap="16px"
         key={task.id}
         padding={"16px"}
         // borderBottom={isLast ? "none" : "1px solid rgba(255, 255, 255, 0.10)"}
         borderBottom={"1px solid rgba(255, 255, 255, 0.10)"}
         _hover={{
            cursor: "pointer",
         }}
         as={motion.div}
         initial={{
            transform: "translateX(0%)",
         }}
         animate={{ transform: "translateX(0%)" }}
         exit={{
            transform: "translateX(100%)",
         }}
      >
         <Flex width={"48px"} minWidth={"48px"} height={"48px"} borderRadius={"50%"} border={getItemBorder()} alignItems={"center"} justifyContent={"center"}>
            {renderIcon()}
         </Flex>
         <Flex flex={1} flexDirection={"column"} gap={"4px"} overflow={"hidden"}>
            <Text color="#fff" fontSize={"16px"} fontWeight={"500"} lineHeight={"150%"}>
               {task.agent.agent_name || "Agent"}
            </Text>
            <Text color="#fff" fontSize={"14px"} fontWeight={"500"} lineHeight={"140%"} overflow={"hidden"} whiteSpace={"nowrap"} opacity={"0.7"}>
               {renderMessage()}
            </Text>
         </Flex>
      </Flex>
   );
}

function ProcessingTaskModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
   const pendingTasks = useSelector(agentTasksProcessingSelector);

   const [renderTasks, setRenderTasks] = useState<TaskItem[]>(pendingTasks);

   useEffect(() => {
      setRenderTasks((prev) => {
         const newTasks = prev.map((task) => {
            const foundedIndex = pendingTasks.findIndex((t) => t.id === task.id);
            if (foundedIndex !== -1) {
               return {
                  ...task,
                  status: pendingTasks[foundedIndex].status,
               };
            }
            return task;
         });
         return uniqBy([...newTasks, ...pendingTasks], "id");
      });
   }, [pendingTasks]);

   const onRemoveTask = useCallback((taskId: string) => {
      setRenderTasks((prev) => {
         return prev.filter((task) => task.id !== taskId);
      });
   }, []);

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

            <Box
               bg="rgba(255, 255, 255, 0.10)"
               borderRadius="12px"
               minHeight={"400px"}
               maxHeight={"400px"}
               overflowY={"auto"}
               overflowX={"hidden"}
               className={styles.taskListScroll}
            >
               {renderTasks.length ? (
                  <>
                     {renderTasks.map((task, index) => (
                        <TaskItemRenderer key={task.id} task={task} isLast={index === renderTasks.length - 1} onRemoveTask={onRemoveTask} />
                     ))}
                  </>
               ) : (
                  <Flex height={"400px"} padding={"16px"} justifyContent={"center"} alignItems={"center"}>
                     <Text color="#fff" fontSize={"16px"} fontWeight={"500"} lineHeight={"150%"}>
                        No task
                     </Text>
                  </Flex>
               )}
            </Box>
         </Box>
      </BaseModal>
   );
}

export default ProcessingTaskModal;
