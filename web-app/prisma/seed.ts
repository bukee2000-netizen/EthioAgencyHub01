import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create agency
  const agency = await prisma.agency.create({
    data: {
      name: 'Ethio Employment Agency',
    },
  });
  console.log('Created agency:', agency.name);

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      agencyId: agency.id,
      email: 'admin@ethioagency.com',
      passwordHash,
      role: 'AGENCY_ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create demo employees
  const employees = [
    { name: 'Tadesse Bekele', role: 'Software Engineer', destination: 'Germany', status: 'DOCUMENT_REVIEW' as const },
    { name: 'Alemu Demissie', role: 'Nurse', destination: 'UK', status: 'INTERVIEW_UPLOADED' as const },
    { name: 'Birhanu Mengistu', role: 'Driver', destination: 'Saudi Arabia', status: 'TRAVEL_READY' as const },
    { name: 'Chaltu Ahmed', role: 'Teacher', destination: 'Qatar', status: 'REGISTERED' as const },
    { name: 'Dawit Haile', role: 'Electrician', destination: 'UAE', status: 'DEPLOYED' as const },
  ];

  for (const emp of employees) {
    const employee = await prisma.employee.create({
      data: {
        agencyId: agency.id,
        name: emp.name,
        role: emp.role,
        destination: emp.destination,
        status: emp.status,
      },
    });
    console.log('Created employee:', employee.name);

    // Add some documents
    await prisma.document.create({
      data: {
        employeeId: employee.id,
        type: 'PASSPORT',
        filePath: '/docs/passport.pdf',
        status: 'VERIFIED',
      },
    });
    await prisma.document.create({
      data: {
        employeeId: employee.id,
        type: 'VISA',
        filePath: '/docs/visa.pdf',
        status: 'PENDING',
      },
    });
  }

  // Create demo agents
  const agents = [
    { name: 'Abebe Kebede', phone: '+251911123456', active: true },
    { name: 'Kebede Hunde', phone: '+251911234567', active: true },
    { name: 'Tigist Wolde', phone: '+251911345678', active: false },
  ];

  for (const agent of agents) {
    await prisma.agent.create({
      data: {
        agencyId: agency.id,
        name: agent.name,
        phone: agent.phone,
        active: agent.active,
      },
    });
  }
  console.log('Created agents');

  // Create demo institutions
  const institutions = [
    { name: 'Ministry of Labor', type: 'Government', country: 'Ethiopia' },
    { name: 'Saudi Embassy', type: 'Embassy', country: 'Saudi Arabia' },
    { name: 'UK NHS', type: 'Healthcare', country: 'UK' },
  ];

  for (const inst of institutions) {
    await prisma.institution.create({
      data: {
        agencyId: agency.id,
        name: inst.name,
        type: inst.type,
        country: inst.country,
        active: true,
      },
    });
  }
  console.log('Created institutions');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });