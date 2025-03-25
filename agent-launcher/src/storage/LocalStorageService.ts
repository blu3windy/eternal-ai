
export class LocalStorageService {

   private readonly electronAPI = window.electronAPI

   constructor() {
      if (!this.electronAPI) {
         this.electronAPI = window.electronAPI
      }
   }

   async setItem(key: string, value: string) {
      await this.electronAPI.storeSetItem(key, value);
   }

   async getItem(key: string): Promise<string> {
      const value = await this.electronAPI.storeGetItem(key);
      return value || '';
   }

   async removeItem(key: string) {
      await this.electronAPI.storeRemoveItem(key);
   }

   async clear() {
      await this.electronAPI.storeClear();
   }
}

const localStorageService = new LocalStorageService();

export default localStorageService;