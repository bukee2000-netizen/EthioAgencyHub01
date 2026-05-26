import { Prisma } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const cvsSchema = z.object({
  employeeId: z.string().min(1),
  template: z.enum(['standard', 'professional', 'modern', 'elegant', 'compact']),
  language: z.enum(['en', 'am', 'om', 'ar']),
  layout: z.enum(['english-only', 'arabic-only', 'bilingual']).optional(),
  style: z.enum(['standard', 'professional', 'modern', 'elegant', 'compact']).optional(),
  templateId: z.string().optional(),
  htmlContent: z.string().optional(),
  pdfData: z.string().optional().transform((val) => val ? Buffer.from(val, 'base64') : undefined),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-cv-1', employeeId: 'mock-emp-1', template: 'professional', language: 'en', status: 'generated', createdAt: new Date().toISOString(), source: 'mock' },
      ], { source: 'mock' });
    }

    const where: Prisma.GeneratedCvWhereInput = {};
    if (employeeId) {
      const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
      if (!employee) return notFound('Employee not found');
      where.employeeId = employeeId;
    }

    const cvs = await db.generatedCv.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, name: true, role: true, destination: true }
        }
      }
    });

    const enriched = cvs.map(cv => ({
      id: cv.id,
      employeeId: cv.employeeId,
      employeeName: cv.employee?.name || `${cv.employee?.firstName || ''} ${cv.employee?.lastName || ''}`.trim(),
      role: cv.employee?.role || '',
      destination: cv.employee?.destination || '',
      template: cv.template,
      language: cv.language,
      layout: cv.layout,
      style: cv.style,
      status: cv.status,
      createdAt: cv.createdAt.toISOString(),
    }));

    return ok(enriched, { total: enriched.length });
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
    const parsed = cvsSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid CV payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-cv-' + Date.now(), status: 'generated', source: 'mock' });
    }

    const { employeeId, template, language, layout, style, templateId, htmlContent, pdfData } = parsed.data;

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const cv = await db.generatedCv.create({
      data: {
        employeeId,
        template,
        language,
        layout: layout || (style || template),
        style: style || template,
        htmlContent: htmlContent || `CV for ${employee.name || employee.firstName} ${employee.lastName || ''}`,
        pdfData,
        status: 'generated',
        generatedBy: session.userId
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'cv_generate',
      resource: 'generatedCv',
      resourceId: cv.id,
      metadata: { template, language, employeeId }
    });

    return created(cv);
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
    const { id, sharedWith, downloadedAt } = body;

    if (!id) return validationError('Missing CV ID');

    if (!isDatabaseConfigured()) {
      return ok({ id, sharedWith, downloadedAt, source: 'mock' });
    }

    const existing = await db.generatedCv.findFirst({ where: { id } });
    if (!existing) return notFound('CV not found');

    const update: Prisma.GeneratedCvUpdateInput = {};
    if (sharedWith) update.sharedWith = sharedWith;
    if (downloadedAt) update.downloadedAt = new Date(downloadedAt);

    const updated = await db.generatedCv.update({ where: { id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'cv_share',
      resource: 'generatedCv',
      resourceId: id,
      metadata: { sharedWith }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}