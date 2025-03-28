import { RootState } from "@stores/index";

export const agentsChatSelector = (state: RootState) => state.agentChat;

export const agentTasksSelector = (state: RootState) => {
   return state.agentChat.agentTasks || {};
};

export const totalPendingTasksSelector = (state: RootState) => {
   return Object.values(state.agentChat.agentTasks || {})
      .flat()
      .filter((item) => item.status === "processing").length;
};
