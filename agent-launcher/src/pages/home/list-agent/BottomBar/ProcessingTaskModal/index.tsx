import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { CollapseIcon } from "@components/CustomMarkdown/Files/icons";
import { DefaultAvatar } from "@components/DefaultAvatar";
import { agentTasksProcessingSelector, totalPendingTasksSelector } from "@stores/states/agent-chat/selector";
import { TaskItem } from "@stores/states/agent-chat/type";
import { changeLayout } from "@stores/states/layout-view/reducer";
import cx from "classnames";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import uniqBy from "lodash.uniqby";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./styles.module.scss";
import { removeTaskItem } from "@stores/states/agent-chat/reducer";

dayjs.extend(duration);

const TaskStatus = {
   Processing: 'processing',
   Done: 'done',
   Failed: 'failed',
};

const TaskStatusText = {
   [TaskStatus.Processing]: 'Processing',
   [TaskStatus.Done]: 'Done',
   [TaskStatus.Failed]: 'Failed',
};

export const ProcessingTaskModalId = 'processing-task-modal';

function TaskItemRenderer({ task, isLast, onRemoveTask }: { task: TaskItem; isLast: boolean; onRemoveTask: (taskId: string) => void }) {
   // useEffect(() => {
   //    if (task.status === "done" || task.status === "failed") {
   //       setTimeout(() => {
   //          onRemoveTask(task.id);
   //       }, 5000);
   //    }
   // }, [task.status, onRemoveTask, task.id]);

   const [hours, setHours] = useState<number | null>(0);
   const [minutes, setMinutes] = useState<number | null>(0);
   const [seconds, setSeconds] = useState<number | null>(0);

   console.log('stephen: TaskItemRenderer', task);

   const calcTime = () => {
      const diff = dayjs.duration(dayjs().diff(dayjs(task?.createdAt)));
      if (diff.milliseconds() <= 0) {
         setHours(null);
         setMinutes(null);
         setSeconds(null);
         return;
      }
      setHours(diff.hours());
      setMinutes(diff.minutes());
      setSeconds(diff.seconds());
   };

   useEffect(() => {
      if (task?.createdAt) {
         calcTime();
      }
   }, [task]);

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

   const token = task?.agent;

   const avatarUrl
      = token?.thumbnail
      || token?.token_image_url
      || token?.twitter_info?.twitter_avatar;

   const iconSize = '36px';

   return (
      <Flex
         className={s.taskItem}
         key={task.id}
         direction="column"
         gap={"20px"}
         cursor={"pointer"}
         onClick={() => {
            if (task.status === "done" || task.status === "failed") {
               onRemoveTask(task.id);
            }
         }}
      >
         <Flex gap="12px">
            <Flex position={"relative"}>
               {avatarUrl ? (
                  <Image
                     w={iconSize}
                     objectFit={'cover'}
                     src={avatarUrl}
                     maxHeight={iconSize}
                     maxWidth={iconSize}
                     borderRadius={'50%'}
                  />
               ) : (
                  <DefaultAvatar
                     width={iconSize}
                     height={iconSize}
                     name={token?.display_name || token?.agent_name}
                     fontSize={14}
                  />
               )}
            </Flex>
            <Flex justifyContent={"space-between"} w={"100%"} gap={"8px"}>
               <Flex flexDirection="column" gap={"8px"}>
                  <Text className={s.nameText}>
                     {token?.display_name || token?.agent_name}{' '}
                  </Text>
                  <Text className={s.timeText}>{`${hours && hours > 0 ? `${hours}h` : ""} ${minutes && minutes > 0 ? `${minutes}m` : ""} ${seconds && seconds > 0 ? `${seconds}s` : ""}`.trim()}</Text>
               </Flex>
               <Text className={cx(s.status, s[task.status])}>{TaskStatusText[task.status]}</Text>
            </Flex>
         </Flex>
         <Flex flexDirection={"column"} gap={"4px"}>
            <Text color="#000" fontSize={"15px"} fontWeight={"500"} lineHeight={"140%"} overflow={"hidden"}>
               {renderMessage()}
            </Text>
            <Text color="#000" fontSize={"13px"} fontWeight={"400"} lineHeight={"140%"} opacity={"0.7"}>
               {renderMessage()}
            </Text>
         </Flex>
         {/* <Flex width={"48px"} minWidth={"48px"} height={"48px"} borderRadius={"50%"} border={getItemBorder()} alignItems={"center"} justifyContent={"center"}>
            {renderIcon()}
         </Flex> */}
      </Flex>
   );
}

function ProcessingTaskModal() {
   const dispatch = useDispatch();
   const pendingTasks = useSelector(agentTasksProcessingSelector);
   const totalPendingTasks = useSelector(totalPendingTasksSelector);

   const onRemoveTask = useCallback((task: TaskItem) => {
      const threadId = `${task?.agent?.id}-${task?.agent?.agent_name}`;
      dispatch(
         removeTaskItem({
            id: threadId,
            taskItem: task,
         })
      );
   }, []);

   return (
      <Box className={s.containerOverview}>
         <Flex w={'100%'} justifyContent={'flex-end'} p={"12px 24px"}>
            <Button className={cx(s.btnTaskProcessing)} leftIcon={<CollapseIcon />} onClick={() => {
               dispatch(changeLayout({
                  isOpenAgentBar: true,
                  isOpenRightBar: false,
                  rightBarView: undefined,
                  rightBarId: undefined
               }))
            }}>
               {totalPendingTasks > 0 ? `${totalPendingTasks} tasks processing` : ''}
            </Button>
         </Flex>

         <Box
            className={s.taskListScroll}
         >
            {pendingTasks.length ? (
               <>
                  {pendingTasks.map((task, index) => (
                     <TaskItemRenderer key={task.id} task={task} isLast={index === pendingTasks.length - 1} onRemoveTask={() => onRemoveTask(task)} />
                  ))}
               </>
            ) : (
               <Flex mt={"80px"} padding={"16px"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={"32px"}>
                  <Image src="icons/ic-no-processing-task.svg" alt="empty" width={"188px"} height={"140px"} />
                  <Text color="#34343F" fontSize={"18px"} fontWeight={"600"} lineHeight={"150%"}>
                     No task running
                  </Text>
               </Flex>
            )}
         </Box>
      </Box>
   );
}

export default ProcessingTaskModal;
