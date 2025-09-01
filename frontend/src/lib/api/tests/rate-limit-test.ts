import { clientRateLimiter, checkRateLimit, getRateLimitStatus } from '../core/rate-limiter';

// Test function to verify rate limiting is working
export function testRateLimiting() {
  console.log('=== Testing Rate Limiting ===');
  
  const testUrl = '/api/test';
  const testMethod = 'GET';
  
  // Test 1: First request should succeed
  try {
    checkRateLimit(testUrl, testMethod);
    console.log('✅ Test 1: First request allowed');
  } catch (error) {
    console.log('❌ Test 1: First request failed:', error);
  }
  
  // Test 2: Second request should succeed
  try {
    checkRateLimit(testUrl, testMethod);
    console.log('✅ Test 2: Second request allowed');
  } catch (error) {
    console.log('❌ Test 2: Second request failed:', error);
  }
  
  // Test 3: Third request should succeed
  try {
    checkRateLimit(testUrl, testMethod);
    console.log('✅ Test 3: Third request allowed');
  } catch (error) {
    console.log('❌ Test 3: Third request failed:', error);
  }
  
  // Test 4: Fourth request should fail (rate limited)
  try {
    checkRateLimit(testUrl, testMethod);
    console.log('❌ Test 4: Fourth request should have been rate limited');
  } catch (error: any) {
    console.log('✅ Test 4: Fourth request correctly rate limited:', error.message);
  }
  
  // Test 5: Check status
  const status = getRateLimitStatus(testUrl, testMethod);
  console.log('📊 Rate limit status:', status);
  
  console.log('=== End Test ===');
}

// Function to clear rate limits for testing
export function clearRateLimitsForTesting() {
  clientRateLimiter.clear();
  console.log('🧹 Rate limits cleared for testing');
}

// Function to get current rate limit info
export function getCurrentRateLimitInfo() {
  return {
    timestamp: new Date().toISOString(),
    description: 'Rate limiting is set to 3 requests per minute per endpoint',
    windowMs: 60 * 1000,
    maxRequests: 3,
  };
} 