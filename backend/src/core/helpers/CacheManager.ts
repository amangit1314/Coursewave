import { Redis } from "@upstash/redis";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import redis from "../../config/redis";

export class CacheManager {
  private static instance: CacheManager;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Set cache with TTL
  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      
      // Handle different value types
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (parseError) {
          console.warn(`Failed to parse cached value for key ${key}:`, parseError);
          return null;
        }
      }
      
      // If value is already an object, return it directly
      return value as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache key
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`Cleared ${keys.length} cache entries for pattern: ${pattern}`);
      }
    } catch (error) {
      console.error('Cache pattern delete error:', error);
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set cache with hash (for complex objects)
  async hset(key: string, field: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, { [field]: serializedValue });
      if (ttl > 0) {
        await this.redis.expire(key, ttl);
      }
    } catch (error) {
      console.error('Cache hset error:', error);
    }
  }

  // Get cache with hash
  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      console.error('Cache hget error:', error);
      return null;
    }
  }

  // Increment counter
  async incr(key: string, ttl: number = CACHE_TTL.MEDIUM): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      if (ttl > 0) {
        await this.redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    try {
      return {
        connected: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        error: error
      };
    }
  }
}