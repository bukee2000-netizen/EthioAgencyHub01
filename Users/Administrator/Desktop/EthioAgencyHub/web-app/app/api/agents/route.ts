import { z } from 'zod';
import { created, handleAuthError, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const agentCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  active: z.boolean().default(true)
});

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });

    const data = await db.agent.findMany({
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
    const parsed = agentCreateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid agent payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), agencyId: session.agencyId, source: 'mock' });
    }

    const agent = await db.agent.create({ data: { ...parsed.data, agencyId: session.agencyId } });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'create', resource: 'agent', resourceId: agent.id, metadata: { name: agent.name } });
    return created(agent);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
