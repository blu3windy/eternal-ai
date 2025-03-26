import { LocalStorageService } from "@storage/LocalStorageService.ts";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { AgentType } from "@pages/home/list-agent";


const VERSION = "0.0.1";
const ACTIVE_MODEL_STORAGE_KEY = `ACTIVE_MODEL_STORAGE_KEY_${VERSION}`;


interface IAgentStorage extends IAgentToken {
   hash: string;
}

class StorageModel extends LocalStorageService {
   async setActiveModel(agent: IAgentStorage) {
      await this.setItem(ACTIVE_MODEL_STORAGE_KEY, JSON.stringify({
         ...agent,
      }));
   }

   async getActiveModel(): Promise<IAgentStorage | undefined> {
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