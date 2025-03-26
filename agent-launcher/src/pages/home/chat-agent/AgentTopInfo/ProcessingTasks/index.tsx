import {
   Box,
   Circle,
   Divider,
   Flex,
   Image,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Text,
   useDisclosure,
} from "@chakra-ui/react";
import s from "./styles.module.scss";
import cs from "classnames";
import { useContext, useEffect, useMemo } from "react";
import { useChatAgentProvider } from "../../ChatAgent/provider";
import { motion } from "framer-motion";
import { TaskItem } from "@stores/states/agent-chat/type";
import { throttle } from "lodash";
import { removeTaskItem } from "@stores/states/agent-chat/reducer";
import { AgentType } from "@pages/home/list-agent/constants";
import AgentAPI from "@services/api/agent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@stores/index";
import { AgentContext } from "@pages/home/provider";

type Props = {
   className?: string;
};

function ProcessingItem({ data, onClose }: { data: TaskItem, onClose: () => void }) {
   const dispatch = useDispatch();
   
   useEffect(() => {
      const checkProcessingTask = async () => {
         if (data.id) {
            const threadId = `${data.agent?.id}-${data.agent?.agent_name}`;
            if ([AgentType.Infra, AgentType.CustomPrompt].includes(data?.agentType as any)) {
               try {
                  const res = await AgentAPI.chatAgentUtility({
                     id: data.id,
                     agent: data.agent
                  } as any);

                  if (res?.status !== 102) {
                     dispatch(removeTaskItem({
                        id: threadId,
                        taskItem: {
                           ...data,
                        }
                     }));
                  } else {
                     setTimeout(() => {
                        checkProcessingTask();
                     }, 5000);
                  }
               } catch (e) {
                  dispatch(removeTaskItem({
                     id: threadId,
                     taskItem: {
                        ...data,
                     }
                  }));
               }
            }
         }
      }
      setTimeout(() => {
         checkProcessingTask();
      }, 5000);
   }, [data.status]);

   const renderIcon = () => {
      if (data.status === 'processing') {
         return (
            <Image
               src="icons/ic-loading-bar.gif"
               alt="loading"
               width="20px"
               mixBlendMode="exclusion"
            />
         )
      }
      if (data.status === 'done') { 
         return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M10.0003 1.66699C5.40033 1.66699 1.66699 5.40033 1.66699 10.0003C1.66699 14.6003 5.40033 18.3337 10.0003 18.3337C14.6003 18.3337 18.3337 14.6003 18.3337 10.0003C18.3337 5.40033 14.6003 1.66699 10.0003 1.66699ZM13.3587 8.50034L9.46698 12.3836C9.35031 12.5086 9.19198 12.567 9.02531 12.567C8.86698 12.567 8.70865 12.5086 8.58365 12.3836L6.64199 10.442C6.40033 10.2004 6.40033 9.8003 6.64199 9.55863C6.88366 9.31697 7.28366 9.31697 7.52532 9.55863L9.02531 11.0587L12.4753 7.617C12.717 7.367 13.117 7.367 13.3587 7.617C13.6003 7.85867 13.6003 8.25034 13.3587 8.50034Z" fill="#00AA6C"/>
            </svg>
         )
      }
      if (data.status === 'failed') { 
         return (
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="20px" height="20px"><linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"/><stop offset=".443" stop-color="#ee3d4a"/><stop offset="1" stop-color="#e52030"/></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2a)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"/><linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a8142e"/><stop offset=".179" stop-color="#ba1632"/><stop offset=".243" stop-color="#c21734"/></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"/></svg>
         )
      }
      return <></>
   }
   const renderMessage = () => {
      if (typeof data.message === 'string') {
         return data.message;
      }
      if (Array.isArray(data.message)) {
         return data.message.filter((item) => {
            return item.type === 'text';
         }).map(item => item.text).join(' ');
      }
      return ''
   }
   return (
      <Box
         minHeight={"80px"}
         padding="16px"
         className={s.item}
         as={motion.div}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         cursor={"pointer"}
         _hover={{
            bg: '#F8F9FA',
         }}
         onClick={onClose}
      >
         <Flex gap="16px">
            <Box
               width={"48px"}
               minWidth={"48px"}
               height={'48px'}
               borderRadius={"50%"}
               bg="#F8F9FA"
               border="1px solid #E5E7EB"
               display="flex"
               justifyContent="center"
               alignContent={"center"}
               alignItems={"center"}
            >
               {renderIcon()}
            </Box>
            <Flex direction={"column"} justifyContent={"center"}>
               {/* <Text
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  color="black"
                  fontSize={"16px"}
                  fontWeight={"500"}
               >{data.title}</Text> */}
               <Text
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  // whiteSpace={"nowrap"}
                  noOfLines={2}
                  color="black"
                  fontSize={"16px"}
                  fontWeight={"500"}
                  opacity={"0.7"}
               >{renderMessage()}</Text>
            </Flex>
         </Flex>
      </Box>
   );
}


function ProcessingTasks({ className }: Props) {
   const {
      selectedAgent,
   } = useContext(AgentContext);
   const threadId = `${selectedAgent?.id}-${selectedAgent?.agent_name}`;

   const agentTasks = useSelector((state: RootState) => state.agentChat.agentTasks || {});

   const taskItems = useMemo(() => { 
      return agentTasks[threadId] || [];
   }, [agentTasks, threadId])

   const { isOpen, onOpen, onClose } = useDisclosure();

   const isDisabled = useMemo(() => {
      return false;
   }, []);

   const isHaveProcessingTask = useMemo(() => {
      return taskItems.find(item => item.status === 'processing');
   }, [taskItems])

   const totalTask = useMemo(() => {
      return taskItems.length;
   }, [taskItems.length]);

   const renderTasks = () => {
      return taskItems.map((task) => (<ProcessingItem onClose={onClose} key={`task_${task.id}`} data={task} />))
   }

   const renderIcon = () => {
      if (isHaveProcessingTask) {
         return (
            <Image
               src="icons/ic-loading-bar.gif"
               alt="loading"
               width="20px"
               mixBlendMode="exclusion"
            />
         )
      }
      return <></>
   }

   if (totalTask) {
      return (
         <Box className={cs(s.container, className)}>
            <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose}>
               <PopoverTrigger>
                  <Flex
                     className={s.dropboxButton}
                     pl="20px"
                     onClick={isDisabled ? undefined : onOpen}
                     cursor={isDisabled ? "not-allowed" : "pointer"}
                  >
                     {renderIcon()}
                     <Box flex={1}>{totalTask} {totalTask === 1 ? 'task' : 'tasks'}</Box>
                  </Flex>
               </PopoverTrigger>
               <PopoverContent
                  width={"100%"}
                  maxW={"400px"} 
                  className={s.poperContainer}
                  border={"1px solid #E5E7EB"}
                  boxShadow={"0px 0px 24px -6px #0000001F"}
                  borderRadius={"16px"}
                  background={"#fff"}
                  minW={"400px"}
                  padding="0px"
                  overflow={"hidden"}
               >
                  <Flex
                     direction={"column"}
                     className={s.poperContainer__box}
                     maxHeight={"220px"}
                     overflow={"auto"}
                  >{renderTasks()}</Flex>
               </PopoverContent>
            </Popover>
         </Box>
      );
   }
   return <Box></Box>
}

export default ProcessingTasks;
