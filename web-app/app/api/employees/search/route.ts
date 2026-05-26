import { Prisma, EmployeeStatus } from '@prisma/client';
import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1).optional(),
  status: z.string().optional(),
  destination: z.string().optional(),
  skill: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const status = searchParams.get('status') || undefined;
    const destination = searchParams.get('destination') || undefined;
    const skill = searchParams.get('skill') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-1', name: 'John Doe', status: 'REGISTERED', destination: 'Saudi Arabia', skills: ['Nursing'] },
        { id: 'mock-2', name: 'Jane Smith', status: 'DEPLOYED', destination: 'UAE', skills: ['Engineering'] }
      ], { total: 2, page, limit, source: 'mock' });
    }

    const where: Prisma.EmployeeWhereInput = {
      agencyId: session.agencyId,
      ...(query ? {
        OR: [
          { name: { contains: query } },
          { passportNumber: { contains: query } },
          { contactPhone: { contains: query } }
        ]
      } : {}),
      ...(status ? { status: status as EmployeeStatus } : {}),
      ...(destination ? { destination } : {}),
      ...(skill ? { role: { contains: skill } } : {}),
    };

    const [employees, total] = await Promise.all([
      db.employee.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.employee.count({ where })
    ]);

    return ok(employees, { total, page, limit });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) return validationError('Invalid search payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok([], { total: 0, source: 'mock' });
    }

    return ok([], { total: 0 });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
