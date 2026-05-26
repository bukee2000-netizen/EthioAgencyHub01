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
      return ok({ module: 'institutions', path, status: 'Institution sub-route scaffold' });
    }

    if (path.length === 0) {
      const institutions = await db.institution.findMany({
        where: { agencyId: session.agencyId },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return ok(institutions, { total: institutions.length });
    }

    const [resource, id] = path;

    switch (resource) {
      case 'institution-detail': {
        if (!id) return notFound('Institution ID required');
        const institution = await db.institution.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!institution) return notFound('Institution not found');
        return ok(institution);
      }
      case 'partners': {
        if (!id) return notFound('Institution ID required');
        const institution = await db.institution.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!institution) return notFound('Institution not found');
        return ok([]);
      }
      case 'collaboration': {
        if (!id) return notFound('Institution ID required');
        const institution = await db.institution.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!institution) return notFound('Institution not found');
        return ok([]);
      }
      default:
        return notFound(`Unknown institution sub-route: ${resource}`);
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
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return created({ path, ...body, source: 'mock' });
    }

    const [resource] = path;

    switch (resource) {
      case 'partners': {
        const { institutionId, ...partnerData } = body;
        const institution = await db.institution.findFirst({
          where: { id: institutionId, agencyId: session.agencyId }
        });
        if (!institution) return notFound('Institution not found');

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'partner_add',
          resource: 'institution_partner',
          resourceId: institutionId,
          metadata: partnerData
        });

        return created({ id: Date.now().toString(), ...partnerData, institutionId });
      }
      case 'collaboration': {
        const { institutionId, ...collabData } = body;
        const institution = await db.institution.findFirst({
          where: { id: institutionId, agencyId: session.agencyId }
        });
        if (!institution) return notFound('Institution not found');

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'collaboration_add',
          resource: 'institution_collaboration',
          resourceId: institutionId,
          metadata: collabData
        });

        return created({ id: Date.now().toString(), ...collabData, institutionId });
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
