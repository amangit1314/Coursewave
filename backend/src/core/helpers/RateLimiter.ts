import { CacheManager } from "./CacheManager";

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