import { handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { MolsStage } from '@prisma/client';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return notFound();

    const record = await db.molsRecord.findFirst({
      where: { id: params.id, employee: { agencyId: session.agencyId } },
      include: { employee: { select: { id: true, name: true, firstName: true, lastName: true, passportNumber: true, destination: true } } }
    });
    if (!record) return notFound('MOLS record not found');
    return ok(record);
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
    if (!isDatabaseConfigured()) return ok({ id: params.id, source: 'mock' });

    const existing = await db.molsRecord.findFirst({
      where: { id: params.id, employee: { agencyId: session.agencyId } }
    });
    if (!existing) return notFound('MOLS record not found');

    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.stage) update.stage = body.stage as MolsStage;
    if (typeof body.healthCert === 'boolean') update.healthCert = body.healthCert;
    if (typeof body.insurance === 'boolean') update.insurance = body.insurance;
    if (typeof body.coc === 'boolean') update.coc = body.coc;
    if (typeof body.visaUnlocked === 'boolean') update.visaUnlocked = body.visaUnlocked;
    if (body.notes !== undefined) update.notes = body.notes;

    const updated = await db.molsRecord.update({ where: { id: params.id }, data: update });
    await writeAuditLog({
      agencyId: session.agencyId, actorId: session.userId,
      action: 'mols_update', resource: 'molsRecord', resourceId: params.id,
      metadata: { changes: Object.keys(update) }
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
    if (!isDatabaseConfigured()) return ok({ success: true, source: 'mock' });

    const existing = await db.molsRecord.findFirst({
      where: { id: params.id, employee: { agencyId: session.agencyId } }
    });
    if (!existing) return notFound('MOLS record not found');

    await db.molsRecord.delete({ where: { id: params.id } });
    await writeAuditLog({
      agencyId: session.agencyId, actorId: session.userId,
      action: 'mols_delete', resource: 'molsRecord', resourceId: params.id
    });
    return ok({ success: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}