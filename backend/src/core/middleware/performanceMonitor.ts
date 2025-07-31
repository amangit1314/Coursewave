import { Request, Response, NextFunction } from 'express';
import { cacheManager } from '../../config/redis';

// Define types for performance metrics
interface PerformanceMetric {
  key: string;
  path?: string;
  method?: string;
  statusCode?: string;
  duration?: string;
  timestamp?: string;
  ip?: string;
}

// Performance monitoring middleware
export const performanceMonitor = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    
    // Capture response data
    const originalSend = res.send;
    res.send = function(body) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
      
      // Store performance metrics in Redis
      storePerformanceMetrics(req, res, duration).catch(console.error);
      
      return originalSend.call(this, body);
    };
    
    next();
  };
};

// Store performance metrics in Redis
async function storePerformanceMetrics(req: Request, res: Response, duration: number) {
  try {
    const path = req.originalUrl;
    const method = req.method;
    const statusCode = res.statusCode;
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create a unique key for this request
    const requestKey = `perf:${timestamp}:${method}:${path}`;
    
    // Store request details
    const metricData = {
      path,
      method,
      statusCode: statusCode.toString(),
      duration: duration.toString(),
      timestamp: timestamp.toString(),
      ip: req.ip || req.socket.remoteAddress || 'unknown'
    };
    
    await cacheManager.set(requestKey, metricData, 24 * 60 * 60); // 24 hours
    
    // Update aggregated metrics
    const pathKey = `perf:path:${path}`;
    const pathData = await cacheManager.get<any>(pathKey) || { count: 0, totalDuration: 0 };
    pathData.count = (pathData.count || 0) + 1;
    pathData.totalDuration = (pathData.totalDuration || 0) + duration;
    await cacheManager.set(pathKey, pathData, 7 * 24 * 60 * 60); // 7 days
    
    // Update status code metrics
    const statusKey = `perf:status:${statusCode}`;
    const statusData = await cacheManager.get<any>(statusKey) || { count: 0 };
    statusData.count = (statusData.count || 0) + 1;
    await cacheManager.set(statusKey, statusData, 7 * 24 * 60 * 60); // 7 days
    
    // Update method metrics
    const methodKey = `perf:method:${method}`;
    const methodData = await cacheManager.get<any>(methodKey) || { count: 0 };
    methodData.count = (methodData.count || 0) + 1;
    await cacheManager.set(methodKey, methodData, 7 * 24 * 60 * 60); // 7 days
    
  } catch (error) {
    console.error('Error storing performance metrics:', error);
  }
}

// Get performance metrics
export const getPerformanceMetrics = async (options: {
  path?: string;
  method?: string;
  statusCode?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}) => {
  try {
    const {
      path,
      method,
      statusCode,
      startTime = Math.floor(Date.now() / 1000) - 24 * 60 * 60, // Last 24 hours
      endTime = Math.floor(Date.now() / 1000),
      limit = 100
    } = options;
    
    // For now, return aggregated metrics since we can't easily search by pattern
    // In a production environment, you might want to use a different approach
    const aggregatedMetrics = {
      totalRequests: 0,
      averageDuration: 0,
      statusCodes: {} as Record<string, number>,
      methods: {} as Record<string, number>,
      paths: {} as Record<string, number>
    };
    
    // Get aggregated metrics from cache
    const pathKey = path ? `perf:path:${path}` : null;
    const methodKey = method ? `perf:method:${method}` : null;
    const statusKey = statusCode ? `perf:status:${statusCode}` : null;
    
    if (pathKey && path) {
      const pathData = await cacheManager.get<any>(pathKey);
      if (pathData) {
        aggregatedMetrics.paths[path] = pathData.count || 0;
        aggregatedMetrics.totalRequests = pathData.count || 0;
        aggregatedMetrics.averageDuration = pathData.totalDuration / pathData.count || 0;
      }
    }
    
    if (methodKey && method) {
      const methodData = await cacheManager.get<any>(methodKey);
      if (methodData) {
        aggregatedMetrics.methods[method] = methodData.count || 0;
      }
    }
    
    if (statusKey && statusCode) {
      const statusData = await cacheManager.get<any>(statusKey);
      if (statusData) {
        aggregatedMetrics.statusCodes[statusCode.toString()] = statusData.count || 0;
      }
    }
    
    return {
      metrics: [], // Individual metrics not easily retrievable without pattern search
      aggregatedMetrics
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return { metrics: [], aggregatedMetrics: {} };
  }
} 