import { IAgentToken } from "@services/api/agents-token/interface.ts";

const getAgentContainerName = (agent: IAgentToken) => {
   return `${agent?.network_id}-${agent?.agent_name}`?.toLowerCase();
}

export {
   getAgentContainerName
}