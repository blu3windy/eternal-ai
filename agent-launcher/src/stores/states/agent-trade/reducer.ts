import { createSlice } from "@reduxjs/toolkit";
import { AgentsState } from "./type";
import { EChartType } from "@components/ChartV2";

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
  },
});

export const { setTimeChart, setTypeChart } = slice.actions;

export default slice.reducer;
