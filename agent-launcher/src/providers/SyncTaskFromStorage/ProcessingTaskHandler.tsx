import { AgentType } from "@pages/home/list-agent/constants";
import AgentAPI from "@services/api/agent";
import { RootState } from "@stores/index";
import { removeTaskItem } from "@stores/states/agent-chat/reducer";
import { agentsChatSelector, agentTasksSelector } from "@stores/states/agent-chat/selector";
import { TaskItem } from "@stores/states/agent-chat/type";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

function ProcessingItem({ data }: { data: TaskItem }) {
   const dispatch = useDispatch();

   useEffect(() => {
      const checkProcessingTask = async () => {
         if (data.id) {
            const threadId = `${data.agent?.id}-${data.agent?.agent_name}`;
            if ([AgentType.Infra, AgentType.CustomPrompt].includes(data?.agentType as any)) {
               try {
                  const res = await AgentAPI.chatAgentUtility({
                     id: data.id,
                     agent: data.agent,
                  } as any);

                  if (res?.status !== 102) {
                     dispatch(
                        removeTaskItem({
                           id: threadId,
                           taskItem: {
                              ...data,
                           },
                        })
                     );
                  } else {
                     setTimeout(() => {
                        checkProcessingTask();
                     }, 30000);
                  }
               } catch (e) {
                  dispatch(
                     removeTaskItem({
                        id: threadId,
                        taskItem: {
                           ...data,
                        },
                     })
                  );
               }
            } else {
               dispatch(
                  removeTaskItem({
                     id: threadId,
                     taskItem: {
                        ...data,
                     },
                  })
               );
            }
         }
      };
      setTimeout(() => {
         checkProcessingTask();
      }, 30000);
   }, []);

   return <></>;
}

function AgentTasks({ tasks }: { tasks: TaskItem[] }) {
   return (
      <>
         {tasks.map((task) => {
            return <ProcessingItem key={task.id} data={task} />;
         })}
      </>
   );
}

function ProcessingTaskHandler() {
   const agentTasks = useSelector(agentTasksSelector);

   const agents = useMemo(() => {
      return Object.entries(agentTasks);
   }, [agentTasks]);

   return (
      <>
         {agents.map((agent) => {
            return <AgentTasks key={`agent-tasks-${agent[0]}`} tasks={agent[1]} />;
         })}
      </>
   );
}

export default ProcessingTaskHandler;
