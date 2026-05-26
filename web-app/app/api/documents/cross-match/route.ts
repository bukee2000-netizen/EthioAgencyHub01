import { handleAuthError, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({ checked: 23, matched: 21, flagged: 2, source: 'mock' });
    }

    const { employeeId, autoUpdateStatus } = await req.json().catch(() => ({}));
    let employees;

    if (employeeId) {
      employees = await db.employee.findMany({
        where: { id: employeeId, agencyId: session.agencyId },
        include: { documents: true }
      });
    } else {
      employees = await db.employee.findMany({
        where: { agencyId: session.agencyId },
        include: { documents: true }
      });
    }

    const molsDocTypes = ['PASSPORT', 'VISA', 'MEDICAL'];
    let checked = 0;
    let matched = 0;
    const flagged: { employeeId: string; name: string; missing: string[]; passportNumber?: string }[] = [];
    const passed: string[] = [];

    for (const emp of employees) {
      checked += 1;
      const present = new Set(emp.documents.map((d) => d.type));
      const missing = molsDocTypes.filter((t) => !present.has(t as typeof emp.documents[number]['type']));
      if (missing.length === 0) {
        matched += 1;
        passed.push(emp.id);
        if (autoUpdateStatus) {
          await db.employee.update({
            where: { id: emp.id },
            data: { status: 'TRAVEL_READY' }
          });
        }
      } else {
        flagged.push({ employeeId: emp.id, name: emp.name, missing, passportNumber: emp.passportNumber || undefined });
      }
    }

    // Log cross-match audit
    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'cross_match',
      resource: 'document',
      metadata: { checked, matched, flagged: flagged.length, autoUpdateStatus }
    });

    return ok({ checked, matched, flagged: flagged.length, details: flagged, passed });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
