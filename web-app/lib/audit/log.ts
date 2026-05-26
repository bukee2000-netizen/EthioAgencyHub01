import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';

type AuditEntry = {
  agencyId: string;
  actorId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  if (!isDatabaseConfigured()) return;
  try {
    await db.auditLog.create({
      data: {
        agencyId: entry.agencyId,
        actorId: entry.actorId ?? null,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId ?? null,
        metadata: entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : undefined
      }
    });
  } catch {
    // Audit logging should never break the primary flow
  }
}
