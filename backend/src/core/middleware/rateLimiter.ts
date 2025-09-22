import { Request, Response, NextFunction } from 'express';
// import { cacheManager } from '../../config/redis';

// Rate limiter middleware
export const rateLimiter = (options: {
  windowMs?: number;
  max?: number;
  keyPrefix?: string;
  message?: string;
}) => {
  const {
    windowMs = 60 * 1000, // 1 minute (changed from 15 minutes)
    max = 3, // limit each IP to 3 requests per minute (changed from 100)
    keyPrefix = 'rate-limit',
    message = 'Too many requests, please try again later. Maximum 3 requests per minute.'
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting for certain paths if needed
    if (req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
      return next();
    }

    // Get client IP
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}:${req.method}:${req.path}`;

    try {
      // Get current count for this IP and endpoint
      // const current = await cacheManager.get<number>(key);
      // const count = current || 0;

      // Set expiry on first request
      // if (count === 0) {
      //   await cacheManager.set(key, 1, Math.floor(windowMs / 1000));
      // } else if (count >= max) {
        // Too many requests
        // const resetTime = Math.floor(Date.now() / 1000) + Math.floor(windowMs / 1000);
        // return res.status(429).json({
        //   success: false,
        //   message,
        //   retryAfter: Math.floor(windowMs / 1000),
        //   resetTime: resetTime * 1000, // Convert to milliseconds for frontend
        //   remaining: 0,
        //   total: max
        // });
      // } 
      // else {
      //   // Increment counter
      //   await cacheManager.set(key, count + 1, Math.floor(windowMs / 1000));
      // }

      // Add headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max); // Set remaining to max since Redis is disabled
      res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + Math.floor(windowMs / 1000));

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Continue without rate limiting if Redis fails
      next();
    }
  };
};

// Different rate limiters for different routes
export const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyPrefix: 'auth-limit',
  message: 'Too many authentication attempts, please try again later. Maximum 10 attempts per minute.'
});

export const apiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  keyPrefix: 'api-limit',
  message: 'Too many API requests, please try again later. Maximum 30 requests per minute.'
});

// Strict rate limiter for sensitive operations
export const strictRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute for very sensitive operations
  keyPrefix: 'strict-limit',
  message: 'Too many requests for this operation. Please try again later. Maximum 5 requests per minute.'
});

// Rate limiter for file uploads
export const uploadRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 uploads per minute
  keyPrefix: 'upload-limit',
  message: 'Too many file uploads. Please try again later. Maximum 3 uploads per minute.'
}); 