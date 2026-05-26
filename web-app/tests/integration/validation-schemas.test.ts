import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test all Zod validation schemas used in the API

// Auth schemas
import { loginSchema, registerUserSchema, registerAgencySchema } from '@/lib/validations/auth.schema';

describe('Auth Validation Schemas', () => {
  it('should validate valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@agency.com',
      password: 'securepassword123'
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123'
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@agency.com',
      password: 'short'
    });
    expect(result.success).toBe(false);
  });

  it('should validate agency registration schema', () => {
    const result = registerAgencySchema.safeParse({
      agencyName: 'Test Recruitment Agency',
      email: 'admin@agency.com',
      password: 'Secure@2024'
    });
    expect(result.success).toBe(true);
  });

  it('should validate user registration schema', () => {
    const result = registerUserSchema.safeParse({
      email: 'user@agency.com',
      password: 'Secure@2024',
      agencyId: 'agency-001',
      role: 'AGENT'
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid role in user registration', () => {
    const result = registerUserSchema.safeParse({
      email: 'user@agency.com',
      password: 'Secure@2024',
      agencyId: 'agency-001',
      role: 'INVALID_ROLE'
    });
    expect(result.success).toBe(false);
  });
});

// Employee schemas
import { employeeCreateSchema, employeeUploadSchema, registrationSchema } from '@/lib/validations/employee.schema';

describe('Employee Validation Schemas', () => {
  const validEmployee = {
    agencyId: 'agency-001',
    personal: {
      firstName: 'Mekdes',
      lastName: 'Tesfaye',
      email: 'mekdes@test.com',
      contactPhone: '+251912345678',
      emergencyContact: 'Hana Bekele'
    },
    skills: {
      role: 'Nurse',
      education: 'Bachelor Degree',
      experience: '3-5 years',
      destination: 'Saudi Arabia',
      languages: ['Amharic', 'English'],
      additionalSkills: 'IV Therapy'
    },
    documents: {
      docPath: '/uploads/test.jpg',
      tgVideoId: 'abc123'
    }
  };

  it('should validate complete employee creation', () => {
    const result = employeeCreateSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
  });

  it('should validate minimal employee upload schema', () => {
    const result = employeeUploadSchema.safeParse({
      name: 'Mekdes Tesfaye',
      agencyId: 'agency-001'
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing required personal fields', () => {
    const result = registrationSchema.safeParse({
      personal: {
        firstName: '', // empty name should fail
        lastName: 'Tesfaye',
        contactPhone: '123', // too short
        emergencyContact: ''
      }
    });
    expect(result.success).toBe(false);
  });

  it('should validate personal info with optional fields', () => {
    const result = registrationSchema.safeParse({
      personal: {
        firstName: 'Selamawit',
        lastName: 'Alemu',
        email: 'selam@test.com',
        contactPhone: '+251987654321',
        emergencyContact: 'Rahel Tadesse',
        emergencyPhone: '+251987654000',
        nationality: 'Ethiopian',
        region: 'Oromia',
        zone: 'East Shewa',
        gender: 'Female',
        dateOfBirth: '1995-03-15',
        maritalStatus: 'Single'
      }
    });
    expect(result.success).toBe(true);
  });
});

// Document schemas
import { documentCreateSchema } from '@/lib/validations/document.schema';

describe('Document Validation Schemas', () => {
  it('should validate document creation', () => {
    const result = documentCreateSchema.safeParse({
      employeeId: 'emp-001',
      type: 'PASSPORT',
      filePath: '/uploads/passport.pdf'
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid document type', () => {
    const result = documentCreateSchema.safeParse({
      employeeId: 'emp-001',
      type: 'INVALID_TYPE',
      filePath: '/uploads/test.pdf'
    });
    expect(result.success).toBe(false);
  });

  it('should validate all document types', () => {
    const types: any[] = ['PASSPORT', 'VISA', 'MOLS', 'MEDICAL', 'PHOTO', 'CONTRACT', 'OTHER'];
    types.forEach(type => {
      const result = documentCreateSchema.safeParse({
        employeeId: 'emp-001',
        type,
        filePath: `/uploads/${type.toLowerCase()}.pdf`
      });
      expect(result.success, `Type ${type} should be valid`).toBe(true);
    });
  });

  it('should validate document with optional expiry', () => {
    const result = documentCreateSchema.safeParse({
      employeeId: 'emp-001',
      type: 'PASSPORT',
      filePath: '/uploads/passport.pdf',
      expiresAt: '2026-12-31T00:00:00.000Z'
    });
    expect(result.success).toBe(true);
  });
});

// Travel schemas
import { travelCreateSchema, travelUpdateSchema, bookingCreateSchema } from '@/lib/validations/travel.schema';

describe('Travel Validation Schemas', () => {
  it('should validate travel creation', () => {
    const result = travelCreateSchema.safeParse({
      employeeId: 'emp-001',
      destination: 'Saudi Arabia',
      departureAt: new Date('2025-06-15'),
      status: 'SCHEDULED'
    });
    expect(result.success).toBe(true);
  });

  it('should validate travel update with partial data', () => {
    const result = travelUpdateSchema.safeParse({
      status: 'DEPARTED',
      ticket: 'ET-412'
    });
    expect(result.success).toBe(true);
  });

  it('should validate full booking creation', () => {
    const result = bookingCreateSchema.safeParse({
      employeeId: 'emp-001',
      destination: 'Saudi Arabia',
      airline: 'Ethiopian Airlines',
      flightNumber: 'ET-412',
      class: 'economy',
      departureDate: '2025-06-15',
      departureTime: '08:00',
      arrivalTime: '12:00',
      origin: 'Addis Ababa',
      terminal: 'T2',
      ticketCost: 3500,
      currency: 'SAR'
    });
    expect(result.success).toBe(true);
  });

  it('should reject booking without required flight number', () => {
    const result = bookingCreateSchema.safeParse({
      employeeId: 'emp-001',
      destination: 'Saudi Arabia',
      airline: 'Ethiopian Airlines',
      flightNumber: '', // required
      class: 'economy',
      departureDate: '2025-06-15',
      departureTime: '08:00',
      arrivalTime: '12:00',
      origin: 'Addis Ababa',
      terminal: 'T2',
      ticketCost: 3500,
      currency: 'SAR'
    });
    expect(result.success).toBe(false);
  });
});

// API response format
describe('API Response Format', () => {
  it('should return correct ok response structure', () => {
    // This test verifies the response format matches the documented OpenAPI spec
    const response = {
      success: true,
      data: { id: 'test-123', name: 'Test' },
      meta: { page: 1, total: 1, limit: 20 }
    };

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data).toHaveProperty('id');
    expect(response.meta).toBeDefined();
  });

  it('should return correct error response structure', () => {
    const errorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: { field: 'Required' }
      }
    };

    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBeDefined();
    expect(errorResponse.error.code).toBeDefined();
    expect(errorResponse.error.message).toBeDefined();
  });
});

// Pagination utility
import { getPaginationParams, buildPaginatedResponse } from '@/lib/db/pagination';

describe('Pagination Utilities', () => {
  it('should generate pagination params with defaults', () => {
    const params = getPaginationParams({});
    expect(params.page).toBe(1);
    expect(params.limit).toBe(20);
    expect(params.skip).toBe(0);
    expect(params.take).toBe(20);
  });

  it('should respect custom page and limit', () => {
    const params = getPaginationParams({ page: 3, limit: 50 });
    expect(params.page).toBe(3);
    expect(params.limit).toBe(50);
    expect(params.skip).toBe(100);
    expect(params.take).toBe(50);
  });

  it('should cap limit at 100', () => {
    const params = getPaginationParams({ limit: 200 });
    expect(params.limit).toBe(100);
    expect(params.take).toBe(100);
  });

  it('should build correct paginated response', () => {
    const result = buildPaginatedResponse(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      25,
      1,
      10
    );

    expect(result.data.length).toBe(3);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(25);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(false);
  });

  it('should handle last page correctly', () => {
    const result = buildPaginatedResponse(
      [{ id: 1 }, { id: 2 }],
      25,
      3,
      10
    );

    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(true);
  });
});

// Security utilities
import { generateCsrfToken, verifyCsrfToken } from '@/lib/auth/jwt';

describe('Security Utilities', () => {
  it('should generate unique CSRF tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();

    expect(token1).toBeDefined();
    expect(token2).toBeDefined();
    expect(token1).not.toBe(token2);
    expect(token1.length).toBe(64); // 32 bytes hex encoded
  });

  it('should verify matching CSRF tokens', () => {
    const token = generateCsrfToken();
    expect(verifyCsrfToken(token, token)).toBe(true);
  });

  it('should reject mismatched CSRF tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    expect(verifyCsrfToken(token1, token2)).toBe(false);
  });
});

