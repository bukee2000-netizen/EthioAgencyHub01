import { getRedisClient } from './client';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number = 60,
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, windowStart);
  multi.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  multi.zcard(key);
  multi.expire(key, windowSeconds);
  const results = await multi.exec();

  const count = (results?.[2] as number) ?? 0;
  const allowed = count <= maxRequests;
  const reset = now + windowSeconds;

  return { allowed, remaining: Math.max(0, maxRequests - count), reset };
}
