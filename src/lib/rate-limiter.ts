import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: RateLimitConfig) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    // Increment request count
    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - record.count);
  }

  getResetTime(identifier: string): number {
    const record = this.requests.get(identifier);
    return record ? record.resetTime : Date.now() + this.config.windowMs;
  }
}

// Create rate limiters for different endpoints
const rateLimiters = {
  courseGeneration: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 requests per minute
  api: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 requests per minute
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }) // 5 requests per 15 minutes
};

export function getRateLimiter(type: keyof typeof rateLimiters) {
  return rateLimiters[type];
}

export function getClientIdentifier(request: NextRequest): string {
  // Use IP address as identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

export function checkRateLimit(request: NextRequest, type: keyof typeof rateLimiters) {
  const identifier = getClientIdentifier(request);
  const limiter = getRateLimiter(type);
  
  if (!limiter.isAllowed(identifier)) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: limiter.getResetTime(identifier)
    };
  }

  return {
    allowed: true,
    remaining: limiter.getRemainingRequests(identifier),
    resetTime: limiter.getResetTime(identifier)
  };
} 