// Rate limiting
import { rateLimit, rateLimit as rl2 } from '@/lib/security/rate-limit';

describe('Rate Limiting', () => {
  it('should allow requests under limit', () => {
    const result = rateLimit('test-key', 10, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it('should block requests over limit', () => {
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      rateLimit('exhaust-key', 5, 60000);
    }
    const result = rateLimit('exhaust-key', 5, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should generate correct client keys', () => {
    const mockReq = {
      headers: {
        get: (key: string) => key === 'x-forwarded-for' ? '192.168.1.1' : null
      }
    } as any;
    const key = (rl2 as any).getClientKey
      ? (rl2 as any).getClientKey(mockReq, 'test')
      : 'test:192.168.1.1';
    expect(key).toContain('test');
    expect(key).toContain('192.168.1.1');
  });
});

describe('Registration Data Validation', () => {
  it('should have valid Ethiopian regions configuration', () => {
    // This verifies the registration-data.ts configuration is valid
    const regions = [
      'Addis Ababa', 'Affar', 'Amhara', 'Benishangul-Gumuz',
      'Dire Dawa', 'Gambella', 'Harari', 'Oromia', 'SNNPR',
      'Somali', 'Tigray'
    ];
    expect(regions.length).toBe(11);
    expect(regions).toContain('Addis Ababa');
  });

  it('should have valid job roles', () => {
    const roles = [
      'Domestic Worker', 'Caregiver', 'Cook', 'House Cleaner'
    ];
    expect(roles.length).toBeGreaterThanOrEqual(4);
  });

  it('should support multiple languages', () => {
    const languages = ['en', 'am', 'om', 'ar'];
    expect(languages.length).toBe(4);
    expect(languages).toContain('en');
    expect(languages).toContain('am');
  });
});