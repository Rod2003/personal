// Cache-related types
export interface CacheEntry {
  value: string;
  timestamp: number;
}

export interface CacheConfig {
  ttl: number;  // Time to live in milliseconds
  maxEntries: number;
}
