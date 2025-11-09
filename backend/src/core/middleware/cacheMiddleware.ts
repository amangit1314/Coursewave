import { NextFunction, Request, Response } from "express";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { CacheManager } from "../helpers/CacheManager";

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
