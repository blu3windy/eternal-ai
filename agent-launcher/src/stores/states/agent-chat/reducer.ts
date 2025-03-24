import { createSlice } from "@reduxjs/toolkit";
import { AgentChatState, TaskItem } from "./type";
import localStorageService from "@storage/LocalStorageService";
import { CHAT_AGENT_TASKS_STATE_STORAGE_KEY } from "./constants";

const initialState: AgentChatState = {
   agentTasks: {},
};

const slice = createSlice({
   name: "agentChatState",
   initialState,
   reducers: {
      initTaskItems: (state: AgentChatState, action: { payload: { data: Record<string, TaskItem[]> } }) => {
         if (!Object.keys(state.agentTasks).length) {
            state.agentTasks = action.payload.data;

            // update storage
            localStorageService.setItem(CHAT_AGENT_TASKS_STATE_STORAGE_KEY, JSON.stringify(state.agentTasks));
         }
      },
      addOrUpdateTaskItem: (state: AgentChatState, action: { payload: { id: string; taskItem: TaskItem } }) => {
         const { id, taskItem } = action.payload;
         if (taskItem.id) {
            const tasks = state.agentTasks[id] || [];
            const foundIndex = tasks.findIndex(item => item.id === taskItem.id)
            if (foundIndex !== -1) {
               tasks[foundIndex] = {
                  ...tasks[foundIndex],
                  ...taskItem
               };

               state.agentTasks[id] = [
                  ...tasks,
               ];
            } else {
               state.agentTasks[id] = [
                  ...state.agentTasks[id] || [],
                  taskItem
               ];
            }
            // update storage
            localStorageService.setItem(CHAT_AGENT_TASKS_STATE_STORAGE_KEY, JSON.stringify(state.agentTasks));
         }
      },
      removeTaskItem: (state: AgentChatState, action: { payload: { id: string; taskItem: TaskItem } }) => {
         const { id, taskItem } = action.payload;
         state.agentTasks[id] = [...(state.agentTasks[id] || []).filter(item => item.id !== taskItem.id)];
         // update storage
         localStorageService.setItem(CHAT_AGENT_TASKS_STATE_STORAGE_KEY, JSON.stringify(state.agentTasks));
      }
   },
});

export const {
   initTaskItems,
   addOrUpdateTaskItem,
   removeTaskItem,
} = slice.actions;

export default slice.reducer;
