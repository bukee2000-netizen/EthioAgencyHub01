import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const pilgrimSchema = z.object({
  name: z.string().min(2),
  passportNo: z.string().optional(),
  groupName: z.string().optional(),
  season: z.string().optional(),
  requirements: z.record(z.unknown()).optional(),
  departureDate: z.coerce.date().optional()
});

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });
    const data = await db.pilgrim.findMany({
      where: { agencyId: session.agencyId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return ok(data, { total: data.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = pilgrimSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid pilgrim payload', parsed.error.flatten());
    if (!isDatabaseConfigured()) return created({ ...parsed.data, id: 'mock-' + Date.now(), source: 'mock' });
    const pilgrim = await db.pilgrim.create({
      data: {
        ...parsed.data,
        requirements: parsed.data.requirements ? JSON.parse(JSON.stringify(parsed.data.requirements)) : undefined,
        agencyId: session.agencyId
      }
    });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'create', resource: 'pilgrim', resourceId: pilgrim.id, metadata: { name: pilgrim.name } });
    return created(pilgrim);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
