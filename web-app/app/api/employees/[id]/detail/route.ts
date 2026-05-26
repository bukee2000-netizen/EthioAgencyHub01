import { Prisma } from '@prisma/client';
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
        name: 'John Doe',
        role: 'Nurse',
        destination: 'Saudi Arabia',
        documents: { passport: true, visa: true, medical: false },
        status: 'document_review',
        source: 'mock'
      });
    }

    const employee = await db.employee.findFirst({
      where: { id: params.id, agencyId: session.agencyId },
      include: {
        documents: { orderBy: { createdAt: 'desc' } },
        travels: { take: 5, orderBy: { departureAt: 'desc' } },
        visaApplications: { take: 5, orderBy: { createdAt: 'desc' } },
        molsRecords: { take: 5, orderBy: { createdAt: 'desc' } },
        generatedCvs: true
      }
    });

    if (!employee) return notFound('Employee not found');

    return ok({
      ...employee,
      documents: employee.documents,
      travels: employee.travels,
      visaApplications: employee.visaApplications,
      molsRecords: employee.molsRecords,
      cvs: employee.generatedCvs
    });
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

    const existing = await db.employee.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!existing) return notFound('Employee not found');

    const update: Prisma.EmployeeUpdateInput = {};
    if (body.status) update.status = body.status;
    if (body.role !== undefined) update.role = body.role;

    const updated = await db.employee.update({ where: { id: params.id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'employee_update',
      resource: 'employee',
      resourceId: params.id,
      metadata: { status: body.status }
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
      return ok({ id: params.id, archived: true, source: 'mock' });
    }

    const existing = await db.employee.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!existing) return notFound('Employee not found');

    await db.employee.update({ where: { id: params.id }, data: { status: 'ARCHIVED', deletedAt: new Date() } });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'employee_archive',
      resource: 'employee',
      resourceId: params.id
    });

    return ok({ id: params.id, archived: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}