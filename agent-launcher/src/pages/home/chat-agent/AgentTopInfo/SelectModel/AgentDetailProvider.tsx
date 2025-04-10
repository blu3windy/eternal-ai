import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { ReactNode, useContext } from "react";

type Props = {
  agent: IAgentToken;
  children: ReactNode;
}

export const AgentDetailProvider = ({ agent, children }: Props) => {
  const agentContext = useContext(AgentContext);
  
  const contextValue = {
    ...agentContext,
    selectedAgent: agent
  };

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
}; 