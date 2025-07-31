import { clientRateLimiter, getRateLimitStatus } from './rate-limiter';

// Utility to get all current rate limit statuses
export function getAllRateLimitStatuses() {
  // This would need to be implemented based on your specific endpoints
  // For now, we'll return a generic status
  return {
    global: clientRateLimiter.getStatus('', 'GET'),
    timestamp: new Date().toISOString(),
  };
}

// Utility to clear all rate limits (useful for testing)
export function clearAllRateLimits() {
  clientRateLimiter.clear();
  console.log('All rate limits cleared');
}

// Utility to simulate rate limit testing
export function simulateRateLimitTest(url: string, method: string = 'GET') {
  console.log('=== Rate Limit Test Simulation ===');
  console.log(`Testing: ${method} ${url}`);
  
  for (let i = 1; i <= 5; i++) {
    try {
      const status = getRateLimitStatus(url, method);
      console.log(`Request ${i}:`);
      console.log(`  - Remaining: ${status.remaining}/${status.total}`);
      console.log(`  - Is Limited: ${status.isLimited}`);
      console.log(`  - Reset Time: ${new Date(status.resetTime).toLocaleTimeString()}`);
      
      if (status.isLimited) {
        console.log(`  - ❌ Rate limited! Cannot make request ${i}`);
        break;
      } else {
        console.log(`  - ✅ Request ${i} allowed`);
        clientRateLimiter.recordRequest(url, method);
      }
    } catch (error) {
      console.log(`  - ❌ Error: ${error}`);
    }
  }
  
  console.log('=== End Test ===');
}

// Utility to get rate limit info for debugging
export function getRateLimitDebugInfo() {
  return {
    currentTime: new Date().toISOString(),
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,
    description: 'Rate limiting is set to 3 requests per minute per endpoint',
  };
}

// Utility to check if an endpoint is currently rate limited
export function isEndpointRateLimited(url: string, method: string = 'GET'): boolean {
  return clientRateLimiter.isRateLimited(url, method);
}

// Utility to get time until rate limit resets
export function getTimeUntilReset(url: string, method: string = 'GET'): number {
  const resetTime = clientRateLimiter.getResetTime(url, method);
  return Math.max(0, resetTime - Date.now());
}

// Utility to format time until reset in a human-readable format
export function formatTimeUntilReset(url: string, method: string = 'GET'): string {
  const timeMs = getTimeUntilReset(url, method);
  const seconds = Math.ceil(timeMs / 1000);
  
  if (seconds <= 0) {
    return 'Rate limit has reset';
  }
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
}

// Utility to create a rate limit aware fetch function
export function createRateLimitedFetch(baseUrl: string) {
  return async (endpoint: string, options: RequestInit = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    
    // Check rate limit before making request
    if (clientRateLimiter.isRateLimited(url, method)) {
      const status = clientRateLimiter.getStatus(url, method);
      throw new Error(
        `Rate limit exceeded for ${method} ${url}. Try again after ${new Date(status.resetTime).toLocaleTimeString()}`
      );
    }
    
    // Record the request
    clientRateLimiter.recordRequest(url, method);
    
    // Make the actual request
    return fetch(url, options);
  };
}

// Utility to create a rate limit aware axios instance
export function createRateLimitedAxios(baseURL: string) {
  const axios = require('axios');
  const instance = axios.create({ baseURL });
  
  // Add request interceptor for rate limiting
  instance.interceptors.request.use((config: any) => {
    const url = config.url;
    const method = config.method || 'GET';
    
    // Check rate limit before making request
    if (clientRateLimiter.isRateLimited(url, method)) {
      const status = clientRateLimiter.getStatus(url, method);
      const error = new Error(
        `Rate limit exceeded for ${method} ${url}. Try again after ${new Date(status.resetTime).toLocaleTimeString()}`
      );
      error.name = 'RateLimitError';
      return Promise.reject(error);
    }
    
    // Record the request
    clientRateLimiter.recordRequest(url, method);
    
    return config;
  });
  
  return instance;
} 