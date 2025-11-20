import { NextFunction, Request, Response } from "express";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { CacheManager } from "../helpers/CacheManager";
import { features } from "../../config/config";
import { logger } from "../utils/logger";

export const cacheMiddleware = (
  ttl: number = CACHE_TTL.MEDIUM,
  keyGenerator?: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip if feature disabled or request opts-out
    if (!features.cacheEnabled || req.skipCache) return next();

    const cacheManager = CacheManager.getInstance();

    // Generate cache key
    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : req.cacheKey || `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache
      const cachedData = await cacheManager.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original send function
      const originalSend = res.json;

      // Override json function to cache the response
      res.json = function (data: any) {
        // Restore original json function
        res.json = originalSend;

        // Cache successful responses
        if (res.statusCode === 200 && data) {
          cacheManager
            .set(cacheKey, data, ttl)
            .catch((err) => logger.warn("Error caching response", { error: (err as Error)?.message, cacheKey }));
        }

        // Send the response
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      logger.warn("Cache middleware error", { error: (error as Error)?.message, cacheKey });
      next();
    }
  };
};
