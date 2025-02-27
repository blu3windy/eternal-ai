import React, {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {IAgentContext} from "./interface";
import {IAgentToken} from "../../../services/api/agents-token/interface.ts";

const initialValue: IAgentContext = {
  loading: false,
  selectedAgent: undefined,
  setSelectedAgent: () => {},
  currentModel: undefined,
  setCurrentModel: () => {},
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

  const [currentModel, setCurrentModel] = useState<{
    name: string;
    id: string;
  } | null>(null);

  useEffect(() => {

  }, []);

  console.log('stephen: selectedAgent', selectedAgent);

  const contextValues: any = useMemo(() => {
    return {
      loading,
      selectedAgent,
      setSelectedAgent,
      currentModel,
      setCurrentModel,
    };
  }, [
    loading,
    selectedAgent,
    setSelectedAgent,
    currentModel,
    setCurrentModel,
  ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;
