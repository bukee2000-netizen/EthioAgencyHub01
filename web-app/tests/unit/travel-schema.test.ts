import { describe, it, expect } from 'vitest';
import { travelCreateSchema, travelUpdateSchema } from '@/lib/validations/travel.schema';

describe('Travel Schema Validation', () => {
  describe('travelCreateSchema', () => {
    it('accepts valid travel data', () => {
      const result = travelCreateSchema.safeParse({
        employeeId: 'emp-123',
        destination: 'United Arab Emirates',
        departureAt: '2025-06-15'
      });

      expect(result.success).toBe(true);
    });

    it('accepts travel with ticket', () => {
      const result = travelCreateSchema.safeParse({
        employeeId: 'emp-123',
        destination: 'Saudi Arabia',
        departureAt: '2025-07-01',
        ticket: 'EK-123456'
      });

      expect(result.success).toBe(true);
    });

    it('rejects empty destination', () => {
      const result = travelCreateSchema.safeParse({
        employeeId: 'emp-123',
        destination: '',
        departureAt: '2025-06-15'
      });

      expect(result.success).toBe(false);
    });

    it('rejects missing departure date', () => {
      const result = travelCreateSchema.safeParse({
        employeeId: 'emp-123',
        destination: 'UAE'
      });

      expect(result.success).toBe(false);
    });

    it('rejects missing employeeId', () => {
      const result = travelCreateSchema.safeParse({
        destination: 'UAE',
        departureAt: '2025-06-15'
      });

      expect(result.success).toBe(false);
    });
  });

  describe('travelUpdateSchema', () => {
    it('accepts partial update', () => {
      const result = travelUpdateSchema.safeParse({
        status: 'DEPARTED'
      });

      expect(result.success).toBe(true);
    });

    it('accepts ticket update', () => {
      const result = travelUpdateSchema.safeParse({
        ticket: 'EK-999999'
      });

      expect(result.success).toBe(true);
    });

    it('accepts destination update', () => {
      const result = travelUpdateSchema.safeParse({
        destination: 'Qatar'
      });

      expect(result.success).toBe(true);
    });

    it('accepts empty update (noop)', () => {
      const result = travelUpdateSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it('accepts valid status values', () => {
      const statuses = ['SCHEDULED', 'TICKETED', 'READY', 'DEPARTED', 'ARRIVED', 'CANCELLED'];
      
      statuses.forEach(status => {
        const result = travelUpdateSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid status', () => {
      const result = travelUpdateSchema.safeParse({
        status: 'INVALID_STATUS'
      });

      expect(result.success).toBe(false);
    });
  });
});