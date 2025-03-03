import { compareString } from "@utils/string";
import { AgentContext } from "@pages/home/provider";
import { useContext, useMemo } from "react";
import s from "./styles.module.scss";

type Props = {};

const ChartDexscaner = (props: Props) => {
  const { selectedAgent } = useContext(AgentContext);

  const chainName = useMemo(() => {
    // if (compareString(selectedAgent?.meme?.network_id, base.id)) {
    //   return base.name;
    // }
    // if (compareString(selectedAgent?.meme?.network_id, arbitrum.id)) {
    //   return "arbitrum";
    // }
    // if (compareString(selectedAgent?.meme?.network_id, apeChain.id)) {
    //   return "apechain";
    // }
    // if (compareString(selectedAgent?.meme?.network_id, bsc.id)) {
    //   return "bsc";
    // }
    // if (compareString(selectedAgent?.meme?.network_id, avalanche.id)) {
    //   return "avalanche";
    // }
    return "solana";
  }, [selectedAgent]);

  if (!selectedAgent?.meme?.uniswap_pool) {
    return <></>;
  }

  return (
    <div className={s.dexscreener}>
      <iframe
        src={`https://dexscreener.com/${chainName.toLowerCase()}/${
          selectedAgent?.meme?.uniswap_pool
        }?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTimeframesToolbar=0&loadChartSettings=0&chartTheme=dark&theme=dark&chartStyle=1&chartType=usd&interval=15`}
      ></iframe>
    </div>
  );
};

export default ChartDexscaner;
