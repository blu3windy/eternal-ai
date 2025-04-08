import { createSlice } from "@reduxjs/toolkit";
import { FloatingWebViewState } from "./type";


const DEFAULT_POSITION = 'bottom-right';
const initialState: FloatingWebViewState = {
   isOpen: false,
   url: "",
   viewPosition: DEFAULT_POSITION,
   isMaximized: false,
   task: '',
   taskProcessing: ''
};

const slice = createSlice({
   name: "floatingWebView",
   initialState,
   reducers: {
      reset: (state: FloatingWebViewState) => {
         state.isOpen = false;
         state.url = "";
         state.viewPosition = DEFAULT_POSITION;
         state.isMaximized = false;
         state.task = '';
         state.taskProcessing = '';
      },
      openWithUrl: (
         state: FloatingWebViewState,
         action: {
            payload: {
               url: string;
               task: '' | 'Searching';
               taskProcessing?: string;
            };
         }
      ) => {
         state.isOpen = true;
         state.url = action.payload.url;
         state.viewPosition = DEFAULT_POSITION;
         state.task = action.payload.task;
         state.taskProcessing = action.payload.taskProcessing;
      },
      toggleMaximize: (state: FloatingWebViewState, action: { payload: boolean }) => {
         state.isMaximized = action.payload;
      },
   },
});

export const { reset, openWithUrl, toggleMaximize } = slice.actions;

export default slice.reducer;
