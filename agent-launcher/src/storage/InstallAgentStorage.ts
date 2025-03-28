import { LocalStorageService } from "@storage/LocalStorageService.ts";
import { compareString } from "@utils/string";
import uniq from "lodash.uniq";

const VERSION = "0.0.2";
const INSTALLED_TEST_AGENTS_KEY = `INSTALLED_TEST_AGENTS_${VERSION}`;

class InstallAgentStorage extends LocalStorageService {

   async addAgent(agentIds: number[]) {
      const installAgents = await this.getItem(INSTALLED_TEST_AGENTS_KEY);
      const _agentIds = installAgents ? JSON.parse(installAgents) : [];
      await this.setItem(INSTALLED_TEST_AGENTS_KEY, JSON.stringify(_agentIds ? uniq([..._agentIds, ...agentIds]) : agentIds));
   }

   async removeAgent(agentId: string) {
      const installAgents = await this.getItem(INSTALLED_TEST_AGENTS_KEY);
      const agentIds = installAgents ? JSON.parse(installAgents) : [];
      await this.setItem(INSTALLED_TEST_AGENTS_KEY, JSON.stringify(agentIds.filter((id)=> !compareString(id, agentId))));
   }

   async getAgentIds(): Promise<string[]> {
      const installAgents = await this.getItem(INSTALLED_TEST_AGENTS_KEY);
      const agentIds = installAgents ? JSON.parse(installAgents) : [];
      return agentIds;
   }
}


const installAgentStorage = new InstallAgentStorage();

export default installAgentStorage;