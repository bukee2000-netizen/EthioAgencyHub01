import { created, handleAuthError, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { notifyEmployeeRegistration } from '@/lib/whatsapp/notifications';
import { registerEmployeeSchema } from '@/lib/validations/employee.schema';

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = registerEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid employee registration payload', parsed.error.flatten());
    }

    const { personal, skills, documents, psychology } = parsed.data;

    const data = {
      agencyId: session.agencyId,
      name: `${personal.firstName} ${personal.lastName}`.trim(),
      ...personal,
      ...skills,
      languages: skills?.languages ? JSON.stringify(skills.languages) : undefined,
      docPath: documents?.docPath,
      tgVideoId: documents?.tgVideoId,
      passportSizePhotoPath: documents?.passportSizePhoto,
      fullBodyPhotoPath: documents?.fullBodyPhoto,
      psychologyScore: psychology?.score,
      psychologyAnswers: psychology?.answers ? JSON.stringify(psychology.answers) : undefined,
      status: documents?.tgVideoId ? 'INTERVIEW_UPLOADED' as const : 'REGISTERED' as const,
      dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth) : undefined,
      passportExpiryDate: personal.passportExpiryDate ? new Date(personal.passportExpiryDate) : undefined,
      passportIssuingDate: personal.passportIssuingDate ? new Date(personal.passportIssuingDate) : undefined,
      passportPlaceOfIssue: personal.passportPlaceOfIssue,
      kebele: personal.kebele,
      medicalHistory: personal.medicalHistory,
      pdfDocuments: documents?.pdfDocuments ? JSON.stringify(documents.pdfDocuments) : undefined,
      psychInterviewData: psychology?.interview ? JSON.stringify(psychology.interview) : undefined,
    };

    if (!isDatabaseConfigured()) {
      return created({ ...data, id: 'mock-' + Date.now(), source: 'mock' });
    }

    const employee = await db.employee.create({ data });

    // Send WhatsApp notification if phone number provided (non-blocking)
    if (personal.contactPhone) {
      notifyEmployeeRegistration({
        name: employee.name,
        phone: personal.contactPhone,
        employeeId: employee.id,
        destination: employee.destination || undefined,
        groupName: skills?.additionalSkills
      }).catch(err => console.error('[WhatsApp] Failed to notify:', err));
    }

    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'create', resource: 'employee', resourceId: employee.id, metadata: { name: employee.name, destination: employee.destination } });
    return created(employee);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
