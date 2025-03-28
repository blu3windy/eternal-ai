import { createSlice } from "@reduxjs/toolkit";
import { CommonState } from "./types";

const initialState: CommonState = {
   needReload: 0,
   needReloadList: 0,
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
   },
});

export const { requestReload, requestReloadListAgent } = slice.actions;

export default slice.reducer;
