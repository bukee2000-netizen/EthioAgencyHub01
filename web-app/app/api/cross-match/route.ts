import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const crossMatchSchema = z.object({
  employeeId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = crossMatchSchema.safeParse(body);

    if (!parsed.success) return validationError('Invalid cross-match payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({
        employeeId: parsed.data.employeeId,
        allPass: true,
        source: 'mock'
      });
    }

    const result = await db.crossMatchResult.create({
      data: {
        employeeId: parsed.data.employeeId,
        agencyId: session.agencyId,
        allPass: true,
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'cross_match',
      resource: 'cross_match_result',
      resourceId: result.id,
      metadata: { employeeId: parsed.data.employeeId }
    });

    return created(result);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'cm-1', employeeId: 'mock-1', allPass: true, source: 'mock' }
      ]);
    }

    const results = await db.crossMatchResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return ok(results);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
