import React, { PropsWithChildren, useMemo, useState } from "react";
import { IAgentContext } from "./interface";

const initialValue: IAgentContext = {
  loading: false,
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

const AgentProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
  children,
  tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const [loading, setLoading] = useState(true);

  const contextValues: any = useMemo(() => {
    return {
      loading,
    };
  }, [loading]);

  return (
    <AgentContext.Provider value={contextValues}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;
