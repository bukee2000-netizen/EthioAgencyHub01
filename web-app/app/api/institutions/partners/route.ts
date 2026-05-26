import { validationError, handleAuthError, notFound, ok, serverError, created } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  country: z.string().optional(),
  agreementType: z.string().optional(),
  active: z.boolean().default(true)
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-partner-1', name: 'Saudi Embassy', type: 'Embassy', contactPerson: 'Ahmed Ali', country: 'Saudi Arabia', active: true, source: 'mock' },
        { id: 'mock-partner-2', name: 'MOLS Office', type: 'Government', contactPerson: 'Fatima Hassan', country: 'Ethiopia', active: true, source: 'mock' },
      ], { source: 'mock' });
    }

    const institution = await db.institution.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!institution) return notFound('Institution not found');

    return ok([]);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = partnerSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid partner payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-partner-' + Date.now(), source: 'mock' });
    }

    const institution = await db.institution.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!institution) return notFound('Institution not found');

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'partner_add',
      resource: 'institution_partner',
      resourceId: params.id,
      metadata: parsed.data
    });

    return created({ id: Date.now().toString(), ...parsed.data, institutionId: params.id });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}