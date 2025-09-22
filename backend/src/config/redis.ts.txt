import { Redis } from '@upstash/redis';
import { NextFunction, Request, Response } from 'express';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache configuration
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
  PERMANENT: 0, // No expiration
};

// Cache key prefixes for organization
export const CACHE_PREFIXES = {
  COURSES: 'courses',
  BLOGS: 'blogs',
  USERS: 'users',
  CATEGORIES: 'categories',
  SESSIONS: 'sessions',
  CART: 'cart',
  WISHLIST: 'wishlist',
  REVIEWS: 'reviews',
  PROGRESS: 'progress',
  ATTACHMENTS: 'attachments',
  SEARCH: 'search',
  ANALYTICS: 'analytics',
};

// Cache utility functions
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

// Cache middleware for Express routes
export const cacheMiddleware = (ttl: number = CACHE_TTL.MEDIUM, keyGenerator?: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheManager = CacheManager.getInstance();
    
    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache
      const cachedData = await cacheManager.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original send function
      const originalSend = res.json;

      // Override json function to cache the response
      res.json = function(data: any) {
        // Restore original json function
        res.json = originalSend;

        // Cache successful responses
        if (res.statusCode === 200 && data) {
          cacheManager.set(cacheKey, data, ttl).catch(err => 
            console.error('Error caching response:', err)
          );
        }

        // Send the response
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Specific cache middleware for different data types
export const courseCacheMiddleware = cacheMiddleware(CACHE_TTL.MEDIUM, (req: Request) => {
  const courseId = req.params.courseId;
  return courseId 
    ? `${CACHE_PREFIXES.COURSES}:${courseId}`
    : `${CACHE_PREFIXES.COURSES}:list:${JSON.stringify(req.query)}`;
});

export const blogCacheMiddleware = cacheMiddleware(CACHE_TTL.MEDIUM, (req: Request) => {
  const slug = req.params.slug;
  return slug 
    ? `${CACHE_PREFIXES.BLOGS}:${slug}`
    : `${CACHE_PREFIXES.BLOGS}:list:${JSON.stringify(req.query)}`;
});

export const userCacheMiddleware = cacheMiddleware(CACHE_TTL.LONG, (req: Request) => {
  const userId = req.params.userId || req.user?.id;
  return `${CACHE_PREFIXES.USERS}:${userId}`;
});

export const categoryCacheMiddleware = cacheMiddleware(CACHE_TTL.VERY_LONG, (req: Request) => {
  return `${CACHE_PREFIXES.CATEGORIES}:list`;
});

// Cache invalidation utilities
export const invalidateCache = {
  // Invalidate course-related cache
  courses: async (courseId?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (courseId) {
      await cacheManager.del(`${CACHE_PREFIXES.COURSES}:${courseId}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.COURSES}:*`);
  },

  // Invalidate blog-related cache
  blogs: async (slug?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (slug) {
      await cacheManager.del(`${CACHE_PREFIXES.BLOGS}:${slug}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.BLOGS}:*`);
  },

  // Invalidate user-related enrollments cache
  enrollments: async (userId?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (userId) {
      await cacheManager.del(`${CACHE_PREFIXES.USERS}:${userId}:enrollments`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.USERS}:*`);
  },

  // Invalidate user-related cache
  users: async (userId?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (userId) {
      await cacheManager.del(`${CACHE_PREFIXES.USERS}:${userId}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.USERS}:*`);
  },

  // Invalidate categories cache
  categories: async () => {
    const cacheManager = CacheManager.getInstance();
    await cacheManager.delPattern(`${CACHE_PREFIXES.CATEGORIES}:*`);
  },

  // Invalidate sessions cache
  sessions: async (sessionId?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (sessionId) {
      await cacheManager.del(`${CACHE_PREFIXES.SESSIONS}:${sessionId}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.SESSIONS}:*`);
  },

  // Invalidate all cache
  all: async () => {
    const cacheManager = CacheManager.getInstance();
    await cacheManager.delPattern('*');
  },

  // Invalidate search cache
  search: async (query?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (query) {
      await cacheManager.del(`${CACHE_PREFIXES.SEARCH}:${query}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.SEARCH}:*`);
  }
};

// Rate limiting with Redis
export class RateLimiter {
  private cacheManager: CacheManager;

  constructor() {
    this.cacheManager = CacheManager.getInstance();
  }

  async isRateLimited(key: string, limit: number, window: number): Promise<boolean> {
    const current = await this.cacheManager.incr(`rate_limit:${key}`, window);
    return current > limit;
  }

  async getRemainingAttempts(key: string, limit: number): Promise<number> {
    const current = await this.cacheManager.get<number>(`rate_limit:${key}`) || 0;
    return Math.max(0, limit - current);
  }
}

// Session storage with Redis
export class SessionManager {
  private cacheManager: CacheManager;

  constructor() {
    this.cacheManager = CacheManager.getInstance();
  }

  async setSession(sessionId: string, data: any, ttl: number = CACHE_TTL.LONG): Promise<void> {
    await this.cacheManager.set(`session:${sessionId}`, data, ttl);
  }

  async getSession<T>(sessionId: string): Promise<T | null> {
    return await this.cacheManager.get<T>(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.cacheManager.del(`session:${sessionId}`);
  }
}

// Export singleton instances
export const cacheManager = CacheManager.getInstance();
export const rateLimiter = new RateLimiter();
export const sessionManager = new SessionManager();

// Health check for Redis
export const checkRedisHealth = async () => {
  try {
    const stats = await cacheManager.getStats();
    return stats.connected;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

export default redis; 