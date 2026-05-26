import { handleAuthError, ok, serverError, created, notFound, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });
    const tickets = await db.auditLog.findMany({
      where: { agencyId: session.agencyId, action: { contains: 'support' } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return ok(tickets.map((t: any) => ({
      id: t.id,
      subject: t.action,
      description: t.metadata ? (typeof t.metadata === 'string' ? t.metadata : JSON.stringify(t.metadata)) : '',
      status: 'open',
      priority: 'medium',
      createdAt: t.createdAt,
    })));
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
    if (!body.subject) return validationError('Subject is required');
    if (!isDatabaseConfigured()) return created({ id: 'mock-' + Date.now(), ...body, source: 'mock' });
    const ticket = await db.auditLog.create({
      data: {
        agencyId: session.agencyId,
        actorId: session.userId,
        action: 'support_' + body.subject,
        resource: 'support',
        resourceId: 'ticket-' + Date.now(),
        metadata: JSON.stringify({ description: body.description || '', priority: body.priority || 'medium' })
      }
    });
    return created({ id: ticket.id, subject: body.subject, status: 'open', priority: body.priority || 'medium' });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
