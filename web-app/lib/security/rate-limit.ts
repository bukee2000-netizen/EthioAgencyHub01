type Bucket = { hits: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterMs: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { hits: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (existing.hits >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.hits += 1;
  return { allowed: true, remaining: limit - existing.hits, retryAfterMs: 0 };
}

export function getClientKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
  return `${prefix}:${ip}`;
}
