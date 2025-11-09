import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { CacheManager } from "./CacheManager";

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