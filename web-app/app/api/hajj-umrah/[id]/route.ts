import { Prisma } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const hajjSchema = z.object({
  name: z.string().min(2),
  passportNo: z.string().optional(),
  groupName: z.string().optional(),
  season: z.string().optional(),
  requirements: z.record(z.unknown()).optional(),
  departureDate: z.coerce.date().optional(),
  sponsorName: z.string().optional(),
  sponsorContact: z.string().optional(),
  accommodationId: z.string().optional(),
  flightPreference: z.enum(['saudi_arabian', 'ethiopian', 'any']).optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: any = { agencyId: session.agencyId };
    if (status) where.status = status;

    const pilgrims = await db.pilgrim.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return ok(pilgrims, { total: pilgrims.length });
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
    const parsed = hajjSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid pilgrim payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), source: 'mock' });
    }

    const pilgrim = await db.pilgrim.create({
      data: {
        ...parsed.data,
        requirements: parsed.data.requirements ? JSON.parse(JSON.stringify(parsed.data.requirements)) : undefined,
        agencyId: session.agencyId
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'pilgrim_create',
      resource: 'pilgrim',
      resourceId: pilgrim.id,
      metadata: { name: pilgrim.name, groupName: pilgrim.groupName }
    });

    return created(pilgrim);
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
    const { id, status, departureDate, requirements, notes } = body;

    if (!id) return notFound('Pilgrim ID required');

    if (!isDatabaseConfigured()) {
      return ok({ id, status, source: 'mock' });
    }

    const existing = await db.pilgrim.findFirst({ where: { id, agencyId: session.agencyId } });
    if (!existing) return notFound('Pilgrim not found');

    const update: Prisma.PilgrimUpdateInput = {};
    if (status) update.status = status;
    if (departureDate) update.departureDate = new Date(departureDate);
    if (requirements) update.requirements = JSON.parse(JSON.stringify(requirements));
    if (notes) update.notes = notes;

    const updated = await db.pilgrim.update({ where: { id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'pilgrim_update',
      resource: 'pilgrim',
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