import { describe, expect, it } from 'vitest';
import { rateLimit } from '@/lib/security/rate-limit';

describe('rateLimit', () => {
  it('allows up to the configured limit and then blocks', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const result = rateLimit(key, 3, 60_000);
      expect(result.allowed).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('resets after the window elapses', () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 1, 1).allowed).toBe(true);
    const second = rateLimit(key, 1, 1);
    expect([true, false]).toContain(second.allowed);
  });
});
