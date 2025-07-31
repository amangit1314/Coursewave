

/**
 * Cache utilities for common operations
 */

import { CACHE_PREFIXES, CACHE_TTL, cacheManager } from "../../config/redis";

// Course-related cache utilities
export const courseCache = {
  // Cache course by ID
  async setCourse(courseId: string, courseData: any): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.COURSES}:${courseId}`, courseData, CACHE_TTL.MEDIUM);
  },

  // Get course by ID
  async getCourse<T>(courseId: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.COURSES}:${courseId}`);
  },

  // Cache course list
  async setCourseList(query: string, courses: any[]): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.COURSES}:list:${query}`, courses, CACHE_TTL.MEDIUM);
  },

  // Get course list
  async getCourseList<T>(query: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.COURSES}:list:${query}`);
  },

  // Cache popular courses
  async setPopularCourses(courses: any[]): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.COURSES}:popular`, courses, CACHE_TTL.LONG);
  },

  // Get popular courses
  async getPopularCourses<T>(): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.COURSES}:popular`);
  },

  // Invalidate course cache
  async invalidate(courseId?: string): Promise<void> {
    if (courseId) {
      await cacheManager.del(`${CACHE_PREFIXES.COURSES}:${courseId}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.COURSES}:*`);
  }
};

// Blog-related cache utilities
export const blogCache = {
  // Cache blog by slug
  async setBlog(slug: string, blogData: any): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.BLOGS}:${slug}`, blogData, CACHE_TTL.MEDIUM);
  },

  // Get blog by slug
  async getBlog<T>(slug: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.BLOGS}:${slug}`);
  },

  // Cache blog list
  async setBlogList(query: string, blogs: any[]): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.BLOGS}:list:${query}`, blogs, CACHE_TTL.MEDIUM);
  },

  // Get blog list
  async getBlogList<T>(query: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.BLOGS}:list:${query}`);
  },

  // Invalidate blog cache
  async invalidate(slug?: string): Promise<void> {
    if (slug) {
      await cacheManager.del(`${CACHE_PREFIXES.BLOGS}:${slug}`);
    }
    await cacheManager.delPattern(`${CACHE_PREFIXES.BLOGS}:*`);
  }
};

// User-related cache utilities
export const userCache = {
  // Cache user profile
  async setUserProfile(userId: string, userData: any): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.USERS}:${userId}:profile`, userData, CACHE_TTL.LONG);
  },

  // Get user profile
  async getUserProfile<T>(userId: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.USERS}:${userId}:profile`);
  },

  // Cache user preferences
  async setUserPreferences(userId: string, preferences: any): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.USERS}:${userId}:preferences`, preferences, CACHE_TTL.LONG);
  },

  // Get user preferences
  async getUserPreferences<T>(userId: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.USERS}:${userId}:preferences`);
  },

  // Invalidate user cache
  async invalidate(userId?: string): Promise<void> {
    if (userId) {
      await cacheManager.delPattern(`${CACHE_PREFIXES.USERS}:${userId}:*`);
    } else {
      await cacheManager.delPattern(`${CACHE_PREFIXES.USERS}:*`);
    }
  }
};

// Category-related cache utilities
export const categoryCache = {
  // Cache categories list
  async setCategories(categories: any[]): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.CATEGORIES}:list`, categories, CACHE_TTL.VERY_LONG);
  },

  // Get categories list
  async getCategories<T>(): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.CATEGORIES}:list`);
  },

  // Invalidate categories cache
  async invalidate(): Promise<void> {
    await cacheManager.delPattern(`${CACHE_PREFIXES.CATEGORIES}:*`);
  }
};

// Search-related cache utilities
export const searchCache = {
  // Cache search results
  async setSearchResults(query: string, results: any[]): Promise<void> {
    const normalizedQuery = query.toLowerCase().trim();
    await cacheManager.set(`${CACHE_PREFIXES.SEARCH}:${normalizedQuery}`, results, CACHE_TTL.SHORT);
  },

  // Get search results
  async getSearchResults<T>(query: string): Promise<T | null> {
    const normalizedQuery = query.toLowerCase().trim();
    return await cacheManager.get<T>(`${CACHE_PREFIXES.SEARCH}:${normalizedQuery}`);
  },

  // Invalidate search cache
  async invalidate(query?: string): Promise<void> {
    if (query) {
      const normalizedQuery = query.toLowerCase().trim();
      await cacheManager.del(`${CACHE_PREFIXES.SEARCH}:${normalizedQuery}`);
    } else {
      await cacheManager.delPattern(`${CACHE_PREFIXES.SEARCH}:*`);
    }
  }
};

// Analytics cache utilities
export const analyticsCache = {
  // Cache analytics data
  async setAnalytics(key: string, data: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.ANALYTICS}:${key}`, data, ttl);
  },

  // Get analytics data
  async getAnalytics<T>(key: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.ANALYTICS}:${key}`);
  },

  // Cache dashboard stats
  async setDashboardStats(userId: string, stats: any): Promise<void> {
    await cacheManager.set(`${CACHE_PREFIXES.ANALYTICS}:dashboard:${userId}`, stats, CACHE_TTL.SHORT);
  },

  // Get dashboard stats
  async getDashboardStats<T>(userId: string): Promise<T | null> {
    return await cacheManager.get<T>(`${CACHE_PREFIXES.ANALYTICS}:dashboard:${userId}`);
  },

  // Invalidate analytics cache
  async invalidate(key?: string): Promise<void> {
    if (key) {
      await cacheManager.del(`${CACHE_PREFIXES.ANALYTICS}:${key}`);
    } else {
      await cacheManager.delPattern(`${CACHE_PREFIXES.ANALYTICS}:*`);
    }
  }
};

// Generic cache wrapper with fallback
export const cacheWithFallback = async <T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> => {
  try {
    // Try to get from cache first
    const cached = await cacheManager.get<T>(key);
    if (cached) {
      return cached;
    }

    // If not in cache, execute fallback
    const data = await fallback();
    
    // Cache the result
    await cacheManager.set(key, data, ttl);
    
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // If cache fails, still try fallback
    return await fallback();
  }
};

// Cache decorator for functions
export const cached = (key: string, ttl: number = CACHE_TTL.MEDIUM) => {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${key}:${args.join(':')}`;
      
      try {
        const cached = await cacheManager.get(cacheKey);
        if (cached) {
          return cached;
        }

        const result = await method.apply(this, args);
        await cacheManager.set(cacheKey, result, ttl);
        return result;
      } catch (error) {
        console.error('Cache decorator error:', error);
        return await method.apply(this, args);
      }
    };
  };
};

// Export all cache utilities
export default {
  courseCache,
  blogCache,
  userCache,
  categoryCache,
  searchCache,
  analyticsCache,
  cacheWithFallback,
  cached
}; 