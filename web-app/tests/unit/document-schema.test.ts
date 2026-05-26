import { describe, it, expect } from 'vitest';
import { documentCreateSchema } from '@/lib/validations/document.schema';

describe('Document Schema Validation', () => {
  describe('documentCreateSchema', () => {
    it('accepts valid document data', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123',
        type: 'PASSPORT',
        filePath: '/uploads/passport.pdf'
      });

      expect(result.success).toBe(true);
    });

    it('accepts VISA document type', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123',
        type: 'VISA',
        filePath: '/uploads/visa.pdf'
      });

      expect(result.success).toBe(true);
    });

    it('accepts MEDICAL document type', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123',
        type: 'MEDICAL',
        filePath: '/uploads/medical.pdf'
      });

      expect(result.success).toBe(true);
    });

    it('accepts document with expiry date', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123',
        type: 'PASSPORT',
        filePath: '/uploads/passport.pdf',
        expiresAt: '2027-01-01'
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid document type', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123',
        type: 'INVALID_TYPE',
        filePath: '/uploads/document.pdf'
      });

      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-123'
      });

      expect(result.success).toBe(false);
    });

    it('rejects empty employeeId', () => {
      const result = documentCreateSchema.safeParse({
        employeeId: '',
        type: 'PASSPORT',
        filePath: '/uploads/passport.pdf'
      });

      expect(result.success).toBe(false);
    });
  });
});