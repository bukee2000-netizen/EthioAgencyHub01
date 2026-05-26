import { Prisma, VisaStage } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const visaSchema = z.object({
  employeeId: z.string().min(1),
  embassy: z.string().min(2),
  visaType: z.string().min(1),
  stage: z.enum(['DOCUMENT_COLLECTION', 'PORTAL_REGISTRATION', 'SUBMITTED_TO_EMBASSY', 'VISA_APPROVED', 'REJECTED_CORRECTION']).optional(),
  documents: z.object({
    passport: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    medical: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    police: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    contract: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    photos: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    insurance: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
    certificate: z.enum(['pending', 'submitted', 'verified', 'rejected']).default('pending'),
  }).optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: Prisma.VisaApplicationWhereInput = {
      employee: { agencyId: session.agencyId },
      ...(employeeId ? { employeeId } : {}),
      ...(status ? { stage: status as VisaStage } : {}),
    };

    const visas = await db.visaApplication.findMany({
      where,
      include: { employee: { select: { id: true, name: true, passportNumber: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return ok(visas, { total: visas.length });
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
    const parsed = visaSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid visa payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-visa-' + Date.now(), stage: 'DOCUMENT_COLLECTION', source: 'mock' });
    }

    const { employeeId, embassy, visaType, stage, documents, notes } = parsed.data;

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const visa = await db.visaApplication.create({
      data: {
        employeeId,
        embassy,
        visaType,
        stage: stage || 'DOCUMENT_COLLECTION',
        docPassport: documents?.passport || 'pending',
        docMedical: documents?.medical || 'pending',
        docPolice: documents?.police || 'pending',
        docContract: documents?.contract || 'pending',
        docPhotos: documents?.photos || 'pending',
        docInsurance: documents?.insurance || 'pending',
        docCertificate: documents?.certificate || 'pending',
        notes,
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'visa_create',
      resource: 'visaApplication',
      resourceId: visa.id,
      metadata: { embassy, visaType, employeeId }
    });

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
    const { id, stage, ticketNotified, molsUnlocked, docPassport, docMedical, docPolice, docContract, docPhotos, docInsurance, docCertificate } = body;

    if (!id) return notFound('Visa ID required');

    if (!isDatabaseConfigured()) {
      return ok({ id, stage, source: 'mock' });
    }

    const existing = await db.visaApplication.findFirst({ where: { id } });
    if (!existing) return notFound('Visa application not found');

    const update: Prisma.VisaApplicationUpdateInput = {};
    if (stage) update.stage = stage;
    if (ticketNotified !== undefined) update.ticketNotified = ticketNotified;
    if (molsUnlocked !== undefined) update.molsUnlocked = molsUnlocked;
    if (docPassport) update.docPassport = docPassport;
    if (docMedical) update.docMedical = docMedical;
    if (docPolice) update.docPolice = docPolice;
    if (docContract) update.docContract = docContract;
    if (docPhotos) update.docPhotos = docPhotos;
    if (docInsurance) update.docInsurance = docInsurance;
    if (docCertificate) update.docCertificate = docCertificate;

    const updated = await db.visaApplication.update({ where: { id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'visa_update',
      resource: 'visaApplication',
      resourceId: id,
      metadata: { stage }
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

    const existing = await db.visaApplication.findFirst({ where: { id: params.id } });
    if (!existing) return notFound('Visa application not found');

    await db.visaApplication.delete({ where: { id: params.id } });
    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'visa_delete',
      resource: 'visaApplication',
      resourceId: params.id
    });
    return ok({ success: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}