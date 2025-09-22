import { Request, Response, NextFunction } from 'express';
import { invalidateCache } from '../../config/redis';

// Extend Request interface to include cache options
declare global {
  namespace Express {
    interface Request {
      skipCache?: boolean;
      cacheKey?: string;
    }
  }
}

/**
 * Middleware to invalidate cache after successful operations
 * @param cacheType - Type of cache to invalidate ('courses', 'users', 'blogs', etc.)
 * @param idExtractor - Function to extract ID from request (default: from params.id)
 * @returns Middleware function
 */
export const invalidateCacheAfter = (cacheType: string, idExtractor?: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original send function
    const originalSend = res.json;
    
    // Override send function to intercept response
    res.json = function(data: any) {
      // Restore original send function
      res.json = originalSend;
      
      // Only invalidate cache on successful operations
      if (data.success && (res.statusCode === 200 || res.statusCode === 201)) {
        const id = idExtractor ? idExtractor(req) : req.params.id;
        
        // Invalidate cache based on type
        switch (cacheType) {
          case 'courses':
            invalidateCache.courses(id);
            break;
          case 'users':
            invalidateCache.users(id);
            break;
          case 'blogs':
            invalidateCache.blogs(id);
            break;
          case 'categories':
            invalidateCache.categories();
            break;
          default:
            console.warn(`Unknown cache type: ${cacheType}`);
        }
      }
      
      // Call original send function
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to skip cache for specific requests
 * @returns Middleware function
 */
export const skipCache = (req: Request, res: Response, next: NextFunction) => {
  req.skipCache = true;
  next();
};

/**
 * Middleware to set custom cache key
 * @param keyGenerator - Function to generate cache key
 * @returns Middleware function
 */
export const setCacheKey = (keyGenerator: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.cacheKey = keyGenerator(req);
    next();
  };
};

/**
 * Middleware to invalidate multiple cache types
 * @param cacheTypes - Array of cache types to invalidate
 * @returns Middleware function
 */
export const invalidateMultipleCaches = (cacheTypes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;
    
    res.json = function(data: any) {
      res.json = originalSend;
      
      if (data.success && (res.statusCode === 200 || res.statusCode === 201)) {
        cacheTypes.forEach(cacheType => {
          switch (cacheType) {
            case 'courses':
              invalidateCache.courses();
              break;
            case 'users':
              invalidateCache.users();
              break;
            case 'blogs':
              invalidateCache.blogs();
              break;
            case 'categories':
              invalidateCache.categories();
              break;
            default:
              console.warn(`Unknown cache type: ${cacheType}`);
          }
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to invalidate cache based on request body
 * @param cacheType - Type of cache to invalidate
 * @param bodyKey - Key in request body to extract ID from
 * @returns Middleware function
 */
export const invalidateCacheByBody = (cacheType: string, bodyKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;
    
    res.json = function(data: any) {
      res.json = originalSend;
      
      if (data.success && (res.statusCode === 200 || res.statusCode === 201)) {
        const id = req.body[bodyKey];
        
        if (id) {
          switch (cacheType) {
            case 'courses':
              invalidateCache.courses(id);
              break;
            case 'users':
              invalidateCache.users(id);
              break;
            case 'blogs':
              invalidateCache.blogs(id);
              break;
            case 'categories':
              invalidateCache.categories();
              break;
            default:
              console.warn(`Unknown cache type: ${cacheType}`);
          }
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to invalidate cache for course-related operations
 * @returns Middleware function
 */
export const invalidateCourseCache = async (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.json;
  
  res.json = function(data: any) {
    res.json = originalSend;
    
    if (data.success && (res.statusCode === 200 || res.statusCode === 201)) {
      const courseId = req.params.courseId || req.body.courseId;
      invalidateCache.courses(courseId);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Middleware to invalidate cache for user-related operations
 * @returns Middleware function
 */
export const invalidateUserCache = async (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.json;
  
  res.json = function(data: any) {
    res.json = originalSend;
    
    if (data.success && (res.statusCode === 200 || res.statusCode === 201)) {
      const userId = req.params.userId || req.body.userId || req.user?.id;
      invalidateCache.users(userId);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}; 