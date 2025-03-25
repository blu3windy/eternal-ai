import { LocalStorageService } from "@storage/LocalStorageService.ts";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { AgentType } from "@pages/home/list-agent";


const ACTIVE_MODEL_STORAGE_KEY = "ACTIVE_MODEL_STORAGE_KEY";

interface IActiveModelStorage {
   id: number;
   agent_id: string;
   agent_type: AgentType;
   hash: string;
}

class StorageModel extends LocalStorageService {
   async setActiveModel(params: IActiveModelStorage) {
      await this.setItem(ACTIVE_MODEL_STORAGE_KEY, JSON.stringify(params));
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


const storageModel = new StorageModel();

export default storageModel;