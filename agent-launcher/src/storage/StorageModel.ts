import { LocalStorageService } from "@storage/LocalStorageService.ts";
import { IAgentToken } from "@services/api/agents-token/interface.ts";


const VERSION = "0.0.1";
const ACTIVE_MODEL_STORAGE_KEY = `ACTIVE_MODEL_STORAGE_KEY_${VERSION}`;


interface IAgentStorage extends IAgentToken {
   hash: string;
}

interface IAgentId {
   chainId: number;
   contractAddress: string;
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

   getDependAgentKey({ contractAddress, chainId }: IAgentId) {
      return `${contractAddress}-${chainId}`?.toLowerCase();
   }

   async getDependAgents({ contractAddress, chainId }: IAgentId): Promise<IAgentToken[] | undefined> {
      const key = this.getDependAgentKey({ contractAddress, chainId });
      const agents = await this.getItem(key);
      if (agents) {
         return JSON.parse(agents);
      }
      return undefined;
   }

   async setDependAgents({ contractAddress, chainId }: IAgentId, agents: IAgentToken[]) {
      const key = this.getDependAgentKey({ contractAddress, chainId });
      await this.setItem(key, JSON.stringify(agents));
   }  

   async removeDependAgents({ contractAddress, chainId }: IAgentId) {
      const key = this.getDependAgentKey({ contractAddress, chainId });
      await this.removeItem(key);
   }
}


const storageModel = new StorageModel();

export default storageModel;