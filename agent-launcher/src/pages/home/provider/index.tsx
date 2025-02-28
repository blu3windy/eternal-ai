import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import {IAgentContext} from "./interface";
import {IAgentToken, IChainConnected} from "../../../services/api/agents-token/interface.ts";
import CAgentTokenAPI from "../../../services/api/agents-token";

const initialValue: IAgentContext = {
  loading: false,
  selectedAgent: undefined,
  setSelectedAgent: () => {},
  currentModel: undefined,
  setCurrentModel: () => {},
  chainList: [],
  installAgent: () => {},
  isInstalled: false,
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

const AgentProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
   children,
   tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<IAgentToken | undefined>(undefined);
  const [chainList, setChainList] = useState<IChainConnected[]>([]);

  console.log('stephen: selectedAgent', selectedAgent);

  const cPumpAPI = new CAgentTokenAPI();

  const [currentModel, setCurrentModel] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const isInstalled = useMemo(() => {
    return Number(selectedAgent?.id || 0) % 2 === 0;
  }, [selectedAgent]);

  const fetchChainList = useCallback(async () => {
    const chainList = await cPumpAPI.getChainList();
    if (!!chainList && chainList.length > 0) {
      const list = chainList.map((chain) => {
        const modelDetailParams = !!chain?.model_details?.[0]?.params
          ? JSON.parse(chain?.model_details?.[0]?.params)
          : {};

        const _chain = {
          ...chain,
          tag: `@${modelDetailParams?.model_name || ''}`,
        };

        if (!chain.balance) {
          return {
            ..._chain,
            balance: '0',
            formatBalance: '0',
          };
        }
        return _chain;
      });

      setChainList(list)
    }
  }, []);

  useEffect(() => {
    fetchChainList();
  }, []);

  const installAgent = (id: number) => {

  }

  const contextValues: any = useMemo(() => {
    return {
      loading,
      selectedAgent,
      setSelectedAgent,
      currentModel,
      setCurrentModel,
      chainList,
      installAgent,
      isInstalled,
    };
  }, [
    loading,
    selectedAgent,
    setSelectedAgent,
    currentModel,
    setCurrentModel,
    chainList,
    installAgent,
    isInstalled,
  ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;
