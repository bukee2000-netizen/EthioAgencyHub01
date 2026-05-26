import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      return ok({ module: 'agents', path, status: 'Agent sub-route scaffold' });
    }

    if (path.length === 0) {
      const agents = await db.agent.findMany({
        where: { agencyId: session.agencyId },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return ok(agents, { total: agents.length });
    }

    const [resource, id] = path;

    switch (resource) {
      case 'performance': {
        if (!id) return notFound('Agent ID required');
        const agent = await db.agent.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!agent) return notFound('Agent not found');

        const employees = await db.employee.findMany({
          where: { selectedByAgent: id },
          select: { id: true, status: true, createdAt: true }
        });

        const groupedByMonth: Record<string, { total: number; deployed: number; archived: number }> = {};
        employees.forEach(emp => {
          const month = new Date(emp.createdAt).toISOString().slice(0, 7);
          if (!groupedByMonth[month]) groupedByMonth[month] = { total: 0, deployed: 0, archived: 0 };
          groupedByMonth[month].total++;
          if (emp.status === 'DEPLOYED') groupedByMonth[month].deployed++;
          if (emp.status === 'ARCHIVED') groupedByMonth[month].archived++;
        });

        const performance = Object.entries(groupedByMonth).map(([period, data]) => ({
          id: `perf-${period}`,
          period,
          employees: data.total,
          deployed: data.deployed,
          archived: data.archived,
          successRate: data.total > 0 ? Math.round((data.deployed / data.total) * 100) : 0
        }));

        return ok(performance);
      }
      case 'contracts': {
        if (!id) return notFound('Agent ID required');
        const agent = await db.agent.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!agent) return notFound('Agent not found');

        const employees = await db.employee.findMany({
          where: { selectedByAgent: id },
          include: { travels: { take: 1, orderBy: { createdAt: 'desc' } } }
        });

        const contracts = employees.map(emp => ({
          id: `contract-${emp.id}`,
          employeeId: emp.id,
          employeeName: emp.name,
          contractType: emp.role || 'Standard',
          startDate: emp.createdAt.toISOString().split('T')[0],
          endDate: emp.passportExpiryDate?.toISOString().split('T')[0] || 'N/A',
          salary: 0,
          status: emp.status === 'DEPLOYED' ? 'active' : emp.status === 'REGISTERED' ? 'pending' : 'inactive',
          destination: emp.destination || 'TBD'
        }));

        return ok(contracts);
      }
      case 'training': {
        if (!id) return notFound('Agent ID required');
        const agent = await db.agent.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!agent) return notFound('Agent not found');

        const logs = await db.auditLog.findMany({
          where: { agencyId: session.agencyId, action: { contains: 'training' } },
          orderBy: { createdAt: 'desc' },
          take: 50
        });

        return ok(logs.map((l: any) => ({
          id: l.id,
          title: l.action.replace('training_', ''),
          status: 'scheduled',
          date: l.createdAt,
          description: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
          attendees: 0
        })));
      }
      case 'support': {
        if (!id) return notFound('Agent ID required');
        const agent = await db.agent.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!agent) return notFound('Agent not found');

        const tickets = await db.auditLog.findMany({
          where: { agencyId: session.agencyId, action: { contains: 'support' } },
          orderBy: { createdAt: 'desc' },
          take: 50
        });

        return ok(tickets.map((t: any) => ({
          id: t.id,
          subject: t.action,
          description: t.metadata ? (typeof t.metadata === 'string' ? t.metadata : JSON.stringify(t.metadata)) : '',
          status: 'open',
          priority: 'medium',
          createdAt: t.createdAt,
        })));
      }
      case 'detail': {
        if (!id) return notFound('Agent ID required');
        const agent = await db.agent.findFirst({
          where: { id, agencyId: session.agencyId }
        });
        if (!agent) return notFound('Agent not found');

        const [employeesCount, activeEmployees, deployedCount] = await Promise.all([
          db.employee.count({ where: { selectedByAgent: id } }),
          db.employee.count({ where: { selectedByAgent: id, status: { not: 'ARCHIVED' } } }),
          db.employee.count({ where: { selectedByAgent: id, status: 'DEPLOYED' } })
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
            avgCompletionRate: employeesCount > 0 ? Math.round((deployedCount / employeesCount) * 100) : 0
          }
        });
      }
      default:
        return notFound(`Unknown agent sub-route: ${resource}`);
    }
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
            metadata: JSON.stringify({ description: body.description || '', attendees: body.attendees || 0 })
          }
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
            metadata: JSON.stringify({ description: body.description || '', priority: body.priority || 'medium' })
          }
        });
        return created({ id: ticket.id, subject: body.subject, status: 'open' });
      }
      default:
        return validationError(`Unknown POST resource: ${resource}`);
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
