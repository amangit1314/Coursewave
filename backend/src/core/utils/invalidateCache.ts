import { CACHE_PREFIXES } from "../../config/constants/cachePrefixes";
import { CacheManager } from "../helpers/CacheManager";

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
    await cacheManager.delPattern("*");
  },

  // Invalidate search cache
  search: async (query?: string) => {
    const cacheManager = CacheManager.getInstance();
    if (query) {
      await cacheManager.del(`${CACHE_PREFIXES.SEARCH}:${query}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.SEARCH}:*`);
  },
};