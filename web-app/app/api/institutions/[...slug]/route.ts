import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const institutionSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional(),
  contact: z.string().optional(),
  country: z.string().optional(),
  active: z.boolean().default(true),
});

const SUB_RESOURCES = new Set(['partners', 'collaboration', 'institution-detail']);

function isSubResource(segment: string) {
  return SUB_RESOURCES.has(segment);
}

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      if (path.length === 0) return ok([], { source: 'mock' });
      const [resource, id] = path;
      if (id) return ok({ id, name: 'Mock Institution', type: 'Embassy', country: 'Saudi Arabia', source: 'mock' });
      return ok({ module: 'institutions', path, status: 'scaffold' });
    }

    // Base path: list all
    if (path.length === 0) {
      const data = await db.institution.findMany({
        where: { agencyId: session.agencyId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return ok(data, { total: data.length });
    }

    const [first, ...rest] = path;

    // If first segment is a sub-resource name
    if (isSubResource(first)) {
      const id = rest[0];
      if (!id) return notFound(`Institution ID required for ${first}.`);

      const institution = await db.institution.findFirst({
        where: { id, agencyId: session.agencyId, deletedAt: null },
      });
      if (!institution) return notFound('Institution not found');

      return ok([]); // partners and collaboration are stubs for now
    }

    // First segment is an institution ID
    const id = first;
    const institution = await db.institution.findFirst({
      where: { id, agencyId: session.agencyId, deletedAt: null },
    });
    if (!institution) return notFound('Institution not found');
    return ok(institution);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];

    // POST to sub-resource
    if (path.length > 0 && isSubResource(path[0])) {
      return created({ id: `mock-${Date.now()}`, resource: path[0], source: 'mock' });
    }

    // POST to base path: create institution
    const body = await req.json();
    const parsed = institutionSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid institution payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: `mock-${Date.now()}`, source: 'mock' });
    }

    const inst = await db.institution.create({
      data: { ...parsed.data, agencyId: session.agencyId },
    });
    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'create',
      resource: 'institution',
      resourceId: inst.id,
      metadata: { name: inst.name },
    });
    return created(inst);
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
    if (path.length !== 1 || isSubResource(path[0])) {
      return notFound('Invalid institution update path.');
    }

    const id = path[0];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ id, ...body, source: 'mock' });
    }

    const existing = await db.institution.findFirst({
      where: { id, agencyId: session.agencyId, deletedAt: null },
    });
    if (!existing) return notFound('Institution not found');

    const updated = await db.institution.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        contact: body.contact ?? existing.contact,
        country: body.country ?? existing.country,
        active: body.active ?? existing.active,
      },
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'institution_update',
      resource: 'institution',
      resourceId: id,
      metadata: { name: updated.name },
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];
    if (path.length !== 1 || isSubResource(path[0])) {
      return notFound('Invalid institution delete path.');
    }

    const id = path[0];

    if (!isDatabaseConfigured()) {
      return ok({ id, deleted: true, source: 'mock' });
    }

    const existing = await db.institution.findFirst({
      where: { id, agencyId: session.agencyId, deletedAt: null },
    });
    if (!existing) return notFound('Institution not found');

    await db.institution.update({ where: { id }, data: { deletedAt: new Date() } });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'institution_delete',
      resource: 'institution',
      resourceId: id,
    });

    return ok({ id, deleted: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
