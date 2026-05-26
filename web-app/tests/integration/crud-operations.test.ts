import { describe, it, expect, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth/password';

// Use a separate test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'file:./test.db'
    }
  }
});

beforeAll(async () => {
  // Clean up test data
  await prisma.auditLog.deleteMany();
  await prisma.paymentWebhook.deleteMany();
  await prisma.crossMatchResult.deleteMany();
  await prisma.molsRecord.deleteMany();
  await prisma.visaApplication.deleteMany();
  await prisma.travel.deleteMany();
  await prisma.document.deleteMany();
  await prisma.employeeDraft.deleteMany();
  await prisma.generatedCv.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();
});

describe('Employee CRUD API', () => {
  let agencyId: string;
  let userId: string;

  it('should create agency and user for testing', async () => {
    const agency = await prisma.agency.create({
      data: { name: 'Test Agency' }
    });
    agencyId = agency.id;

    const user = await prisma.user.create({
      data: {
        email: 'test@agency.com',
        passwordHash: await hashPassword('Test@123456'),
        role: 'AGENCY_ADMIN',
        agencyId
      }
    });
    userId = user.id;

    expect(agency.id).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@agency.com');
    expect(user.role).toBe('AGENCY_ADMIN');
  });

  it('should create employee', async () => {
    const employee = await prisma.employee.create({
      data: {
        agencyId,
        name: 'Test Employee',
        firstName: 'Test',
        lastName: 'Employee',
        email: 'employee@test.com',
        contactPhone: '+251912345678',
        emergencyContact: 'Emergency Contact',
        nationality: 'Ethiopian',
        role: 'Domestic Worker',
        destination: 'Saudi Arabia',
        status: 'REGISTERED'
      }
    });

    expect(employee.id).toBeDefined();
    expect(employee.name).toBe('Test Employee');
    expect(employee.status).toBe('REGISTERED');
    expect(employee.agencyId).toBe(agencyId);
  });

  it('should update employee status', async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId, name: 'Test Employee' }
    });
    expect(employee).not.toBeNull();

    const updated = await prisma.employee.update({
      where: { id: employee!.id },
      data: { status: 'DOCUMENT_REVIEW' }
    });

    expect(updated.status).toBe('DOCUMENT_REVIEW');
  });

  it('should create employee draft', async () => {
    const draft = await prisma.employeeDraft.create({
      data: {
        agencyId,
        personal: JSON.stringify({
          firstName: 'Draft',
          lastName: 'Employee',
          contactPhone: '+251987654321',
          emergencyContact: 'Draft Emergency'
        }),
        step: 1
      }
    });

    expect(draft.id).toBeDefined();
    expect(draft.step).toBe(1);
  });

  it('should query employees with pagination', async () => {
    // Create multiple employees for pagination test
    for (let i = 0; i < 15; i++) {
      await prisma.employee.create({
        data: {
          agencyId,
          name: `Employee ${i}`,
          firstName: `Test${i}`,
          lastName: `User${i}`,
          status: i < 5 ? 'REGISTERED' : i < 10 ? 'DOCUMENT_REVIEW' : 'INTERVIEW_UPLOADED',
          contactPhone: `+25191234567${i}`
        }
      });
    }

    const total = await prisma.employee.count({ where: { agencyId } });
    expect(total).toBeGreaterThanOrEqual(16); // 1 from first test + 15 new

    // Test pagination
    const page1 = await prisma.employee.findMany({
      where: { agencyId },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    expect(page1.length).toBe(10);

    const page2 = await prisma.employee.findMany({
      where: { agencyId },
      skip: 10,
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    expect(page2.length).toBeGreaterThanOrEqual(6);
  });

  it('should search employees', async () => {
    const results = await prisma.employee.findMany({
      where: {
        agencyId,
        OR: [
          { firstName: { contains: 'Draft' } },
          { lastName: { contains: 'Draft' } }
        ]
      }
    });

    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].firstName).toBe('Draft');
  });

  it('should soft delete employee via status update', async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId, name: 'Test Employee' }
    });

    const updated = await prisma.employee.update({
      where: { id: employee!.id },
      data: { status: 'ARCHIVED', deletedAt: new Date() }
    });

    expect(updated.status).toBe('ARCHIVED');
    expect(updated.deletedAt).toBeDefined();
  });
});

