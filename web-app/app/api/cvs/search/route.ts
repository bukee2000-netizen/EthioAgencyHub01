import { Prisma } from '@prisma/client';
import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1).optional(),
  skill: z.string().optional(),
  destination: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const skill = searchParams.get('skill') || undefined;
    const destination = searchParams.get('destination') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'cv-1', employeeId: 'mock-1', name: 'John Doe', template: 'professional', status: 'generated' },
        { id: 'cv-2', employeeId: 'mock-2', name: 'Jane Smith', template: 'technical', status: 'generated' }
      ], { total: 2, page, limit, source: 'mock' });
    }

    const where: Prisma.GeneratedCvWhereInput = {
      employee: { agencyId: session.agencyId },
      ...(query ? {
        OR: [
          { employee: { name: { contains: query } } },
          { employee: { passportNumber: { contains: query } } }
        ]
      } : {}),
    };

    const [cvs, total] = await Promise.all([
      db.generatedCv.findMany({
        where,
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.generatedCv.count({ where })
    ]);

    return ok(cvs, { total, page, limit });
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
