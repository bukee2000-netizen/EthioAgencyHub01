import { Prisma } from '@prisma/client';
import { ok, serverError, created, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const verifySchema = z.object({
  type: z.enum(['mols_approved', 'visa_approved', 'cross_match']),
  reference: z.string().min(1),
  result: z.enum(['pass', 'fail']).optional()
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid verify payload', parsed.error.flatten());
    }

    const { type, reference, result } = parsed.data;

    if (!isDatabaseConfigured()) {
      return created({ type, reference, result: result || 'pass', source: 'mock' });
    }

    if (type === 'mols_approved') {
      await db.molsRecord.updateMany({
        where: { employee: { agencyId: session.agencyId } },
        data: { stage: result === 'pass' ? 'APPROVED' : 'MOLS_SUBMITTED' }
      });
      await writeAuditLog({
        agencyId: session.agencyId, actorId: session.userId,
        action: 'mols_verified', resource: 'molsRecord',
        resourceId: reference, metadata: { result }
      });
      return ok({ type, reference, result });
    } else if (type === 'visa_approved') {
      await db.visaApplication.updateMany({
        where: { employee: { agencyId: session.agencyId } },
        data: { stage: result === 'pass' ? 'VISA_APPROVED' : 'REJECTED_CORRECTION' }
      });
      await writeAuditLog({
        agencyId: session.agencyId, actorId: session.userId,
        action: 'visa_verified', resource: 'visaApplication',
        resourceId: reference, metadata: { result }
      });
      return ok({ type, reference, result });
    } else if (type === 'cross_match') {
      const crossMatch = await db.crossMatchResult.create({
        data: {
          reference,
          result: result === 'pass' ? 'PASS' : 'FAIL',
          agencyId: session.agencyId
        }
      });

      await writeAuditLog({
        agencyId: session.agencyId,
        actorId: session.userId,
        action: 'cross_match',
        resource: 'cross_match_result',
        resourceId: crossMatch.id,
        metadata: { reference, result }
      });

      return created(crossMatch);
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'integration_verify',
      resource: 'verification',
      resourceId: reference,
      metadata: { type, result }
    });

    return ok({ type, reference, result: result || 'pass' });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: Prisma.CrossMatchResultWhereInput = {
      agencyId: session.agencyId,
      ...(type ? { type } : {}),
    };

    const results = await db.crossMatchResult.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return ok(results);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
