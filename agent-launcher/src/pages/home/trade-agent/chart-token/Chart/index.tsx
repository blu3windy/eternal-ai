import ChartV2Module from "@components/ChartV2";
import { CHART_DECIMAL, IPriceChartData } from "@components/ChartV2/constants";

import { Box, Center, Text } from "@chakra-ui/react";
import AppLoading from "@components/AppLoading";
import { AgentContext } from "@pages/home/provider/AgentContext";
import CAgentTokenAPI from "@services/api/agents-token";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { compareString } from "@utils/string";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { sortBy, uniqBy } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChartHeader from "./Chart.Header";
import s from "./styles.module.scss";

export const TRADE_TIME_INTERVAL = 5000;

const PumpTradeChart = () => {
   const { selectedAgent, tradePlatform, coinPrices } = useContext(AgentContext);
   const pumpApi = useRef(new CAgentTokenAPI()).current;

   const pumpToken = selectedAgent;

   const [chartData, setChartData] = useState<IPriceChartData[]>([]);
   const [newChartData, setNewChartData] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   const timeChart = useSelector(agentsTradeSelector).timeChart;
   const typeChart = useSelector(agentsTradeSelector).typeChart;

   const timeInterval = useRef<any>();
   const refIsLoaded = useRef(true);
   const refCurrentChartData = useRef<any[]>([]);

   const convertBTCToSats = (value: string) => {
      if (compareString(pumpToken?.meme?.base_token_symbol, "BTC")) {
         const satAmount = new BigNumber(value).multipliedBy(1e8);
         if (new BigNumber(satAmount).isLessThan(1e4)) {
            return parseFloat(new BigNumber(satAmount).toFixed(2));
         }
      }
      return parseFloat(
         new BigNumber(value)
            .multipliedBy(coinPrices?.[pumpToken?.meme?.base_token_symbol as any])
            .toFixed(CHART_DECIMAL)
      );
   };

   const parseData = (resChart: any[]) => {
      const chartData = (resChart as unknown as any[]).map((v: any) => {
         return {
            ...v,
            timestamp: dayjs(v.chart_time).unix(),
         };
      });
      const sortedData = uniqBy(
         sortBy(chartData || [], "timestamp"),
         (item: any) => item.timestamp
      );

      const _data = sortedData?.map((v: any) => {
         return {
            id: v.timestamp,
            value: convertBTCToSats(v.close_price),
            time: Number(dayjs(v.chart_time).unix()),
            open: convertBTCToSats(v.open_price),
            high: convertBTCToSats(v.max_price),
            close: convertBTCToSats(v.close_price),
            low: convertBTCToSats(v.min_price),
         };
      });

      return _data;
   };

   const getData = async () => {
      try {
         setLoading(true);
         if (!pumpToken?.token_address) {
            throw "Token not found";
         }
         const [resChart] = await Promise.all([
            pumpApi.getAgentTradeChart({
               token_address: pumpToken?.token_address,
               params: {
                  type: timeChart,
               },
            }),
         ]);

         const _data: IPriceChartData[] = parseData(
          resChart as unknown as any[]
         ) as unknown as IPriceChartData[];

         refCurrentChartData.current = _data;

         setChartData(_data);
      } catch (error) {
         console.log("error >>>>>>>", error);
      } finally {
         setLoading(false);
      }
   };

   const onNewData = async () => {
      try {
         if (!pumpToken?.token_address || !refIsLoaded.current) {
            throw "Token not found";
         }
         refIsLoaded.current = false;

         const [resChart] = await Promise.all([
            pumpApi.getAgentTradeChart({
               token_address: pumpToken?.token_address,
               params: {
                  type: timeChart,
               },
            }),
         ]);

         const _newData = parseData(resChart as unknown as any[]);

         setNewChartData(_newData);
      } catch (error) {
      //
      } finally {
         refIsLoaded.current = true;
      }
   };

   useEffect(() => {
      clearInterval(timeInterval.current);
      getData();
      setLoading(true);
      setChartData([]);
      setNewChartData([]);
      timeInterval.current = setInterval(() => {
         onNewData();
      }, TRADE_TIME_INTERVAL);
      return () => {
         clearInterval(timeInterval.current);
      };
   }, [pumpToken?.token_address, tradePlatform, timeChart]);

   return (
      <Box className={s.chartWrapper}>
         <ChartHeader />
         {loading ? (
            <AppLoading />
         ) : (
            <>
               {chartData.length > 0 ? (
                  <>
                     <ChartV2Module
                        chartData={chartData}
                        newData={newChartData}
                        dataSymbol={pumpToken?.base_token_symbol as string}
                        chartType={typeChart}
                        priceDecimal={
                           compareString(pumpToken?.base_token_symbol, "BTC")
                              ? 2
                              : CHART_DECIMAL
                        }
                     />
                  </>
               ) : (
                  <Center height={"100%"}>
                     <Text>Bow-wow</Text>
                  </Center>
               )}
            </>
         )}
      </Box>
   );
};

export default PumpTradeChart;
