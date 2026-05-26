import { z } from 'zod';
import { ok, handleAuthError, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const draftSchema = z.object({
   personal: z.object({
     firstName: z.string().min(1),
     lastName: z.string().min(1),
     email: z.string().email().optional().or(z.literal('')),
     contactPhone: z.string().min(5),
     emergencyContact: z.string().min(1),
     dateOfBirth: z.string().optional(),
     gender: z.string().optional(),
     maritalStatus: z.string().optional(),
     nationality: z.string().optional(),
region: z.string().optional(),
      zone: z.string().optional(),
      woreda: z.string().optional(),
     alternatePhone: z.string().optional(),
     emergencyPhone: z.string().optional(),
     emergencyRelation: z.string().optional(),
     nationalId: z.string().optional(),
     laborId: z.string().optional(),
     passportNumber: z.string().optional(),
     passportExpiryDate: z.string().optional(),
     fatherName: z.string().optional(),
     motherName: z.string().optional(),
     bankName: z.string().optional(),
     bankAccountNumber: z.string().optional(),
     bankBranch: z.string().optional()
   }).passthrough(),
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
   psychology: z.record(z.string(), z.number()).optional(),
   step: z.number().min(0).max(4),
   createdAt: z.string().optional()
 });

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    
    if (!isDatabaseConfigured()) {
      // Return mock drafts for development
      return ok([
        {
          id: 'mock-draft-1',
          personal: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', contactPhone: '1234567890', emergencyContact: 'Jane Doe' },
          skills: { role: 'Nurse', destination: 'Saudi Arabia' },
          step: 1,
          createdAt: new Date().toISOString()
        }
      ]);
    }

    const drafts = await db.employeeDraft.findMany({
      where: { agencyId: session.agencyId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return ok(drafts);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = draftSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid draft payload', parsed.error.flatten());
    }

const { personal, skills, documents, step, createdAt } = parsed.data;

     if (!isDatabaseConfigured()) {
       // Return mock draft for development
       const mockDraft = {
         id: 'mock-draft-' + Date.now(),
         personal,
         skills,
         documents,
         step,
         createdAt: createdAt || new Date().toISOString(),
         agencyId: session.agencyId
       };
       return ok(mockDraft);
     }

     const draft = await db.employeeDraft.create({
       data: {
         agencyId: session.agencyId,
         personal: JSON.stringify(personal),
         skills: skills ? JSON.stringify(skills) : null,
         documents: documents ? JSON.stringify(documents) : null,
         step,
         createdAt: createdAt ? new Date(createdAt) : new Date()
       }
     });

    await writeAuditLog({ 
      agencyId: session.agencyId, 
      actorId: session.userId, 
      action: 'create', 
      resource: 'employee_draft', 
      resourceId: draft.id, 
      metadata: { step: draft.step } 
    });

    return ok(draft);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}