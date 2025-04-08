import { debounce } from 'lodash';

interface ElectronAPI {
  openExternal: (url: string) => void;
  storeSetItem: (key: string, value: string) => Promise<void>;
  storeGetItem: (key: string) => Promise<string>;
  storeRemoveItem: (key: string) => Promise<void>;
  storeClear: () => Promise<void>;
  storeGetAll: () => Promise<Record<string, string>>;
}

// Global cache and initialization state
const globalCache = new Map<string, string>();
export let isGlobalInitialized = false;

export class LocalStorageService {
   private readonly electronAPI: ElectronAPI;
   private pendingWrites: Map<string, string> = new Map();
   private readonly debouncedSave: () => void;
   private saveInProgress: boolean = false;

   constructor() {
      this.electronAPI = window.electronAPI as ElectronAPI;
      this.debouncedSave = debounce(this.savePendingWrites.bind(this), 1000);
   }

   protected get cache(): Map<string, string> {
      return globalCache;
   }

   protected get isInitialized(): boolean {
      return isGlobalInitialized;
   }

   protected set isInitialized(value: boolean) {
      isGlobalInitialized = value;
   }

   public async initialize(): Promise<void> {
      if (this.isInitialized) return;


      console.log('initialize');

      try {
         const allData = await this.electronAPI.storeGetAll();
         Object.entries(allData).forEach(([key, value]) => {
            this.cache.set(key, value);
         });
         this.isInitialized = true;
      } catch (error) {
         console.error('Error initializing storage:', error);
         this.isInitialized = false;
      }
   }

   private async savePendingWrites(): Promise<void> {
      if (this.pendingWrites.size === 0 || this.saveInProgress) return;

      this.saveInProgress = true;
      const writes = Array.from(this.pendingWrites.entries());
      this.pendingWrites.clear();

      try {
         await Promise.all(
            writes.map(([key, value]) => this.electronAPI.storeSetItem(key, value))
         );
      } catch (error) {
         console.error('Error saving to storage:', error);
         writes.forEach(([key, value]) => {
            this.pendingWrites.set(key, value);
         });
      } finally {
         this.saveInProgress = false;
         if (this.pendingWrites.size > 0) {
            this.debouncedSave();
         }
      }
   }

   async setItem(key: string, value: string): Promise<void> {
      this.cache.set(key, value);
      this.pendingWrites.set(key, value);
    
      if (!this.saveInProgress) {
         this.debouncedSave();
      }
   }

   async getItem(key: string): Promise<string> {
      if (!this.isInitialized) {
         await this.initialize();
      }
      // Always return from cache after initialization
      return this.cache.get(key) || '';
   }

   async removeItem(key: string): Promise<void> {
      this.cache.delete(key);
      this.pendingWrites.delete(key);
      await this.electronAPI.storeRemoveItem(key);
   }

   async clear(): Promise<void> {
      this.cache.clear();
      this.pendingWrites.clear();
      await this.electronAPI.storeClear();
   }

   async flush(): Promise<void> {
      await this.savePendingWrites();
   }
}

const localStorageService = new LocalStorageService();

export default localStorageService;