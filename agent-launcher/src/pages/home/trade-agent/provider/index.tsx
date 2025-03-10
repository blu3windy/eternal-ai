/* eslint-disable indent */
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IAgentTradeContext } from "./interface";
import { IAgentToken } from "@services/api/agents-token/interface";
import { AgentContext } from "@pages/home/provider";
import { ChainIdToChainType } from "./constant";
import { ETradePlatform } from "@pages/home/provider/interface";
import CAgentTradeContract from "@contract/agent-trade";
import { IToken } from "@interfaces/token";
import { compareString } from "@utils/string";
import { useDispatch } from "react-redux";
import { setCurrentChain } from "@stores/states/agent-trade/reducer";

const initialValue: IAgentTradeContext = {
  loading: false,
  pairs: [],
  fee: "",
};

export const AgentTradeContext =
  React.createContext<IAgentTradeContext>(initialValue);

const AgentTradeProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
  children,
  tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const dispatch = useDispatch();
  const { selectedAgent, tradePlatform } = useContext(AgentContext);
  const [loading, setLoading] = useState(true);
  const [pairs, setPairs] = useState<IToken[]>([]);
  const [chainPairs, setChainPairs] = useState<{
    [ETradePlatform.eternal]: IToken[];
    [ETradePlatform.exchange3th]: IToken[];
  }>({
    [ETradePlatform.eternal]: [],
    [ETradePlatform.exchange3th]: [],
  });
  const [fee, setFee] = useState<string>("10000");

  const agentTradeContract = useRef(new CAgentTradeContract()).current;

  useEffect(() => {
    getData();
  }, [selectedAgent, tradePlatform]);

  const getData = async () => {
    try {
      if (!selectedAgent) {
        return;
      }
      setLoading(true);
      const _currentChain = ChainIdToChainType[selectedAgent?.meme?.network_id];
      console.log("_currentChain", _currentChain);
      dispatch(setCurrentChain(_currentChain));

      let _pairs: IToken[] = [];
      let _fee: string = "0";

      if (tradePlatform === ETradePlatform.eternal) {
        const [poolInfo] = await Promise.all([
          agentTradeContract.getLiquidityPoolInfo({
            poolAddress: selectedAgent?.meme?.pool,
            chain: _currentChain,
          }),
        ]);

        console.log("poolInfo", poolInfo);

        _pairs = [poolInfo.token0Info, poolInfo.token1Info];
        if (
          compareString(
            selectedAgent?.meme?.token_address,
            poolInfo.token0Info.address
          )
        ) {
          _pairs = _pairs.reverse();
        }
        if (poolInfo.fee) {
          _fee = poolInfo.fee;
        }
        setFee(_fee);
        setChainPairs({
          [ETradePlatform.eternal]: _pairs,
          [ETradePlatform.exchange3th]: [],
        });
      } else {
        const [poolInfo] = await Promise.all([
          agentTradeContract.getLiquidityPoolFrom3th({
            poolAddress: selectedAgent?.meme?.uniswap_pool,
            chain: _currentChain,
          }),
        ]);

        _pairs = [poolInfo.token0Info, poolInfo.token1Info];
        if (
          compareString(
            selectedAgent?.meme?.token_address,
            poolInfo.token0Info.address
          )
        ) {
          _pairs = _pairs.reverse();
        }
        if (poolInfo.fee) {
          _fee = poolInfo.fee;
        }
        setFee(_fee);
        setChainPairs({
          [ETradePlatform.eternal]: _pairs,
          [ETradePlatform.exchange3th]: [],
        });
      }

      setPairs(_pairs);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const contextValues: IAgentTradeContext = {
    pairs,
    loading,
    fee,
  };
  return (
    <AgentTradeContext.Provider value={contextValues}>
      {children}
    </AgentTradeContext.Provider>
  );
};

export default AgentTradeProvider;
