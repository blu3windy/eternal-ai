import { createSlice } from "@reduxjs/toolkit";
import { CommonState } from "./types";

const initialState: CommonState = {
   needReload: 0,
   needReloadList: 0,
   needReloadMonitor: 0,
   needReloadRecentAgents: 0,
};

const slice = createSlice({
   name: "commonState",
   initialState,
   reducers: {
      requestReload: (state) => {
         state.needReload += 1;
      },
      requestReloadListAgent: (state) => {
         state.needReloadList += 1;
      },
      requestReloadMonitor: (state) => {
         state.needReloadMonitor += 1;
      },
      requestReloadRecentAgents: (state) => {
         state.needReloadRecentAgents += 1;
      },
   },
});

export const { requestReload, requestReloadListAgent, requestReloadMonitor, requestReloadRecentAgents } = slice.actions;

export default slice.reducer;
