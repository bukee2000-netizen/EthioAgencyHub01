import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const agentCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  active: z.boolean().default(true),
});

const SUB_RESOURCES = new Set(['performance', 'contracts', 'training', 'support', 'detail', 'me', 'select-employee']);

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      if (path.length === 0) return ok([], { source: 'mock' });
      return ok({ module: 'agents', path, status: 'scaffold' });
    }

    // Base path: list all agents
    if (path.length === 0) {
      const agents = await db.agent.findMany({
        where: { agencyId: session.agencyId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return ok(agents, { total: agents.length });
    }

    const [first, ...rest] = path;

    // Handle known sub-resources
    if (SUB_RESOURCES.has(first)) {
      const id = rest[0];

      if (first === 'me') {
        const agent = await db.agent.findFirst({ where: { agencyId: session.agencyId } });
        return ok(agent || null);
      }

      if (first === 'select-employee') {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const employees = await db.employee.findMany({
          where: {
            agencyId: session.agencyId,
            OR: [
              ...(search ? [{ name: { contains: search } }] : []),
              ...(search ? [{ passportNumber: { contains: search } }] : []),
            ],
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        });
        return ok(employees);
      }

      if (!id) return notFound('Agent ID required.');

      const agent = await db.agent.findFirst({ where: { id, agencyId: session.agencyId } });
      if (!agent) return notFound('Agent not found');

      switch (first) {
        case 'performance': {
          const employees = await db.employee.findMany({
            where: { selectedByAgent: id },
            select: { id: true, status: true, createdAt: true },
          });
          const groupedByMonth: Record<string, { total: number; deployed: number; archived: number }> = {};
          employees.forEach((emp: { id: string; status: string | null; createdAt: Date }) => {
            const month = new Date(emp.createdAt).toISOString().slice(0, 7);
            if (!groupedByMonth[month]) groupedByMonth[month] = { total: 0, deployed: 0, archived: 0 };
            groupedByMonth[month].total++;
            if (emp.status === 'DEPLOYED') groupedByMonth[month].deployed++;
            if (emp.status === 'ARCHIVED') groupedByMonth[month].archived++;
          });
          const perfData = Object.entries(groupedByMonth).map(([period, data]) => ({
            id: `perf-${period}`,
            period,
            employees: data.total,
            deployed: data.deployed,
            archived: data.archived,
            successRate: data.total > 0 ? Math.round((data.deployed / data.total) * 100) : 0,
          }));
          return ok(perfData);
        }
        case 'contracts': {
          const empContracts = await db.employee.findMany({
            where: { selectedByAgent: id },
            include: { travels: { take: 1, orderBy: { createdAt: 'desc' } } },
          });
          const contracts = empContracts.map((emp: any) => ({
            id: `contract-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            contractType: emp.role || 'Standard',
            startDate: emp.createdAt.toISOString().split('T')[0],
            endDate: emp.passportExpiryDate?.toISOString().split('T')[0] || 'N/A',
            salary: 0,
            status: emp.status === 'DEPLOYED' ? 'active' : emp.status === 'REGISTERED' ? 'pending' : 'inactive',
            destination: emp.destination || 'TBD',
          }));
          return ok(contracts);
        }
        case 'training': {
          const logs = await db.auditLog.findMany({
            where: { agencyId: session.agencyId, action: { contains: 'training' } },
            orderBy: { createdAt: 'desc' },
            take: 50,
          });
          return ok(
            logs.map((l: any) => ({
              id: l.id,
              title: l.action.replace('training_', ''),
              status: 'scheduled',
              date: l.createdAt,
              description: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
              attendees: 0,
            }))
          );
        }
        case 'support': {
          const tickets = await db.auditLog.findMany({
            where: { agencyId: session.agencyId, action: { contains: 'support' } },
            orderBy: { createdAt: 'desc' },
            take: 50,
          });
          return ok(
            tickets.map((t: any) => ({
              id: t.id,
              subject: t.action,
              description: t.metadata ? (typeof t.metadata === 'string' ? t.metadata : JSON.stringify(t.metadata)) : '',
              status: 'open',
              priority: 'medium',
              createdAt: t.createdAt,
            }))
          );
        }
        case 'detail': {
          const [employeesCount, activeEmployees, deployedCount] = await Promise.all([
            db.employee.count({ where: { selectedByAgent: id } }),
            db.employee.count({ where: { selectedByAgent: id, status: { not: 'ARCHIVED' } } }),
            db.employee.count({ where: { selectedByAgent: id, status: 'DEPLOYED' } }),
          ]);
          return ok({
            ...agent,
            employeesCount,
            activeEmployees,
            deployedCount,
            performance: {
              totalEmployees: employeesCount,
              activeEmployees,
              deployedCount,
              avgCompletionRate: employeesCount > 0 ? Math.round((deployedCount / employeesCount) * 100) : 0,
            },
          });
        }
      }
    }

    // First segment is an agent ID
    const agent = await db.agent.findFirst({ where: { id: first, agencyId: session.agencyId } });
    if (!agent) return notFound('Agent not found');
    return ok(agent);
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
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return created({ path, ...body, source: 'mock' });
    }

    const [resource] = path;

    switch (resource) {
      case 'training': {
        if (!body.title) return validationError('Title is required');
        const training = await db.auditLog.create({
          data: {
            agencyId: session.agencyId,
            actorId: session.userId,
            action: 'training_' + body.title,
            resource: 'training',
            resourceId: 'session-' + Date.now(),
            metadata: JSON.stringify({ description: body.description || '', attendees: body.attendees || 0 }),
          },
        });
        return created({ id: training.id, title: body.title, status: 'scheduled' });
      }
      case 'support': {
        if (!body.subject) return validationError('Subject is required');
        const ticket = await db.auditLog.create({
          data: {
            agencyId: session.agencyId,
            actorId: session.userId,
            action: 'support_' + body.subject,
            resource: 'support',
            resourceId: 'ticket-' + Date.now(),
            metadata: JSON.stringify({ description: body.description || '', priority: body.priority || 'medium' }),
          },
        });
        return created({ id: ticket.id, subject: body.subject, status: 'open' });
      }
      case 'select-employee': {
        const { employeeId, agentId } = body;
        if (!employeeId || !agentId) return validationError('employeeId and agentId are required');
        const updated = await db.employee.update({
          where: { id: employeeId, agencyId: session.agencyId },
          data: { selectedByAgent: agentId },
        });
        return ok(updated);
      }
      default: {
        // Base path POST: create agent
        const parsed = agentCreateSchema.safeParse(body);
        if (!parsed.success) return validationError('Invalid agent payload', parsed.error.flatten());
        const agent = await db.agent.create({ data: { ...parsed.data, agencyId: session.agencyId } });
        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'create',
          resource: 'agent',
          resourceId: agent.id,
          metadata: { name: agent.name },
        });
        return created(agent);
      }
    }
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
      return notFound('Invalid agent update path.');
    }

    const id = path[0];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ id, ...body, source: 'mock' });
    }

    const existing = await db.agent.findFirst({ where: { id, agencyId: session.agencyId } });
    if (!existing) return notFound('Agent not found');

    const updated = await db.agent.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        phone: body.phone ?? existing.phone,
        active: body.active ?? existing.active,
      },
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
    if (path.length !== 1 || SUB_RESOURCES.has(path[0])) {
      return notFound('Invalid agent delete path.');
    }

    const id = path[0];

    if (!isDatabaseConfigured()) {
      return ok({ id, deleted: true, source: 'mock' });
    }

    const existing = await db.agent.findFirst({ where: { id, agencyId: session.agencyId } });
    if (!existing) return notFound('Agent not found');

    await db.agent.update({ where: { id }, data: { deletedAt: new Date() } });
    return ok({ id, deleted: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
