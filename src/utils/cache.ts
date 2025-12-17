interface CacheEntry {
    value: string;
    timestamp: number;
}
  
interface CacheConfig {
    ttl: number;  // Time to live in milliseconds
    maxEntries: number;
}

export class CommandCache {
    private cache: Map<string, CacheEntry>;
    private config: CacheConfig;

    constructor(config: CacheConfig = { ttl: 5 * 60 * 1000, maxEntries: 100 }) {
        this.cache = new Map();
        this.config = config;
    }

    set(key: string, value: string): void {
        if (this.cache.size >= this.config.maxEntries) {
        const oldestKey = Array.from(this.cache.entries())
            .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        this.cache.delete(oldestKey);
        }
        this.cache.set(key, { value, timestamp: Date.now() });
    }

    get(key: string): string | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
        return null;
        }

        return entry.value;
    }

    clear(): void {
        this.cache.clear();
    }
}