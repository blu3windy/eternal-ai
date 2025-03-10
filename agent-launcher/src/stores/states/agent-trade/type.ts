import { EChartType } from "@components/ChartV2";
import { CHAIN_TYPE } from "@constants/chains";

export type AgentsState = {
  typeChart: EChartType.candle;
  timeChart: any;
  currentChain: CHAIN_TYPE;
};
