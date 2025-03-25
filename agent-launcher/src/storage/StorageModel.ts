import { LocalStorageService } from "@storage/LocalStorageService.ts";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { AgentType } from "@pages/home/list-agent";


const ACTIVE_MODEL_STORAGE_KEY = "ACTIVE_MODEL_STORAGE_KEY";

interface IActiveModelStorage {
   id: string;
   agent_type: AgentType;
   agent_id: string;
   source_url: string;
}

class StorageModel extends LocalStorageService {
   async setActiveModel(model: IAgentToken) {
      const data = {
         id: model?.id?.toString(),
         agent_type: model.agent_type,
         agent_id: model?.agent_id,
         source_url: model?.source_url || ""
      } as IActiveModelStorage
      await this.setItem(ACTIVE_MODEL_STORAGE_KEY, JSON.stringify(data));
   }

   async getActiveModel(): Promise<IActiveModelStorage | undefined> {
      const model = await this.getItem(ACTIVE_MODEL_STORAGE_KEY);
      if (model) {
         return JSON.parse(model);
      }
      return undefined;
   }

   async removeActiveModel() {
      await this.removeItem(ACTIVE_MODEL_STORAGE_KEY);
   }
}

export default new StorageModel();