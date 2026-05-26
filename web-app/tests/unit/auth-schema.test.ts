import { describe, it, expect } from 'vitest';
import { loginSchema, registerUserSchema, registerAgencySchema } from '@/lib/validations/auth.schema';

describe('Auth Schema Validation', () => {
  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'admin@ethioagencyhub.com',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@ethioagencyhub.com',
        password: '123'
      });

      expect(result.success).toBe(false);
    });

    it('rejects missing email', () => {
      const result = loginSchema.safeParse({
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
    });
  });

  describe('registerUserSchema', () => {
    it('accepts valid user registration data', () => {
      const result = registerUserSchema.safeParse({
        email: 'newuser@ethioagencyhub.com',
        password: 'SecurePass123!',
        agencyId: 'agency-123'
      });

      expect(result.success).toBe(true);
    });

    it('accepts valid user registration with role', () => {
      const result = registerUserSchema.safeParse({
        email: 'newuser@ethioagencyhub.com',
        password: 'SecurePass123!',
        agencyId: 'agency-123',
        role: 'AGENCY_ADMIN'
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid role', () => {
      const result = registerUserSchema.safeParse({
        email: 'newuser@ethioagencyhub.com',
        password: 'SecurePass123!',
        agencyId: 'agency-123',
        role: 'INVALID_ROLE'
      });

      expect(result.success).toBe(false);
    });

    it('defaults to VIEWER role', () => {
      const result = registerUserSchema.safeParse({
        email: 'newuser@ethioagencyhub.com',
        password: 'SecurePass123!',
        agencyId: 'agency-123'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('VIEWER');
      }
    });
  });

  describe('registerAgencySchema', () => {
    it('accepts valid agency registration', () => {
      const result = registerAgencySchema.safeParse({
        agencyName: 'New Agency',
        email: 'agency@example.com',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
    });

    it('rejects short agency name', () => {
      const result = registerAgencySchema.safeParse({
        agencyName: 'A',
        email: 'agency@example.com',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
    });
  });
});