import { validationError, handleAuthError, notFound, ok, serverError, created } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const collaborationSchema = z.object({
  partnerId: z.string().min(1),
  type: z.enum(['document_exchange', 'data_sharing', 'referral', 'training', 'other']),
  description: z.string().min(10),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['active', 'pending', 'completed', 'terminated']).default('pending')
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-collab-1', type: 'document_exchange', description: 'Passport document exchange agreement', status: 'active', partnerName: 'Saudi Embassy', source: 'mock' },
        { id: 'mock-collab-2', type: 'training', description: 'Worker orientation program', status: 'pending', partnerName: 'MOLS Office', source: 'mock' },
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
    const parsed = collaborationSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid collaboration payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-collab-' + Date.now(), source: 'mock' });
    }

    const institution = await db.institution.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!institution) return notFound('Institution not found');

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'collaboration_add',
      resource: 'institution_collaboration',
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