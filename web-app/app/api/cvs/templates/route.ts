import { z } from 'zod';
import { created, handleAuthError, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const templateSchema = z.object({
  name: z.string().min(1),
  layout: z.enum(['english-only', 'arabic-only', 'bilingual']).default('bilingual'),
  style: z.enum(['standard', 'professional', 'modern', 'elegant', 'compact']).default('standard'),
  logoUrl: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  companyWebsite: z.string().optional(),
  primaryColor: z.string().default('#1e40af'),
  accentColor: z.string().default('#059669'),
  fontSize: z.enum(['small', 'normal', 'large']).default('normal'),
  showPassportPhoto: z.boolean().default(true),
  showFullBodyPhoto: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'default', name: 'Default Template', layout: 'bilingual', style: 'standard', primaryColor: '#1e40af', accentColor: '#059669', isDefault: true, source: 'mock' }
      ]);
    }
    const templates = await db.cVTemplate.findMany({
      where: { agencyId: session.agencyId },
      orderBy: { createdAt: 'desc' },
    });
    return ok(templates);
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
    const parsed = templateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid template', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ id: 'mock-' + Date.now(), ...parsed.data, source: 'mock' });
    }

    if (parsed.data.isDefault) {
      await db.cVTemplate.updateMany({
        where: { agencyId: session.agencyId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await db.cVTemplate.create({
      data: { ...parsed.data, agencyId: session.agencyId }
    });

    await writeAuditLog({
      agencyId: session.agencyId, actorId: session.userId,
      action: 'cv_template_create', resource: 'cvTemplate',
      resourceId: template.id, metadata: { name: template.name },
    });

    return created(template);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