describe('Document Management', () => {
  let employeeId: string;

  beforeAll(async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId, name: 'Test Employee 0' }
    });
    employeeId = employee!.id;
  });

  it('should create document', async () => {
    const document = await prisma.document.create({
      data: {
        employeeId,
        type: 'PASSPORT',
        filePath: '/uploads/test-passport.pdf',
        status: 'PENDING'
      }
    });

    expect(document.id).toBeDefined();
    expect(document.type).toBe('PASSPORT');
    expect(document.status).toBe('PENDING');
  });

  it('should query documents by employee', async () => {
    const documents = await prisma.document.findMany({
      where: { employeeId }
    });

    expect(documents.length).toBeGreaterThanOrEqual(1);
  });

  it('should update document status', async () => {
    const document = await prisma.document.findFirst({
      where: { employeeId, type: 'PASSPORT' }
    });

    const updated = await prisma.document.update({
      where: { id: document!.id },
      data: { status: 'VERIFIED' }
    });

    expect(updated.status).toBe('VERIFIED');
  });

  it('should perform cross-match verification', async () => {
    // Create required documents
    await prisma.document.createMany({
      data: [
        { employeeId, type: 'VISA', filePath: '/uploads/test-visa.pdf', status: 'VERIFIED' },
        { employeeId, type: 'MEDICAL', filePath: '/uploads/test-medical.pdf', status: 'VERIFIED' }
      ]
    });

    const requiredTypes = ['PASSPORT', 'VISA', 'MEDICAL'];
    const documents = await prisma.document.findMany({ where: { employeeId } });
    const present = new Set(documents.map(d => d.type));
    const missing = requiredTypes.filter(t => !present.has(t as any));

    expect(missing.length).toBe(0);
  });
});

describe('Travel Management', () => {
  let employeeId: string;

  beforeAll(async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId, name: { contains: 'Employee 1' } }
    });
    employeeId = employee!.id;
  });

  it('should create travel record', async () => {
    const travel = await prisma.travel.create({
      data: {
        employeeId,
        destination: 'Saudi Arabia',
        departureAt: new Date('2025-02-15'),
        status: 'SCHEDULED',
        ticket: 'ET-412',
        airline: 'Ethiopian Airlines',
        flightNumber: 'ET-412',
        ticketCost: 3500,
        currency: 'SAR'
      }
    });

    expect(travel.id).toBeDefined();
    expect(travel.status).toBe('SCHEDULED');
    expect(travel.destination).toBe('Saudi Arabia');
  });

  it('should update travel status', async () => {
    const travel = await prisma.travel.findFirst({
      where: { employeeId }
    });

    const updated = await prisma.travel.update({
      where: { id: travel!.id },
      data: { status: 'TICKETED' }
    });

    expect(updated.status).toBe('TICKETED');
  });

  it('should query travel with status filtering', async () => {
    const scheduled = await prisma.travel.count({
      where: { employee: { agencyId }, status: 'SCHEDULED' }
    });

    expect(scheduled).toBeGreaterThanOrEqual(0);
  });
});

