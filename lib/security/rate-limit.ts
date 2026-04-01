/**
 * Rate Limiting Middleware for API Routes
 * Prevents abuse and DDoS attacks
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Clean expired entries
 */
const cleanExpiredEntries = () => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
};

/**
 * Rate limit middleware
 * @param request - NextRequest object
 * @param limit - Number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Response or null if within limit
 */
export const rateLimit = (
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 900000 // 15 minutes
): NextResponse | null => {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  cleanExpiredEntries();

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs };
    return null;
  }

  if (store[key].resetTime < now) {
    store[key] = { count: 1, resetTime: now + windowMs };
    return null;
  }

  store[key].count++;

  if (store[key].count > limit) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
};

export default rateLimit;
