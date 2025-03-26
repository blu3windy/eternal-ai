import { AgentType } from "@pages/home/list-agent/constants";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import orderBy from "lodash/orderBy";

const getSetupAgents = async (agents: IAgentToken[]) => {
   const osContext = await window?.electronAPI?.osContext();
   const _agents = agents.filter((item) => {
      if (item.agent_type === AgentType.ModelOnline) return true;
      item.required_info = JSON.stringify({
         ram: 16,
         disk: 20,
         arch: "x64",
      }) as any
      if (!item?.required_info) return false;
      const requirements = item.required_info;


      // check available free disk space, free memory
      const freeDisk = osContext?.disk.free / 1024 / 1024 / 1024;
      const freeRam = osContext?.memory.free / 1024 / 1024 / 1024;
      const arch = osContext?.os.arch;

      if (freeDisk < requirements.disk) return false;
      if (freeRam < requirements.ram) return false;

      // arch x64 just support x64, arm64 support x64 and arm64
      return !(arch === "arm64" && requirements.arch !== "arm64");
   })

   return orderBy(_agents, [
      (agent) => agent.agent_type === AgentType.ModelOnline,
   ], ['desc']);
};

export {
   getSetupAgents
}