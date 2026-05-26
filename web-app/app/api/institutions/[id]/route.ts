import { handleAuthError, notFound, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({
        id: params.id,
        name: 'Mock Institution',
        type: 'Embassy',
        contact: 'John Contact',
        country: 'Saudi Arabia',
        active: true,
        partners: [],
        collaborations: [],
        source: 'mock'
      });
    }

    const institution = await db.institution.findFirst({
      where: { id: params.id, agencyId: session.agencyId }
    });
    if (!institution) return notFound('Institution not found');

    return ok(institution);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ id: params.id, ...body, source: 'mock' });
    }

    const existing = await db.institution.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!existing) return notFound('Institution not found');

    const updated = await db.institution.update({
      where: { id: params.id },
      data: {
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        contact: body.contact ?? existing.contact,
        country: body.country ?? existing.country,
        active: body.active ?? existing.active
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'institution_update',
      resource: 'institution',
      resourceId: params.id,
      metadata: { name: updated.name }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok({ id: params.id, deleted: true, source: 'mock' });
    }

    const existing = await db.institution.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!existing) return notFound('Institution not found');

    await db.institution.update({ where: { id: params.id }, data: { deletedAt: new Date() } });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'institution_delete',
      resource: 'institution',
      resourceId: params.id
    });

    return ok({ id: params.id, deleted: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}