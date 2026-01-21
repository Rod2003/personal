import type { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

export function getRateLimitKey(req: NextApiRequest): string {
  // Try to get real IP from headers (works with proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.socket.remoteAddress || 'unknown';
  
  return `ratelimit:${ip}`;
}

export function checkRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  config: RateLimitConfig
): boolean {
  const key = getRateLimitKey(req);
  const now = Date.now();
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // First request or window expired, create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (config.maxRequests - 1).toString());
    res.setHeader('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());
    
    return true; // Allow request
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const timeUntilReset = Math.ceil((entry.resetTime - now) / 1000);
    
    res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    res.setHeader('Retry-After', timeUntilReset.toString());
    
    return false; // Block request
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', (config.maxRequests - entry.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  
  return true; // Allow request
}

export function rateLimitResponse(res: NextApiResponse, resetTime: number) {
  const timeUntilReset = Math.ceil((resetTime - Date.now()) / 1000);
  
  return res.status(429).json({
    response: '',
    citations: [],
    error: `Rate limit exceeded. Please try again in ${timeUntilReset} seconds.`,
  });
}
