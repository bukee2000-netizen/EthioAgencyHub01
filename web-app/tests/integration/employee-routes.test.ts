import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth/password';

vi.mock('@/lib/auth/session', () => {
  class MockAuthorizationError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      this.name = 'AuthorizationError';
    }
  }

  return {
    getSession: vi.fn(() => null),
    requireSession: vi.fn(() => ({
      userId: 'test-user-id',
      agencyId: 'test-agency-id',
      role: 'AGENCY_ADMIN' as const,
    })),
    requireRole: vi.fn(() => ({
      userId: 'test-user-id',
      agencyId: 'test-agency-id',
      role: 'AGENCY_ADMIN' as const,
    })),
    verifyCsrf: vi.fn(() => true),
    requireCsrf: vi.fn(),
    AuthorizationError: MockAuthorizationError,
  };
});

import { getSession, requireRole, AuthorizationError } from '@/lib/auth/session';
import { GET as ListGET, POST as CreatePOST } from '@/app/api/employees/route';
import { GET as GetGET, PUT as UpdatePUT, DELETE as DeleteDELETE } from '@/app/api/employees/[id]/route';

const mockSession = {
  userId: 'test-user-id',
  agencyId: 'test-agency-id',
  role: 'AGENCY_ADMIN' as const,
};

// ─────────────────────────────────────────────────────────────
//  Unauthenticated — all routes should reject or degrade gracefully
// ─────────────────────────────────────────────────────────────

