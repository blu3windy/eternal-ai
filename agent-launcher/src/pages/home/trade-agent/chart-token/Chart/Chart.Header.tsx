import { Flex } from "@chakra-ui/react";
import React from "react";
import ChartTime from "./Chart.Time";
import s from "./styles.module.scss";
import ChartType from "./Chart.Type";

const ChartHeader = ({ showChartType }: { showChartType?: boolean }) => {
  return (
    <Flex className={s.headerContainer}>
      <ChartTime />
      {showChartType && <ChartType />}
    </Flex>
  );
};

export default ChartHeader;
