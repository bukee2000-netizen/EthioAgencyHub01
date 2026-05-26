import { Prisma, DocumentType, DocumentStatus } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { notifyDocumentStatus } from '@/lib/whatsapp/notifications';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: Prisma.DocumentWhereInput = {};
    if (employeeId) {
      const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
      if (!employee) return notFound('Employee not found');
      where.employeeId = employeeId;
    }

    const documents = await db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { employee: { select: { id: true, name: true } } }
    });

    return ok(documents, { total: documents.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const { employeeId, type, status, notes } = body;

    if (!employeeId || !type) return validationError('Missing required fields');

    if (!isDatabaseConfigured()) {
      return created({ id: 'mock-' + Date.now(), employeeId, type, status: status || 'PENDING', source: 'mock' });
    }

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const document = await db.document.create({
      data: {
        employeeId,
        type: type as DocumentType,
        filePath: `documents/${employeeId}/${type.toLowerCase()}_${Date.now()}`,
        status: (status as DocumentStatus) || 'PENDING'
      }
    });

    // Notify employee via WhatsApp
    if (employee.contactPhone) {
      notifyDocumentStatus({
        name: employee.name || '',
        phone: employee.contactPhone,
        employeeId: employee.id,
        documentType: type,
        status: 'uploaded'
      }).catch(err => console.error('[WhatsApp] Document notification failed:', err));
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'upload_document',
      resource: 'document',
      resourceId: document.id,
      metadata: { type, employeeId }
    });

    return created(document);
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
    const { id, status, notes } = body;

    if (!id) return validationError('Missing document ID');

    if (!isDatabaseConfigured()) {
      return ok({ id, status, source: 'mock' });
    }

    const existing = await db.document.findFirst({
      where: { id },
      include: { employee: true }
    });
    if (!existing) return notFound('Document not found');

    const update: Prisma.DocumentUpdateInput = { status };
    if (notes) update.notes = notes;

    const updated = await db.document.update({ where: { id }, data: update });

    // Send WhatsApp notification on status change
    if (existing.employee?.contactPhone && status) {
      notifyDocumentStatus({
        name: existing.employee.name || '',
        phone: existing.employee.contactPhone,
        employeeId: existing.employeeId,
        documentType: existing.type,
        status: status as 'uploaded' | 'verified' | 'rejected'
      }).catch(err => console.error('[WhatsApp] Document status notification failed:', err));
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'document_update',
      resource: 'document',
      resourceId: id,
      metadata: { status }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}