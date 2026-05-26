import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      return ok({ module: 'hajj-umrah', path, status: 'Hajj/Umrah sub-route scaffold' });
    }

    if (path.length === 0) {
      const pilgrims = await db.pilgrim.findMany({
        where: { agencyId: session.agencyId },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return ok(pilgrims, { total: pilgrims.length });
    }

    const [resource, id] = path;

    switch (resource) {
      case 'pilgrim-detail': {
        if (!id) return notFound('Pilgrim ID required');
        const pilgrim = await db.pilgrim.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!pilgrim) return notFound('Pilgrim not found');
        return ok(pilgrim);
      }
      case 'requirements': {
        if (!id) return notFound('Pilgrim ID required');
        const pilgrim = await db.pilgrim.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!pilgrim) return notFound('Pilgrim not found');
        return ok({ pilgrimId: id, requirements: pilgrim.requirements || {} });
      }
      case 'documentation': {
        if (!id) return notFound('Pilgrim ID required');
        const docs = await db.document.findMany({
          where: { employeeId: id }
        });
        return ok(docs);
      }
      default:
        return notFound(`Unknown hajj-umrah sub-route: ${resource}`);
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return created({ path, ...body, source: 'mock' });
    }

    const [resource] = path;

    switch (resource) {
      case 'requirements': {
        const { pilgrimId, requirements } = body;
        const updated = await db.pilgrim.update({
          where: { id: pilgrimId, agencyId: session.agencyId },
          data: { requirements }
        });
        return ok(updated);
      }
      case 'documentation': {
        const { pilgrimId, ...docData } = body;
        const doc = await db.document.create({
          data: { ...docData, employeeId: pilgrimId, agencyId: session.agencyId }
        });
        return created(doc);
      }
      default:
        return validationError(`Unknown POST resource: ${resource}`);
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
