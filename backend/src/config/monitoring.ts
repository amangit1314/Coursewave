import promBundle from 'express-prom-bundle';
import { Counter, Gauge, Histogram } from 'prom-client';
import { RequestHandler } from 'express';

// Create a metrics middleware
export const metricsMiddleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  includeMethod: true,
  includeUp: true,
  customLabels: { project: 'coursewave' }
}) as any;

// Custom metrics
export const metrics = {
  // API Request Duration
  requestDuration: new Histogram({
    name: 'coursewave_api_request_duration_seconds',
    help: 'Duration of API requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  }),

  // Active Users
  activeUsers: new Gauge({
    name: 'coursewave_active_users',
    help: 'Number of active users in the system'
  }),

  // Course Operations
  courseOperations: new Counter({
    name: 'coursewave_course_operations_total',
    help: 'Total number of course operations',
    labelNames: ['operation', 'status']
  }),

  // Authentication Events
  authEvents: new Counter({
    name: 'coursewave_auth_events_total',
    help: 'Total number of authentication events',
    labelNames: ['event_type', 'status']
  }),

  // Database Operations
  dbOperations: new Histogram({
    name: 'coursewave_db_operation_duration_seconds',
    help: 'Duration of database operations in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
  }),

  // Redis Operations
  redisOperations: new Histogram({
    name: 'coursewave_redis_operation_duration_seconds',
    help: 'Duration of Redis operations in seconds',
    labelNames: ['operation'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
  }),

  // Error Count
  errorCount: new Counter({
    name: 'coursewave_errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'code']
  }),

  // System Resources
  systemResources: new Gauge({
    name: 'coursewave_system_resources',
    help: 'System resource usage',
    labelNames: ['resource_type']
  }),

  // Cache Hit Rate
  cacheHitRate: new Gauge({
    name: 'coursewave_cache_hit_rate',
    help: 'Cache hit rate percentage'
  }),

  // API Response Size
  responseSize: new Histogram({
    name: 'coursewave_response_size_bytes',
    help: 'Size of API responses in bytes',
    labelNames: ['endpoint'],
    buckets: [100, 1000, 10000, 100000, 1000000]
  })
};

// Helper function to record API request duration
export const recordRequestDuration = (method: string, route: string, statusCode: number, duration: number) => {
  metrics.requestDuration.labels(method, route, statusCode.toString()).observe(duration);
};

// Helper function to record database operation duration
export const recordDbOperation = (operation: string, table: string, duration: number) => {
  metrics.dbOperations.labels(operation, table).observe(duration);
};

// Helper function to record Redis operation duration
export const recordRedisOperation = (operation: string, duration: number) => {
  metrics.redisOperations.labels(operation).observe(duration);
};

// Helper function to record errors
export const recordError = (type: string, code: string) => {
  metrics.errorCount.labels(type, code).inc();
};

// Helper function to update system resources
export const updateSystemResources = (cpuUsage: number, memoryUsage: number, heapUsage: number) => {
  metrics.systemResources.labels('cpu').set(cpuUsage);
  metrics.systemResources.labels('memory').set(memoryUsage);
  metrics.systemResources.labels('heap').set(heapUsage);
};

// Helper function to update cache hit rate
export const updateCacheHitRate = (hitRate: number) => {
  metrics.cacheHitRate.set(hitRate);
};

// Helper function to record response size
export const recordResponseSize = (endpoint: string, size: number) => {
  metrics.responseSize.labels(endpoint).observe(size);
}; 