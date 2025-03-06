import { Flex, Progress, Text } from "@chakra-ui/react";
import { AgentContext } from "@pages/home/provider";
import { ETradePlatform } from "@pages/home/provider/interface";
import { formatCurrency } from "@utils/format";
import BigNumber from "bignumber.js";
import { useContext, useMemo } from "react";
import s from "./styles.module.scss";

interface Props {}

const Curving = (props: Props) => {
   // const currentChain = useSelector(walletSelector).currentChain;
   const { selectedAgent, loading, tradePlatform } = useContext(AgentContext);
   const maxMarketCap = 69000;
   console.log('tradePlatform', tradePlatform);
  
   const dexName = useMemo(() => {
      // if (
      //   currentChain === CHAIN_TYPE.APE ||
      //   currentChain === CHAIN_TYPE.ARBITRUM
      // ) {
      //   return "Camelot";
      // }
      // if (
      //   currentChain === CHAIN_TYPE.ETHEREUM ||
      //   currentChain === CHAIN_TYPE.BASE ||
      //   currentChain === CHAIN_TYPE.AVALANCHE
      // ) {
      //   return "Uniswap";
      // }
      // if (currentChain === CHAIN_TYPE.BSC) {
      //   return "PancakeSwap";
      // }
      return "Raydium";
   }, [selectedAgent]);

   const percent = useMemo(() => {
      return new BigNumber(selectedAgent?.usd_market_cap || "0")
         .dividedBy(maxMarketCap)
         .multipliedBy(100)
         .toString();
   }, [selectedAgent]);

   if (tradePlatform !== ETradePlatform.eternal) {
      return <></>;
   }

   return (
      <Flex className={s.container}>
         <Flex flexDirection={"column"} gap={"4px"}>
            <Text>
          Bonding curve progress:{" "}
               <span className={s.textPercent}>
                  {formatCurrency(percent, 0, 2)}%
               </span>
            </Text>
            <Progress
               className={s.processing}
               value={parseFloat(percent)}
               max={100}
               bgColor={"rgba(84, 0, 251, 0.15)"}
               height={"12px"}
               borderRadius={"100px"}
            />
         </Flex>
         <Text fontSize={"12px"} mt={"12px"}>
        When the market cap reaches ${formatCurrency(maxMarketCap, 0, 2)} all
        the liquidity from the bonding curve will be deposited into {dexName}{" "}
        and burned. progression increases as the price goes up.
         </Text>
      </Flex>
   );
};

export default Curving;