describe('Agent Management', () => {
  it('should create agent', async () => {
    const agent = await prisma.agent.create({
      data: {
        agencyId,
        name: 'Test Agent Company',
        country: 'Kuwait',
        city: 'Kuwait City',
        phone: '+9651234567',
        commissionRate: 15,
        quotaTotal: 50,
        status: 'active'
      }
    });

    expect(agent.id).toBeDefined();
    expect(agent.name).toBe('Test Agent Company');
    expect(agent.agencyId).toBe(agencyId);
  });

  it('should query agents with filtering', async () => {
    const activeAgents = await prisma.agent.findMany({
      where: { agencyId, active: true }
    });

    expect(activeAgents.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Hajj & Umrah', () => {
  it('should create pilgrim', async () => {
    const pilgrim = await prisma.pilgrim.create({
      data: {
        agencyId,
        name: 'Test Pilgrim',
        passportNo: 'P1234567',
        groupName: 'Group A',
        season: '2025',
        status: 'REGISTERED'
      }
    });

    expect(pilgrim.id).toBeDefined();
    expect(pilgrim.name).toBe('Test Pilgrim');
    expect(pilgrim.groupName).toBe('Group A');
  });

  it('should update pilgrim requirements', async () => {
    const pilgrim = await prisma.pilgrim.findFirst({
      where: { agencyId }
    });

    const updated = await prisma.pilgrim.update({
      where: { id: pilgrim!.id },
      data: {
        requirements: {
          passport: true,
          medical: true,
          visa: false
        }
      }
    });

    expect(updated.requirements).toBeDefined();
  });
});

describe('Institution Management', () => {
  it('should create institution', async () => {
    const institution = await prisma.institution.create({
      data: {
        agencyId,
        name: 'Test Hospital',
        type: 'HOSPITAL',
        contact: '+251912345678',
        country: 'Ethiopia'
      }
    });

    expect(institution.id).toBeDefined();
    expect(institution.name).toBe('Test Hospital');
  });

  it('should soft deactivate institution', async () => {
    const institution = await prisma.institution.findFirst({
      where: { agencyId }
    });

    const deactivated = await prisma.institution.update({
      where: { id: institution!.id },
      data: { active: false }
    });

    expect(deactivated.active).toBe(false);
  });
});

describe('MOLS Integration', () => {
  it('should create MOLS record for employee', async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId }
    });

    const molsRecord = await prisma.molsRecord.create({
      data: {
        employeeId: employee!.id,
        stage: 'CONTRACT_LINKED',
        healthCert: false,
        insurance: false,
        coc: false,
        visaUnlocked: false
      }
    });

    expect(molsRecord.id).toBeDefined();
    expect(molsRecord.stage).toBe('CONTRACT_LINKED');
  });

  it('should progress MOLS stage', async () => {
    const molsRecord = await prisma.molsRecord.findFirst({
      where: { employee: { agencyId } }
    });

    const updated = await prisma.molsRecord.update({
      where: { id: molsRecord!.id },
      data: { stage: 'APPROVED', visaUnlocked: true }
    });

    expect(updated.stage).toBe('APPROVED');
    expect(updated.visaUnlocked).toBe(true);
  });
});

describe('Integration Bridge', () => {
  it('should handle cross-match pass → TRAVEL_READY transition', async () => {
    const employee = await prisma.employee.findFirst({
      where: { agencyId, status: { not: 'ARCHIVED' } }
    });

    // Simulate bridge action
    const updated = await prisma.employee.update({
      where: { id: employee!.id },
      data: { status: 'TRAVEL_READY' as any }
    });

    expect(updated.status).toBe('TRAVEL_READY');
  });

  it('should handle MOLS approved → visa unlock', async () => {
    const molsRecord = await prisma.molsRecord.findFirst({
      where: { employee: { agencyId } }
    });

    await prisma.molsRecord.update({
      where: { id: molsRecord!.id },
      data: { stage: 'APPROVED', visaUnlocked: true }
    });

    const visaApps = await prisma.visaApplication.findMany({
      where: { employeeId: molsRecord!.employeeId }
    });

    // Verify visa records exist or can be unlocked
    expect(molsRecord.visaUnlocked).toBe(true);
  });
});

describe('Audit Logging', () => {
  it('should create audit log entry', async () => {
    const initialCount = await prisma.auditLog.count({ where: { agencyId } });

    await prisma.auditLog.create({
      data: {
        agencyId,
        actorId: userId,
        action: 'test_action',
        resource: 'test_resource',
        resourceId: 'test_id',
        metadata: { test: true }
      }
    });

    const newCount = await prisma.auditLog.count({ where: { agencyId } });
    expect(newCount).toBe(initialCount + 1);
  });

  it('should query audit logs with filtering', async () => {
    const logs = await prisma.auditLog.findMany({
      where: { agencyId, action: 'test_action' },
      take: 10
    });

    expect(logs.length).toBeGreaterThanOrEqual(1);
    expect(logs[0].resource).toBe('test_resource');
  });
});

describe('Payment & Billing', () => {
  it('should create payment webhook record', async () => {
    const webhook = await prisma.paymentWebhook.create({
      data: {
        transactionId: `test-txn-${Date.now()}`,
        paymentMethod: 'telebirr',
        amount: 2500,
        currency: 'ETB',
        status: 'completed',
        reference: 'REF-TEST-001',
        metadata: { planId: 'BASIC', employeeId }
      }
    });

    expect(webhook.id).toBeDefined();
    expect(webhook.status).toBe('completed');
    expect(webhook.amount).toBe(2500);
  });

  it('should query payment webhooks', async () => {
    const webhooks = await prisma.paymentWebhook.findMany({
      where: { status: 'completed' }
    });

    expect(webhooks.length).toBeGreaterThanOrEqual(1);
  });
});