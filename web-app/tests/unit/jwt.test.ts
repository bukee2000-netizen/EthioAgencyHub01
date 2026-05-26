import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signSessionToken, verifySessionToken, generateRefreshToken, verifyRefreshToken, generateCsrfToken } from '@/lib/auth/jwt';

describe('JWT Utilities', () => {
  const originalEnv = process.env.JWT_SECRET;
  
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
  });

  it('should sign and verify session tokens', () => {
    const payload = { userId: 'user-123', agencyId: 'agency-456', role: 'AGENCY_ADMIN' as const };
    const token = signSessionToken(payload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const verified = verifySessionToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.agencyId).toBe(payload.agencyId);
    expect(verified.role).toBe(payload.role);
  });

  it('should generate and verify refresh tokens', () => {
    const userId = 'user-123';
    const token = generateRefreshToken(userId, 1);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const verified = verifyRefreshToken(token);
    expect(verified.userId).toBe(userId);
    expect(verified.version).toBe(1);
    expect(verified.tokenId).toBeDefined();
  });

  it('should generate CSRF tokens', () => {
    const token = generateCsrfToken();
    
    expect(token).toBeDefined();
    expect(token.length).toBe(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it('should throw on invalid JWT_SECRET', () => {
    process.env.JWT_SECRET = 'short';
    
    expect(() => signSessionToken({ userId: 'test', agencyId: 'test', role: 'VIEWER' as const }))
      .toThrow('JWT_SECRET must be set and at least 32 characters long');
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalEnv;
  });
});