describe('Employee API Routes - Unauthenticated', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockReturnValue(null);
    vi.mocked(requireRole).mockImplementation(() => {
      throw new AuthorizationError('Authentication required', 401);
    });
  });

  it('GET /api/employees returns 200 with empty array when not authenticated', async () => {
    const res = await ListGET(new Request('http://localhost/api/employees'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.meta.source).toBe('mock');
  });

  it('POST /api/employees returns 400 when not authenticated', async () => {
    const res = await CreatePOST(
      new Request('http://localhost/api/employees', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('GET /api/employees/[id] returns 401 when not authenticated', async () => {
    const res = await GetGET(new Request('http://localhost/api/employees/some-id'), {
      params: { id: 'some-id' },
    });

    expect(res.status).toBe(401);
  });

  it('PUT /api/employees/[id] returns 401 when not authenticated', async () => {
    const res = await UpdatePUT(
      new Request('http://localhost/api/employees/some-id', {
        method: 'PUT',
        body: JSON.stringify({ firstName: 'Updated' }),
      }),
      { params: { id: 'some-id' } },
    );

    expect(res.status).toBe(401);
  });

  it('DELETE /api/employees/[id] returns 401 when not authenticated', async () => {
    const res = await DeleteDELETE(new Request('http://localhost/api/employees/some-id', { method: 'DELETE' }), {
      params: { id: 'some-id' },
    });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
//  Authenticated — mock data path  (DATABASE_URL not set)
// ─────────────────────────────────────────────────────────────

describe('Employee API Routes - Authenticated (Mock Data)', () => {
  beforeAll(() => {
    vi.mocked(getSession).mockReturnValue(mockSession);
    vi.mocked(requireRole).mockReturnValue(mockSession);
  });

  it('GET /api/employees returns all mock employees', async () => {
    const res = await ListGET(new Request('http://localhost/api/employees'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.meta.source).toBe('mock');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/employees creates employee and returns mock response', async () => {
    const payload = {
      personal: {
        firstName: 'Abebe',
        lastName: 'Kebede',
        email: 'abebe@example.com',
        contactPhone: '+251911111111',
        emergencyContact: 'Kebede Abebe',
      },
      skills: { role: 'Domestic Worker', destination: 'Saudi Arabia' },
    };

    const res = await CreatePOST(
      new Request('http://localhost/api/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.source).toBe('mock');
    expect(body.data.status).toBe('REGISTERED');
    expect(body.data.id).toMatch(/^mock-/);
  });

  it('GET /api/employees/[id] returns matching mock employee', async () => {
    const res = await GetGET(new Request('http://localhost/api/employees/EAH-1024'), {
      params: { id: 'EAH-1024' },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('EAH-1024');
  });

  it('GET /api/employees/[id] returns 404 for unknown id', async () => {
    const res = await GetGET(new Request('http://localhost/api/employees/non-existent-id'), {
      params: { id: 'non-existent-id' },
    });

    expect(res.status).toBe(404);
  });

  it('PUT /api/employees/[id] updates employee and returns mock response', async () => {
    const res = await UpdatePUT(
      new Request('http://localhost/api/employees/EAH-1024', {
        method: 'PUT',
        body: JSON.stringify({
          personal: {
            firstName: 'Updated',
            lastName: 'Name',
            email: 'updated@example.com',
            contactPhone: '+251911223344',
            emergencyContact: 'Emergency Person',
          },
        }),
      }),
      { params: { id: 'EAH-1024' } },
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.source).toBe('mock');
    expect(body.data.id).toBe('EAH-1024');
  });

  it('DELETE /api/employees/[id] archives employee and returns mock response', async () => {
    const res = await DeleteDELETE(new Request('http://localhost/api/employees/EAH-1024', { method: 'DELETE' }), {
      params: { id: 'EAH-1024' },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.source).toBe('mock');
    expect(body.data.deleted).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
//  Authenticated — real database  (file:./test.db)
// ─────────────────────────────────────────────────────────────

describe('Employee API Routes - Authenticated (Database)', () => {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.TEST_DATABASE_URL || 'file:./test.db' } },
  });

  let agencyId: string;
  let testEmployeeId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db';

    vi.mocked(getSession).mockReturnValue(mockSession);
    vi.mocked(requireRole).mockReturnValue(mockSession);

    // Clean up tables that depend on employee / agency
    await prisma.auditLog.deleteMany();
    await prisma.paymentWebhook.deleteMany();
    await prisma.crossMatchResult.deleteMany();
    await prisma.molsRecord.deleteMany();
    await prisma.visaApplication.deleteMany();
    await prisma.travel.deleteMany();
    await prisma.document.deleteMany();
    await prisma.employeeDraft.deleteMany();
    await prisma.generatedCv.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.institution.deleteMany();
    await prisma.user.deleteMany();
    await prisma.agency.deleteMany();

    // Seed agency matching the mock session
    const agency = await prisma.agency.create({
      data: { id: mockSession.agencyId, name: 'Test Agency' },
    });
    agencyId = agency.id;

    // Seed a user for the agency
    await prisma.user.create({
      data: {
        email: 'admin@test-agency.com',
        passwordHash: await hashPassword('Test@123456'),
        role: 'AGENCY_ADMIN',
        agencyId,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.employee.deleteMany();
    await prisma.user.deleteMany();
    await prisma.agency.deleteMany();
    await prisma.$disconnect();

    delete process.env.DATABASE_URL;
  });

  it('POST /api/employees creates an employee in the database', async () => {
    const payload = {
      personal: {
        firstName: 'Meklit',
        lastName: 'Worku',
        email: 'meklit@example.com',
        contactPhone: '+251922334455',
        emergencyContact: 'Worku Meklit',
      },
      skills: { role: 'Nurse', destination: 'UAE' },
    };

    const res = await CreatePOST(
      new Request('http://localhost/api/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.agencyId).toBe(agencyId);
    expect(body.data.firstName).toBe('Meklit');
    expect(body.data.lastName).toBe('Worku');
    expect(body.data.status).toBe('REGISTERED');

    testEmployeeId = body.data.id;
  });

  it('GET /api/employees returns employees from the database', async () => {
    const res = await ListGET(new Request('http://localhost/api/employees'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.meta.source).toBe('database');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data.some((e: any) => e.id === testEmployeeId)).toBe(true);
  });

  it('GET /api/employees returns filtered results when query params provided', async () => {
    const res = await ListGET(new Request('http://localhost/api/employees?q=Meklit'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data[0].firstName).toBe('Meklit');
  });

  it('GET /api/employees/[id] returns a single employee', async () => {
    expect(testEmployeeId).toBeDefined();

    const res = await GetGET(new Request(`http://localhost/api/employees/${testEmployeeId}`), {
      params: { id: testEmployeeId },
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(testEmployeeId);
    expect(body.data.firstName).toBe('Meklit');
  });

  it('GET /api/employees/[id] returns 404 for non-existent employee', async () => {
    const res = await GetGET(new Request('http://localhost/api/employees/non-existent-id'), {
      params: { id: 'non-existent-id' },
    });

    expect(res.status).toBe(404);
  });

  it('PUT /api/employees/[id] updates an employee', async () => {
    expect(testEmployeeId).toBeDefined();

    const res = await UpdatePUT(
      new Request(`http://localhost/api/employees/${testEmployeeId}`, {
        method: 'PUT',
        body: JSON.stringify({
          personal: {
            firstName: 'Meklit',
            lastName: 'Updated',
            email: 'meklit.updated@example.com',
            contactPhone: '+251922334455',
            emergencyContact: 'Emergency Contact',
          },
          status: 'DOCUMENT_REVIEW',
        }),
      }),
      { params: { id: testEmployeeId } },
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.lastName).toBe('Updated');
    expect(body.data.status).toBe('DOCUMENT_REVIEW');
  });

  it('DELETE /api/employees/[id] archives (soft-deletes) an employee', async () => {
    expect(testEmployeeId).toBeDefined();

    const res = await DeleteDELETE(
      new Request(`http://localhost/api/employees/${testEmployeeId}`, { method: 'DELETE' }),
      { params: { id: testEmployeeId } },
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.archived).toBe(true);
  });
});
