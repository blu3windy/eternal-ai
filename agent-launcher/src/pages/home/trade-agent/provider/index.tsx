import React, { PropsWithChildren, useState } from "react";
import { IAgentTradeContext } from "./interface";
import { IAgentToken } from "@services/api/agents-token/interface";

const initialValue = {};

export const AgentTradeContext =
  React.createContext<IAgentTradeContext>(initialValue);

const AgentTradeProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
  children,
  tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const [pairs, setPairs] = useState<IAgentToken[]>([]);

  const contextValues: IAgentTradeContext = {};
  return (
    <AgentTradeContext.Provider value={contextValues}>
      {children}
    </AgentTradeContext.Provider>
  );
};

export default AgentTradeProvider;
