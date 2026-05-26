import { handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const agentUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
});

const performanceSchema = z.object({
  dateRange: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }).optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!isDatabaseConfigured()) {
      if (id) {
        return ok({ id: 'mock-agent', name: 'Mock Agent', phone: '+251911234567', active: true, employeesCount: 5, source: 'mock' });
      }
      return ok([], { source: 'mock' });
    }

    if (id) {
      const agent = await db.agent.findFirst({
        where: { id, agencyId: session.agencyId }
      });
      if (!agent) return notFound('Agent not found');

      const employeesCount = await db.employee.count({ where: { selectedByAgent: id } });
      const activeEmployees = await db.employee.count({ where: { selectedByAgent: id, status: { not: 'ARCHIVED' } } });
      const employees = await db.employee.findMany({
        where: { selectedByAgent: id },
        select: { id: true, name: true, firstName: true, lastName: true, status: true, destination: true }
      });

      return ok({
        ...agent,
        employeesCount,
        activeEmployees,
        employees
      });
    }

    const agents = await db.agent.findMany({
      where: { agencyId: session.agencyId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const agentsWithStats = await Promise.all(agents.map(async (agent) => {
      const count = await db.employee.count({ where: { selectedByAgent: agent.id } });
      return { ...agent, employeesCount: count };
    }));

    return ok(agentsWithStats, { total: agentsWithStats.length });
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
    const parsed = agentUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid agent payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok({ id: body.id || 'mock', ...parsed.data, source: 'mock' });
    }

    const agentId = new URL(req.url).searchParams.get('id');
    if (!agentId) return notFound('Agent ID required');

    const existing = await db.agent.findFirst({ where: { id: agentId, agencyId: session.agencyId } });
    if (!existing) return notFound('Agent not found');

    const updated = await db.agent.update({ where: { id: agentId }, data: parsed.data });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'agent_update',
      resource: 'agent',
      resourceId: agentId,
      metadata: { name: updated.name }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return notFound('Agent ID required');

    if (!isDatabaseConfigured()) {
      return ok({ id, deleted: true, source: 'mock' });
    }

    const existing = await db.agent.findFirst({ where: { id, agencyId: session.agencyId } });
    if (!existing) return notFound('Agent not found');

    await db.agent.update({ where: { id }, data: { deletedAt: new Date() } });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'agent_delete',
      resource: 'agent',
      resourceId: id,
      metadata: { name: existing.name }
    });

    return ok({ id, deleted: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}