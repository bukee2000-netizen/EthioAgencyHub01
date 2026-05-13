import { handleAuthError, ok, serverError, created, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });
    const logs = await db.auditLog.findMany({
      where: { agencyId: session.agencyId, action: { contains: 'training' } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return ok(logs.map((l: any) => ({
      id: l.id,
      title: l.action.replace('training_', ''),
      status: 'scheduled',
      date: l.createdAt,
      description: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
      attendees: 0
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
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    if (!body.title) return validationError('Title is required');
    if (!isDatabaseConfigured()) return created({ id: 'mock-' + Date.now(), ...body, source: 'mock' });
    const training = await db.auditLog.create({
      data: {
        agencyId: session.agencyId,
        actorId: session.userId,
        action: 'training_' + body.title,
        resource: 'training',
        resourceId: 'session-' + Date.now(),
        metadata: JSON.stringify({ description: body.description || '', attendees: body.attendees || 0, date: body.date || new Date().toISOString() })
      }
    });
    return created({ id: training.id, title: body.title, status: 'scheduled', date: body.date || new Date().toISOString() });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
