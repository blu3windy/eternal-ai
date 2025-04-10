import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { ReactNode, useContext, useMemo } from "react";

type Props = {
  agent: IAgentToken;
  agentStates: any;
  children: ReactNode;
}

export const AgentDetailProvider = ({ agent, agentStates, children }: Props) => {
  const agentContext = useContext(AgentContext);
  
  const agentState = useMemo(() => {
    return agentStates[agent.id] || {};
  }, [agentStates, agent.id]);
  
  const contextValue = {
    ...agentContext,
    selectedAgent: agent,
    agentStates,
    isInstalled: agentState.isInstalled || false,
    isInstalling: agentState.isInstalling || false,
    isRunning: agentState.isRunning || false,
    isStarting: agentState.isStarting || false,
    isUpdating: agentState.isUpdating || false
  };

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
}; 