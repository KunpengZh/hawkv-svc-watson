class CacheService {
    private cache: Map<string, any>;

    constructor() {
        this.cache = new Map();
    }

    public set(key: string, value: any): void {
        this.cache.set(key, value);
    }

    public get(key: string): any {
        return this.cache.get(key);
    }

    public clear(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

export default new CacheService();
