import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const pilgrimSchema = z.object({
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

const SUB_RESOURCES = new Set(['pilgrim-detail', 'requirements', 'documentation']);

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    if (!isDatabaseConfigured()) {
      if (path.length === 0) return ok([], { source: 'mock' });
      return ok({ module: 'hajj-umrah', path, status: 'scaffold' });
    }

    // Base path: list all pilgrims (optionally filtered by status)
    if (path.length === 0) {
      const where: any = { agencyId: session.agencyId };
      if (status) where.status = status;
      const pilgrims = await db.pilgrim.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
      return ok(pilgrims, { total: pilgrims.length });
    }

    const [first, ...rest] = path;

    // Sub-resource routes
    if (SUB_RESOURCES.has(first)) {
      const id = rest[0];
      if (!id) return notFound('Pilgrim ID required.');

      switch (first) {
        case 'pilgrim-detail': {
          const pilgrim = await db.pilgrim.findFirst({ where: { id, agencyId: session.agencyId } });
          if (!pilgrim) return notFound('Pilgrim not found');
          return ok(pilgrim);
        }
        case 'requirements': {
          const pilgrim = await db.pilgrim.findFirst({ where: { id, agencyId: session.agencyId } });
          if (!pilgrim) return notFound('Pilgrim not found');
          return ok({ pilgrimId: id, requirements: pilgrim.requirements || {} });
        }
        case 'documentation': {
          const docs = await db.document.findMany({ where: { employeeId: id } });
          return ok(docs);
        }
      }
    }

    // First segment is a pilgrim ID
    const pilgrim = await db.pilgrim.findFirst({ where: { id: first, agencyId: session.agencyId } });
    if (!pilgrim) return notFound('Pilgrim not found');
    return ok(pilgrim);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return created({ path, ...body, source: 'mock' });
    }

    const [resource] = path;

    // Sub-resource POST (requirements update, documentation create)
    if (resource === 'requirements') {
      const { pilgrimId, requirements } = body;
      const updated = await db.pilgrim.update({
        where: { id: pilgrimId, agencyId: session.agencyId },
        data: { requirements },
      });
      return ok(updated);
    }

    if (resource === 'documentation') {
      const { pilgrimId, ...docData } = body;
      const doc = await db.document.create({
        data: { ...docData, employeeId: pilgrimId, agencyId: session.agencyId },
      });
      return created(doc);
    }

    // Base path POST: create pilgrim
    const parsed = pilgrimSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid pilgrim payload', parsed.error.flatten());

    const pilgrim = await db.pilgrim.create({
      data: {
        ...parsed.data,
        requirements: parsed.data.requirements
          ? JSON.parse(JSON.stringify(parsed.data.requirements))
          : undefined,
        agencyId: session.agencyId,
      },
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'pilgrim_create',
      resource: 'pilgrim',
      resourceId: pilgrim.id,
      metadata: { name: pilgrim.name, groupName: pilgrim.groupName },
    });

    return created(pilgrim);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];
    if (path.length !== 1 || SUB_RESOURCES.has(path[0])) {
      return notFound('Invalid pilgrim update path.');
    }

    const id = path[0];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ id, ...body, source: 'mock' });
    }

    const existing = await db.pilgrim.findFirst({ where: { id, agencyId: session.agencyId } });
    if (!existing) return notFound('Pilgrim not found');

    const update: Prisma.PilgrimUpdateInput = {};
    if (body.status) update.status = body.status;
    if (body.departureDate) update.departureDate = new Date(body.departureDate);
    if (body.requirements) update.requirements = JSON.parse(JSON.stringify(body.requirements));
    if (body.notes) update.notes = body.notes;

    const updated = await db.pilgrim.update({ where: { id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'pilgrim_update',
      resource: 'pilgrim',
      resourceId: id,
      metadata: { status: body.status },
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
