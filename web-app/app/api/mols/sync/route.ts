import { ok, serverError, created } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { MolsStage } from '@prisma/client';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok({
        status: 'sync_ready',
        lastSync: null,
        pending: 5,
        source: 'mock'
      });
    }

    const pending = await db.molsRecord.count({
      where: {
        employee: { agencyId: session.agencyId },
        stage: 'CONTRACT_LINKED'
      }
    });

    return ok({
      status: 'sync_ready',
      lastSync: new Date().toISOString(),
      pending
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return created({ status: 'synced', records: 5, source: 'mock' });
    }

    const records = await db.molsRecord.updateMany({
      where: {
        employee: { agencyId: session.agencyId },
        stage: 'CONTRACT_LINKED'
      },
      data: { stage: 'MOLS_SUBMITTED' }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'mols_sync',
      resource: 'mols_record',
      metadata: { recordsSynced: records.count }
    });

    return created({ status: 'synced', records: records.count });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}