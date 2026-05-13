import { z } from 'zod';
import { created, handleAuthError, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { notifyEmployeeRegistration } from '@/lib/whatsapp/notifications';

const registerEmployeeSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    contactPhone: z.string().min(5),
    emergencyContact: z.string().min(1),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    region: z.string().optional(),
    zone: z.string().optional(),
    alternatePhone: z.string().optional(),
    nationalId: z.string().optional(),
    laborId: z.string().optional(),
    passportNumber: z.string().optional(),
    passportExpiryDate: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankBranch: z.string().optional()
  }),
  skills: z.object({
    role: z.string().optional(),
    education: z.string().optional(),
    experience: z.string().optional(),
    destination: z.string().optional(),
    languages: z.array(z.string()).optional(),
    additionalSkills: z.string().optional()
  }).optional(),
  documents: z.object({
    docPath: z.string().optional(),
    tgVideoId: z.string().optional(),
    passportSizePhoto: z.string().optional(),
    fullBodyPhoto: z.string().optional()
  }).optional(),
  psychology: z.object({
    score: z.number().optional(),
    answers: z.array(z.object({
      questionId: z.string(),
      answerIndex: z.number(),
      score: z.number()
    })).optional(),
    notes: z.string().optional()
  }).optional()
});

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
