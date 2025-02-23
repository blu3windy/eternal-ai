class LocalStorageService {
    constructor(private storage: Storage = localStorage) {}

    setItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return this.storage.getItem(key);
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }
}

const localStorageService = new LocalStorageService();

export default localStorageService;