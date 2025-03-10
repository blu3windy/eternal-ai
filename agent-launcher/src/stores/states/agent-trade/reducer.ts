import { createSlice } from "@reduxjs/toolkit";
import { AgentsState } from "./type";
import { EChartType } from "@components/ChartV2";
import { CHAIN_TYPE } from "@constants/chains";

export const TIMERS = [
  {
    type: "5min",
    label: "5m",
    default: false,
  },
  {
    type: "30min",
    label: "30m",
    default: true,
  },
  {
    type: "1h",
    label: "1H",
    default: false,
  },
  {
    type: "4h",
    label: "4H",
    default: false,
  },
  {
    type: "1d",
    label: "1D",
    default: false,
  },
];

const initialState: AgentsState = {
  timeChart: TIMERS[1],
  typeChart: EChartType.candle,
  currentChain: CHAIN_TYPE.BASE,
};

const slice = createSlice({
  name: "agentTradeState",
  initialState,
  reducers: {
    setTimeChart: (state, action) => {
      state.timeChart = action.payload;
    },
    setTypeChart: (state, action) => {
      state.typeChart = action.payload;
    },
    setCurrentChain: (state, action) => {
      state.currentChain = action.payload;
    },
  },
});

export const { setTimeChart, setTypeChart, setCurrentChain } = slice.actions;

export default slice.reducer;
