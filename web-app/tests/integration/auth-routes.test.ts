import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth/password';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => undefined),
    set: vi.fn(),
  })),
}));

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-at-least-32-characters-long-for-testing';

import { POST as LoginPOST } from '@/app/api/auth/login/route';
import { POST as RegisterPOST } from '@/app/api/auth/register/route';
import { POST as RefreshPOST } from '@/app/api/auth/refresh/route';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

let agencyId: string;
let userId: string;
const testEmail = 'auth-test@agency.com';
const testPassword = 'Test@123456';

beforeAll(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  const agency = await prisma.agency.create({ data: { name: 'Test Auth Agency' } });
  agencyId = agency.id;

  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: await hashPassword(testPassword),
      role: 'AGENCY_ADMIN',
      agencyId
    }
  });
  userId = user.id;
});

describe('POST /api/auth/login', () => {
  it('should return 200 with session and csrf token for valid credentials', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const res = await LoginPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('user');
    expect(body.data.user).toHaveProperty('id', userId);
    expect(body.data.user).toHaveProperty('email', testEmail);
    expect(body.data.user).toHaveProperty('role', 'AGENCY_ADMIN');
    expect(body.data).toHaveProperty('csrfToken');
  });

  it('should return 401 for invalid email', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@agency.com', password: testPassword })
    });
    const res = await LoginPOST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('success', false);
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('should return 401 for wrong password', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'WrongPass@123456' })
    });
    const res = await LoginPOST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('success', false);
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });
});

describe('POST /api/auth/register', () => {
  it('should return 201 for valid registration data', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        agencyName: 'New Test Agency',
        email: 'new-registered@agency.com',
        password: 'NewPass@123456'
      })
    });
    const res = await RegisterPOST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('user');
    expect(body.data.user).toHaveProperty('email', 'new-registered@agency.com');
    expect(body.data.user).toHaveProperty('role', 'AGENCY_ADMIN');
  });
});

describe('POST /api/auth/refresh', () => {
  it('should return 401 when no refresh cookie is provided', async () => {
    const req = new Request('http://localhost/api/auth/refresh', { method: 'POST' });
    const res = await RefreshPOST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('success', false);
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });
});
