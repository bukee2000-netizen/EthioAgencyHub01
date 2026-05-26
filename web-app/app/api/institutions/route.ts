import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const institutionSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional(),
  contact: z.string().optional(),
  country: z.string().optional(),
  active: z.boolean().default(true)
});

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });
    const data = await db.institution.findMany({
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
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = institutionSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid institution payload', parsed.error.flatten());
    if (!isDatabaseConfigured()) return created({ ...parsed.data, id: 'mock-' + Date.now(), source: 'mock' });
    const inst = await db.institution.create({ data: { ...parsed.data, agencyId: session.agencyId } });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'create', resource: 'institution', resourceId: inst.id, metadata: { name: inst.name } });
    return created(inst);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
