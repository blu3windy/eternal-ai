import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import s from "./styles.module.scss";
import cs from "classnames";
import { compareString } from "@utils/string";
import { useDispatch, useSelector } from "react-redux";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { setTimeChart, TIMERS } from "@stores/states/agent-trade/reducer";
// import { setTimeChart } from "@/stores/states/orderBook/reducer";
// import { orderBookReducerSelector } from "@/stores/states/orderBook/selector";

interface IChartTime {}

const ChartTime: React.FC<IChartTime> = () => {
  const dispatch = useDispatch();
  const timeChart = useSelector(agentsTradeSelector).timeChart;
  return (
    <Flex className={s.containerTimer}>
      <Text mr={"20px"}>Time</Text>
      {TIMERS.map((t) => (
        <Text
          className={cs(
            s.pTime,
            compareString(timeChart?.type, t.type) && s.active
          )}
          key={t.type}
          onClick={() => dispatch(setTimeChart(t))}
        >
          {t.label}
        </Text>
      ))}
    </Flex>
  );
};

export default ChartTime;
