// Simple in-memory rate limiter for development purposes

// Store rate limit data in memory
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  };
};

// Separate stores for different limiters
const apiLimitStore: RateLimitStore = {};
const authLimitStore: RateLimitStore = {};

// Rate limiter configuration
type RateLimiterConfig = {
  windowMs: number;
  maxRequests: number;
  store: RateLimitStore;
};

// Create rate limiter configurations
export const apiLimiter: RateLimiterConfig = {
  windowMs: 10 * 1000, // 10 seconds
  maxRequests: 10,
  store: apiLimitStore
};

export const authLimiter: RateLimiterConfig = {
  windowMs: 60 * 1000, // 60 seconds
  maxRequests: 5,
  store: authLimitStore
};

// Define the return type for rateLimit function
export interface RateLimitResult {
  success: boolean;
  limit: number;
  reset: number;
  remaining: number;
  headers: {
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset': string;
  };
}

// Helper function to apply rate limiting to API routes
export async function rateLimit(ip: string, limiter = apiLimiter): Promise<RateLimitResult> {
  const key = ip || 'anonymous';
  const now = Date.now();
  const store = limiter.store;
  
  // Initialize or reset if window has passed
  if (!store[key] || now > store[key].resetAt) {
    store[key] = {
      count: 0,
      resetAt: now + limiter.windowMs
    };
  }
  
  // Increment count
  store[key].count++;
  
  const isRateLimited = store[key].count > limiter.maxRequests;
  const remaining = Math.max(0, limiter.maxRequests - store[key].count);
  const resetAt = store[key].resetAt;
  
  return {
    success: !isRateLimited,
    limit: limiter.maxRequests,
    reset: Math.ceil(resetAt / 1000), // Convert to seconds
    remaining: remaining,
    headers: {
      'X-RateLimit-Limit': String(limiter.maxRequests),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000))
    }
  };
}
