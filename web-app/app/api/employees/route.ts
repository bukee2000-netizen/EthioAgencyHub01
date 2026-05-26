import { Prisma, EmployeeStatus } from '@prisma/client';
import { employees } from '@/lib/mock-data';
import { employeeCreateSchema } from '@/lib/validations/employee.schema';
import { created, ok, serverError, validationError, handleAuthError } from '@/lib/api/responses';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const session = getSession();
    if (!session) return ok([], { total: 0, source: 'mock' });

    if (!isDatabaseConfigured()) {
      return ok(employees, { total: employees.length, source: 'mock' });
    }

    const { searchParams } = new URL(req.url);

    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const destination = searchParams.get('destination') || '';
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {
      ...(session.agencyId ? { agencyId: session.agencyId } : {}),
      ...(query ? {
        OR: [
          { name: { contains: query } },
          { role: { contains: query } },
          { destination: { contains: query } }
        ]
      } : {}),
      ...(status ? { status: status as EmployeeStatus } : {}),
      ...(destination ? { destination } : {}),
    };

    const [data, total] = await Promise.all([
      db.employee.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { documents: true, travels: true }
          }
        }
      }),
      db.employee.count({ where })
    ]);

    return ok(data, { total, page, limit, source: 'database' });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) {
      return ok(employees, { total: employees.length, source: 'mock' });
    }
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) return validationError('Authentication required');

    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return created({ ...body, id: 'mock-' + Date.now(), status: 'REGISTERED', source: 'mock' });
    }

    const personal = body.personal || body;
    const skills = body.skills || {};
    const documents = body.documents || {};
    const psychology = body.psychology || {};

    const data: Prisma.EmployeeUncheckedCreateInput = {
      agencyId: session.agencyId,
      name: `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Unknown',
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: personal.email,
      contactPhone: personal.contactPhone,
      alternatePhone: personal.alternatePhone,
      emergencyContact: personal.emergencyContact,
      emergencyPhone: personal.emergencyPhone,
      emergencyRelation: personal.emergencyRelation,
      dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth) : undefined,
      gender: personal.gender,
      maritalStatus: personal.maritalStatus,
      nationality: personal.nationality,
      region: personal.region,
      zone: personal.zone,
      woreda: personal.woreda,
      kebele: personal.kebele,
      fatherName: personal.fatherName,
      motherName: personal.motherName,
      passportNumber: personal.passportNumber,
      passportExpiryDate: personal.passportExpiryDate ? new Date(personal.passportExpiryDate) : undefined,
      passportIssuingDate: personal.passportIssuingDate ? new Date(personal.passportIssuingDate) : undefined,
      passportPlaceOfIssue: personal.passportPlaceOfIssue,
      nationalId: personal.nationalId,
      laborId: personal.laborId,
      bankName: personal.bankName,
      bankAccountNumber: personal.bankAccountNumber,
      bankBranch: personal.bankBranch,
      medicalHistory: personal.medicalHistory,
      religion: personal.religion,
      role: skills.role || body.role,
      education: skills.education || body.education,
      experience: skills.experience || body.experience,
      destination: skills.destination || body.destination,
      languages: (skills.languages || body.languages) ? JSON.stringify(skills.languages || body.languages) : undefined,
      additionalSkills: skills.additionalSkills || body.additionalSkills,
      docPath: documents.docPath || body.docPath,
      tgVideoId: documents.tgVideoId || body.tgVideoId,
      passportSizePhotoPath: documents.passportSizePhoto || body.passportSizePhoto,
      fullBodyPhotoPath: documents.fullBodyPhoto || body.fullBodyPhoto,
      pdfDocuments: documents.pdfDocuments ? JSON.stringify(documents.pdfDocuments) : undefined,
      psychologyScore: psychology.score,
      psychologyAnswers: psychology.answers ? JSON.stringify(psychology.answers) : undefined,
      psychInterviewData: psychology.interview ? JSON.stringify(psychology.interview) : undefined,
      status: body.status || 'REGISTERED',
    };

    const employee = await db.employee.create({ data });
    return created(employee);
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return created({ id: 'mock-' + Date.now(), source: 'mock' });
    }
    return serverError();
  }
}