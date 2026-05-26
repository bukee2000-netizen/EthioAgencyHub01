import { describe, expect, it } from 'vitest';
import { employeeCreateSchema } from '@/lib/validations/employee.schema';

describe('employeeCreateSchema', () => {
  it('accepts a valid employee payload', () => {
    const result = employeeCreateSchema.safeParse({
      agencyId: 'agency-1',
      personal: {
        firstName: 'Mekdes',
        lastName: 'Tesfaye',
        email: 'mekdes@example.com',
        contactPhone: '+251912345678',
        emergencyContact: 'John Doe'
      }
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing agency and short name', () => {
    const result = employeeCreateSchema.safeParse({ agencyId: '' });

    expect(result.success).toBe(false);
  });
});
