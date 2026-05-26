import { Prisma } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });

    const data = await db.visaApplication.findMany({
      where: { employee: { agencyId: session.agencyId } },
      include: { employee: { select: { id: true, name: true, firstName: true, lastName: true, passportNumber: true } } },
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
    const { employeeId, embassy, visaType, stage, documents, notes } = body;

    if (!employeeId || !embassy) return validationError('Missing required fields');

    if (!isDatabaseConfigured()) return created({
      id: 'mock-' + Date.now(), employeeId, embassy, visaType, stage, notes,
      docPassport: 'pending', docMedical: 'pending', docPolice: 'pending', docContract: 'pending',
      docPhotos: 'pending', docInsurance: 'pending', docCertificate: 'pending',
      molsUnlocked: false, ticketNotified: false, source: 'mock'
    });

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const data: any = {
      employeeId, embassy, visaType, stage: stage || 'DOCUMENT_COLLECTION',
      docPassport: documents?.passport || 'pending',
      docMedical: documents?.medical || 'pending',
      docPolice: documents?.police || 'pending',
      docContract: documents?.contract || 'pending',
      docPhotos: documents?.photos || 'pending',
      docInsurance: documents?.insurance || 'pending',
      docCertificate: documents?.certificate || 'pending',
      notes, molsUnlocked: body.molsUnlocked || false, ticketNotified: false
    };

    const visa = await db.visaApplication.create({ data });
    return created(visa);
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
    const { id, stage, ticketNotified, molsUnlocked } = body;
    if (!id) return validationError('Missing id');

    if (!isDatabaseConfigured()) return ok({ id, stage, ticketNotified, source: 'mock' });

    const update: Prisma.VisaApplicationUpdateInput = {};
    if (stage) update.stage = stage;
    if (ticketNotified !== undefined) update.ticketNotified = ticketNotified;
    if (molsUnlocked !== undefined) update.molsUnlocked = molsUnlocked;

    const result = await db.visaApplication.update({ where: { id }, data: update });
    return ok(result);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
