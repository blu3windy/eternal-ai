// import { orderBookReducerSelector } from "@/stores/states/orderBook/selector";
import { Box, Flex } from "@chakra-ui/react";
import cs from "classnames";
import { useDispatch } from "react-redux";
import s from "./styles.module.scss";

const ChartType = () => {
  // const typeChart = useSelector(orderBookReducerSelector).typeChart;
  const dispatch = useDispatch();
  return (
    <Flex className={s.typeChartContainer}>
      <Box
        className={cs(
          s.btnTypeChart
          // compareString(typeChart, EChartType.candle) && s.active
        )}
        // onClick={() => dispatch(setTypeChart(EChartType.candle))}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 19h1v3h2v-3h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H9V2H7v3H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zM7 7h2v10H7zm7 10h1v3h2v-3h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V4h-2v3h-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm1-8h2v6h-2z"></path>
        </svg>
      </Box>
      <Box
        className={cs(
          s.btnTypeChart
          // compareString(typeChart, EChartType.line) && s.active
        )}
        // onClick={() => dispatch(setTypeChart(EChartType.line))}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"></path>
        </svg>
      </Box>
    </Flex>
  );
};

export default ChartType;
