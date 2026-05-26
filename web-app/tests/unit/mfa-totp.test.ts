import { describe, it, expect } from 'vitest';
import {
  generateTOTPSecret,
  generateOTPAuthURL,
  verifyTOTP,
  generateBackupCodes,
  hashBackupCode,
  hashBackupCodes,
  verifyBackupCode,
} from '@/lib/mfa/totp';

describe('MFA / TOTP Library', () => {
  describe('generateTOTPSecret', () => {
    it('generates a base32 secret string', () => {
      const secret = generateTOTPSecret();
      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThan(20);
      expect(/^[A-Z2-7]+=*$/.test(secret)).toBe(true);
    });

    it('generates unique secrets each time', () => {
      const s1 = generateTOTPSecret();
      const s2 = generateTOTPSecret();
      expect(s1).not.toBe(s2);
    });
  });

  describe('generateOTPAuthURL', () => {
    it('generates a valid otpauth URL', () => {
      const secret = generateTOTPSecret();
      const url = generateOTPAuthURL(secret, 'user@test.com');
      expect(url).toContain('otpauth://totp/');
      expect(url).toContain('secret=' + secret);
      expect(url).toContain('issuer=EthioAgencyHub');
    });

    it('accepts custom issuer', () => {
      const secret = generateTOTPSecret();
      const url = generateOTPAuthURL(secret, 'user@test.com', 'MyApp');
      expect(url).toContain('issuer=MyApp');
    });
  });

  describe('verifyTOTP', () => {
    it('returns false for invalid token', () => {
      const secret = generateTOTPSecret();
      expect(verifyTOTP('000000', secret)).toBe(false);
    });

    it('returns false for empty token', () => {
      const secret = generateTOTPSecret();
      expect(verifyTOTP('', secret)).toBe(false);
    });
  });

  describe('generateBackupCodes', () => {
    it('generates the requested number of codes', () => {
      const codes = generateBackupCodes(8);
      expect(codes).toHaveLength(8);
    });

    it('generates codes in XXXX-XXXX format', () => {
      const codes = generateBackupCodes(4);
      for (const code of codes) {
        expect(code).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}$/);
      }
    });

    it('defaults to 8 codes', () => {
      const codes = generateBackupCodes();
      expect(codes).toHaveLength(8);
    });
  });

  describe('hashBackupCode', () => {
    it('returns a hex string', () => {
      const hash = hashBackupCode('ABCD-1234');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('produces deterministic output', () => {
      const hash1 = hashBackupCode('ABCD-1234');
      const hash2 = hashBackupCode('ABCD-1234');
      expect(hash1).toBe(hash2);
    });
  });

  describe('hashBackupCodes', () => {
    it('returns a JSON string of hashed codes', () => {
      const codes = ['AAAA-1111', 'BBBB-2222'];
      const hashed = hashBackupCodes(codes);
      const parsed = JSON.parse(hashed);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('verifyBackupCode', () => {
    it('returns null for invalid code', () => {
      const codes = ['AAAA-1111', 'BBBB-2222'];
      const hashed = hashBackupCodes(codes);
      const result = verifyBackupCode('ZZZZ-9999', hashed);
      expect(result).toBeNull();
    });

    it('removes used code and returns remaining codes', () => {
      const codes = ['AAAA-1111', 'BBBB-2222'];
      const hashed = hashBackupCodes(codes);
      const remaining = verifyBackupCode('AAAA-1111', hashed);
      expect(remaining).not.toBeNull();
      const parsed = JSON.parse(remaining!);
      expect(parsed).toHaveLength(1);
    });

    it('handles codes without dashes', () => {
      const codes = ['AAAA-1111'];
      const hashed = hashBackupCodes(codes);
      const result = verifyBackupCode('AAAA1111', hashed);
      expect(result).not.toBeNull();
    });
  });
});
