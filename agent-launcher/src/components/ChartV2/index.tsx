import React, { useContext, useEffect, useRef } from "react";

import { formatCurrency } from "@utils/format";
import { compareString } from "@utils/string";
import { Box } from "@chakra-ui/react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LastPriceAnimationMode,
  LineStyle,
  LineType,
} from "lightweight-charts";
import s from "./styles.module.scss";
import cx from "classnames";
import { CHART_DECIMAL } from "./constants";
import dayjs from "dayjs";

export enum EChartType {
  line = "line",
  candle = "candle",
}

interface TokenChartProps {
  chartData: any[];
  newData?: any[];
  dataSymbol: string;
  chartType?: EChartType;
  priceDecimal?: any;
  className?: any;
}

const ChartV2Module: React.FC<TokenChartProps> = ({
  chartData,
  newData,
  priceDecimal,
  chartType = EChartType.candle,
  className,
}) => {
  const chartContainerRef = useRef<any>();
  const chart = useRef<any>();
  const resizeObserver = useRef<any>();
  const candleChart = useRef<any>();
  const refRenderChart = useRef<any>(false);

  useEffect(() => {
    if (!chart.current && refRenderChart.current === false) {
      refRenderChart.current = true;
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
        layout: {
          textColor: "#000",
          background: { type: ColorType.Solid, color: "#fff" },
        },
        localization: {
          priceFormatter: (p: any) => {
            return formatCurrency(p, priceDecimal, priceDecimal);
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: true,
            color: "#E8E8E8",
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: "#E8E8E8",
          textColor: "rgb(159 163 172)",
          scaleMargins: {
            bottom: 0.15,
            top: 0.15,
          },
        },
        timeScale: {
          borderColor: "#E8E8E8",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 10,
        },
        // watermark: {
        //   text: "eternalai.org",
        //   fontSize: 50,
        //   color: "rgba(0, 0, 0, 0.1)",
        //   visible: true,
        //   vertAlign: "bottom",
        //   horzAlign: "left",
        // },
      });
    }

    return () => {
      chart.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (chart.current && chartContainerRef.current) {
      if (compareString(chartType, EChartType.line)) {
        candleChart.current = chart.current.addAreaSeries({
          lineColor: "#acf8c6",
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
          lastPriceAnimation: LastPriceAnimationMode.Disabled,
          lineType: LineType.Curved,
          topColor: "rgba(172, 248, 199, 0.2)",
        });
        // setTimeout(() => {
        //   chart.current.timeScale().fitContent();
        // }, 200);
      } else {
        candleChart.current = chart.current.addCandlestickSeries({
          upColor: "rgb(14, 203, 129)",
          downColor: "rgb(246, 70, 93)",
          wickUpColor: "rgb(14, 203, 129)",
          wickDownColor: "rgb(246, 70, 93)",
          priceLineStyle: LineStyle.Dashed,
          priceFormat: {
            type: "price",
            precision: CHART_DECIMAL,
            minMove: 0.0000001,
          },
        });
        setTimeout(() => {
          if (chartData.length > 5) {
            chart.current.timeScale().scrollPosition();
          } else {
            chart.current.timeScale().fitContent();
          }
        }, 200);
      }
    }
  }, [chartType, chartData]);

  useEffect(() => {
    if (
      chartData &&
      chartData.length > 0 &&
      chart.current &&
      candleChart.current?.setData
    ) {
      candleChart.current.setData(chartData);
    }
  }, [JSON.stringify(chartData)]);

  useEffect(() => {
    if (newData && newData.length > 0 && chart.current && candleChart.current) {
      candleChart.current.setData(newData);
    }
  }, [JSON.stringify(newData)]);

  return (
    <Box
      ref={chartContainerRef}
      className={cx(s.chartContainer, className)}
    ></Box>
  );
};

export default ChartV2Module;
