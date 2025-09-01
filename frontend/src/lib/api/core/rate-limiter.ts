interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class ClientRateLimiter {
  private static instance: ClientRateLimiter;
  private rateLimitMap: Map<string, RateLimitEntry> = new Map();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  // Increase rate limit for development mode
  private readonly MAX_REQUESTS = process.env.NODE_ENV === 'development' ? 30 : 3; // 30 requests per minute in dev, 3 in prod

  private constructor() {}

  public static getInstance(): ClientRateLimiter {
    if (!ClientRateLimiter.instance) {
      ClientRateLimiter.instance = new ClientRateLimiter();
    }
    return ClientRateLimiter.instance;
  }

  private generateKey(url: string, method: string = 'GET'): string {
    return `${method}:${url}`;
  }

  public isRateLimited(url: string, method: string = 'GET'): boolean {
    const key = this.generateKey(url, method);
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.rateLimitMap.delete(key);
      return false;
    }

    // Check if rate limit exceeded
    if (entry && entry.count >= this.MAX_REQUESTS) {
      return true;
    }

    return false;
  }

  public recordRequest(url: string, method: string = 'GET'): void {
    const key = this.generateKey(url, method);
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired, start new window
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
    } else {
      // Increment existing window
      entry.count++;
    }
  }

  public getRemainingRequests(url: string, method: string = 'GET'): number {
    const key = this.generateKey(url, method);
    const entry = this.rateLimitMap.get(key);
    
    if (!entry) {
      return this.MAX_REQUESTS;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.MAX_REQUESTS;
    }

    return Math.max(0, this.MAX_REQUESTS - entry.count);
  }

  public getResetTime(url: string, method: string = 'GET'): number {
    const key = this.generateKey(url, method);
    const entry = this.rateLimitMap.get(key);
    
    if (!entry) {
      return Date.now() + this.WINDOW_MS;
    }

    return entry.resetTime;
  }

  public clear(): void {
    this.rateLimitMap.clear();
  }

  public getStatus(url: string, method: string = 'GET'): {
    isLimited: boolean;
    remaining: number;
    resetTime: number;
    total: number;
  } {
    const key = this.generateKey(url, method);
    const entry = this.rateLimitMap.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return {
        isLimited: false,
        remaining: this.MAX_REQUESTS,
        resetTime: now + this.WINDOW_MS,
        total: this.MAX_REQUESTS,
      };
    }

    return {
      isLimited: entry.count >= this.MAX_REQUESTS,
      remaining: Math.max(0, this.MAX_REQUESTS - entry.count),
      resetTime: entry.resetTime,
      total: this.MAX_REQUESTS,
    };
  }
}

export const clientRateLimiter = ClientRateLimiter.getInstance();

// Rate limit error class
export class RateLimitError extends Error {
  public resetTime: number;
  public remaining: number;
  public total: number;

  constructor(message: string, resetTime: number, remaining: number, total: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.remaining = remaining;
    this.total = total;
  }
}

// Utility function to check and record API calls
export function checkRateLimit(url: string, method: string = 'GET'): void {
  // Disable rate limiting in development mode
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  
  if (clientRateLimiter.isRateLimited(url, method)) {
    const status = clientRateLimiter.getStatus(url, method);
    const resetTime = new Date(status.resetTime).toLocaleTimeString();
    
    throw new RateLimitError(
      `Rate limit exceeded. Maximum ${status.total} requests per minute. Try again after ${resetTime}`,
      status.resetTime,
      status.remaining,
      status.total
    );
  }
  
  clientRateLimiter.recordRequest(url, method);
}

// Utility function to get rate limit status
export function getRateLimitStatus(url: string, method: string = 'GET') {
  return clientRateLimiter.getStatus(url, method);
} 