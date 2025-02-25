import React, { PropsWithChildren, useMemo, useState } from "react";
import { IAgentContext } from "./interface";
import {IAgentToken} from "../../../services/api/agents-token/interface.ts";

const initialValue: IAgentContext = {
  loading: false,
  selectedAgent: undefined,
  setSelectedAgent: () => {}
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

  const contextValues: any = useMemo(() => {
    return {
      loading,
      selectedAgent,
      setSelectedAgent,
    };
  }, [
    loading,
    selectedAgent,
    setSelectedAgent
  ]);

  return (
    <AgentContext.Provider value={contextValues}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
