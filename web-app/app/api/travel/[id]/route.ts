import { handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { travelUpdateSchema } from '@/lib/validations/travel.schema';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok({ id: params.id, source: 'mock' });

    const travel = await db.travel.findFirst({
      where: { id: params.id, employee: { agencyId: session.agencyId } }
    });
    if (!travel) return notFound('Travel record not found');
    return ok(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = travelUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid update payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) return ok({ id: params.id, ...parsed.data, source: 'mock' });

    const existing = await db.travel.findFirst({
      where: { id: params.id, employee: { agencyId: session.agencyId } }
    });
    if (!existing) return notFound('Travel record not found');

    const travel = await db.travel.update({ where: { id: params.id }, data: parsed.data });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'update', resource: 'travel', resourceId: travel.id });
    return ok(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
