import { Redis } from "@upstash/redis";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import redis from "../../config/redis";
import { logger } from "../utils/logger";

export class CacheManager {
  private static instance: CacheManager;
  private redis: Redis | null;

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
    if (!this.redis) return;
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      logger.warn("Cache set error", { key, error: (error as Error)?.message });
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const value = await this.redis.get(key);
      if (!value) return null;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (parseError) {
          logger.warn("Cache parse error", { key, error: (parseError as Error)?.message });
          return null;
        }
      }

      return value as T;
    } catch (error) {
      logger.warn("Cache get error", { key, error: (error as Error)?.message });
      return null;
    }
  }

  // Delete cache key
  async del(key: string): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.warn("Cache delete error", { key, error: (error as Error)?.message });
    }
  }

  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<void> {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.info("Cache pattern cleared", { pattern, count: keys.length });
      }
    } catch (error) {
      logger.warn("Cache pattern delete error", { pattern, error: (error as Error)?.message });
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false;
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.warn("Cache exists error", { key, error: (error as Error)?.message });
      return false;
    }
  }

  // Set cache with hash (for complex objects)
  async hset(key: string, field: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    if (!this.redis) return;
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, { [field]: serializedValue });
      if (ttl > 0) {
        await this.redis.expire(key, ttl);
      }
    } catch (error) {
      logger.warn("Cache hset error", { key, field, error: (error as Error)?.message });
    }
  }

  // Get cache with hash
  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      logger.warn("Cache hget error", { key, field, error: (error as Error)?.message });
      return null;
    }
  }

  // Increment counter
  async incr(key: string, ttl: number = CACHE_TTL.MEDIUM): Promise<number> {
    if (!this.redis) return 0;
    try {
      const result = await this.redis.incr(key);
      if (ttl > 0) {
        await this.redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      logger.warn("Cache incr error", { key, error: (error as Error)?.message });
      return 0;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    return {
      connected: !!this.redis,
      timestamp: new Date().toISOString(),
    };
  }
}