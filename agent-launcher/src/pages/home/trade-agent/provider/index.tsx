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

const initialValue = {};

export const AgentTradeContext =
  React.createContext<IAgentTradeContext>(initialValue);

const AgentTradeProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
  children,
  tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const { selectedAgent, tradePlatform } = useContext(AgentContext);

  const [pairs, setPairs] = useState<IAgentToken[]>([]);

  const agentTradeContract = useRef(new CAgentTradeContract()).current;

  useEffect(() => {
    getData();
  }, [selectedAgent, tradePlatform]);

  const getData = async () => {
    try {
      if (!selectedAgent) {
        return;
      }
      const _currentChain = ChainIdToChainType[selectedAgent?.meme?.network_id];
      console.log("_currentChain", _currentChain);

      if (tradePlatform === ETradePlatform.eternal) {
        const [poolInfo] = await Promise.all([
          agentTradeContract.getLiquidityPoolInfo({
            poolAddress: selectedAgent?.meme?.pool,
            chain: _currentChain,
          }),
        ]);

        console.log('poolInfo', poolInfo);
        
      }
    } catch (error) {
        console.log('error', error);
        
    }
  };

  const contextValues: IAgentTradeContext = {};
  return (
    <AgentTradeContext.Provider value={contextValues}>
      {children}
    </AgentTradeContext.Provider>
  );
};

export default AgentTradeProvider;
