import { IAgentToken } from '@services/api/agents-token/interface';
import { compareString } from '@utils/string';
import { create } from 'zustand';

export interface ActiveAgent {
    agent: IAgentToken;
    timestamp: number;
}

interface AgentState {
    activeAgents: Set<ActiveAgent>;
    removeActiveAgent: (agentId: string) => void;
    addActiveAgent: (agent: IAgentToken) => void;
    selectedAgent: IAgentToken | undefined;
    selectedAgentTimestamp: number;
    setSelectedAgent: (agent: IAgentToken | undefined) => void;
}

const useAgentState = create<AgentState>((set) => ({
   activeAgents: new Set(),
   removeActiveAgent: (agentId) => {
      set((state) => {
         const updatedActiveAgents = new Set(state.activeAgents);
         updatedActiveAgents.forEach((activeAgent) => {
            if (compareString(activeAgent.agent.agent_id, agentId)) {
               updatedActiveAgents.delete(activeAgent);
            }
         });
         return { activeAgents: updatedActiveAgents };
      });
   },
   addActiveAgent: (agent) => {
      set((state) => {
         const activeAgents = new Set(state.activeAgents);
         let agentFound = false;
         activeAgents.forEach((activeAgent) => {
            if (compareString(activeAgent.agent.agent_id, agent.agent_id)) {
               activeAgent.agent = agent;
               activeAgent.timestamp = Date.now();
               agentFound = true;
            }
         });
         if (!agentFound) {
            const newActiveAgent: ActiveAgent = { agent, timestamp: Date.now() };
            activeAgents.add(newActiveAgent);
         }
         return { activeAgents };
      });
   },
   selectedAgent: undefined,
   selectedAgentTimestamp: 0,
   setSelectedAgent: (agent) => {
      set({ selectedAgent: agent, selectedAgentTimestamp: Date.now() });
   },
}));

export default useAgentState;
