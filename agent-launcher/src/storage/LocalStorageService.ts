import Store from 'electron-store';

class LocalStorageService {
   private store: Store;

   constructor() {
      this.store = new Store();
   }

   setItem(key: string, value: string): void {
      this.store.set(key, value);
      console.log(`Set item: ${key} = ${value}`); // Log the set operation
   }

   getItem(key: string): string | null {
      const value = this.store.get(key);
      console.log(`Get item: ${key} = ${value}`); // Log the get operation
      return typeof value === 'string' ? value : null;
   }

   removeItem(key: string): void {
      this.store.delete(key);
      console.log(`Removed item: ${key}`); // Log the remove operation
   }

   clear(): void {
      this.store.clear();
      console.log('Cleared all items'); // Log the clear operation
   }
}

const localStorageService = new LocalStorageService();

export default localStorageService;