import { Prisma } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });

    const data = await db.molsRecord.findMany({
      where: { employee: { agencyId: session.agencyId } },
      include: { employee: { select: { id: true, name: true, firstName: true, lastName: true, passportNumber: true, destination: true } } },
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
    const { employeeId, stage, healthCert, insurance, coc, visaUnlocked } = body;

    if (!employeeId) return validationError('Missing employeeId');

    if (!isDatabaseConfigured()) return created({
      id: 'mock-' + Date.now(), employeeId, stage: stage || 'CONTRACT_LINKED',
      healthCert: false, insurance: false, coc: false,
      visaUnlocked: false, source: 'mock'
    });

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const mols = await db.molsRecord.create({
      data: {
        employeeId, stage: stage || 'CONTRACT_LINKED',
        healthCert: healthCert || false, insurance: insurance || false,
        coc: coc || false, visaUnlocked: visaUnlocked || false
      }
    });
    return created(mols);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const { id, stage, visaUnlocked } = body;
    if (!id) return validationError('Missing id');

    if (!isDatabaseConfigured()) return ok({ id, stage, visaUnlocked, source: 'mock' });

    const update: Prisma.MolsRecordUpdateInput = {};
    if (stage) update.stage = stage;
    if (visaUnlocked !== undefined) update.visaUnlocked = visaUnlocked;

    const result = await db.molsRecord.update({ where: { id }, data: update });

    // When MOLS is approved, auto-unlock visa for the employee
    if (stage === 'APPROVED') {
      await db.molsRecord.update({ where: { id }, data: { visaUnlocked: true } });
    }

    return ok(result);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
