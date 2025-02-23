
class SecureStorage {
    private readonly service: string;
    private readonly keytar: any;

    constructor() {
        this.service = 'eternal-ai-launcher';
        this.keytar = (window as any).keytar;
    }

    async setItem(key: string, value: string): Promise<void> {
        await this.keytar.setPassword(this.service, key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return await this.keytar.getPassword(this.service, key);
    }

    async removeItem(key: string): Promise<void> {
        await this.keytar.deletePassword(this.service, key);
    }
}

const secureStorage = new SecureStorage();

export default secureStorage;