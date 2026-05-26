import { z } from 'zod';
import { ok, notFound, handleAuthError, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const draftUpdateSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')),
    contactPhone: z.string().min(5).optional(),
    emergencyContact: z.string().min(1).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    region: z.string().optional(),
    zone: z.string().optional(),
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
  }).optional(),
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
  step: z.number().min(0).max(3)
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    
    if (!isDatabaseConfigured()) {
      // Return mock draft for development
      if (params.id === 'mock-draft-1') {
        return ok({
          id: params.id,
          personal: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', contactPhone: '1234567890', emergencyContact: 'Jane Doe' },
          skills: { role: 'Nurse', destination: 'Saudi Arabia' },
          step: 1,
          createdAt: new Date().toISOString()
        });
      }
      return notFound('Draft not found');
    }

    const draft = await db.employeeDraft.findFirst({
      where: { 
        id: params.id,
        agencyId: session.agencyId 
      }
    });

    if (!draft) {
      return notFound('Draft not found');
    }

    return ok({
      id: draft.id,
      personal: JSON.parse(draft.personal),
      skills: draft.skills ? JSON.parse(draft.skills) : null,
      documents: draft.documents ? JSON.parse(draft.documents) : null,
      step: draft.step,
      createdAt: draft.createdAt.toISOString()
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = draftUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid draft update payload', parsed.error.flatten());
    }

    const { personal, skills, documents, step } = parsed.data;

    if (!isDatabaseConfigured()) {
      // Return updated mock draft for development
      if (params.id === 'mock-draft-1') {
        const updatedDraft = {
          id: params.id,
          personal,
          skills,
          documents,
          step,
          createdAt: new Date().toISOString()
        };
        return ok(updatedDraft);
      }
      return notFound('Draft not found');
    }

    const existingDraft = await db.employeeDraft.findFirst({
      where: { 
        id: params.id,
        agencyId: session.agencyId 
      }
    });

    if (!existingDraft) {
      return notFound('Draft not found');
    }

    const draft = await db.employeeDraft.update({
      where: { id: params.id },
      data: {
        personal: JSON.stringify(personal),
        skills: skills ? JSON.stringify(skills) : null,
        documents: documents ? JSON.stringify(documents) : null,
        step
      }
    });

    await writeAuditLog({ 
      agencyId: session.agencyId, 
      actorId: session.userId, 
      action: 'update', 
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    
    if (!isDatabaseConfigured()) {
      // Return success for development
      return ok({ success: true });
    }

    const existingDraft = await db.employeeDraft.findFirst({
      where: { 
        id: params.id,
        agencyId: session.agencyId 
      }
    });

    if (!existingDraft) {
      return notFound('Draft not found');
    }

    await db.employeeDraft.delete({
      where: { id: params.id }
    });

    await writeAuditLog({ 
      agencyId: session.agencyId, 
      actorId: session.userId, 
      action: 'delete', 
      resource: 'employee_draft', 
      resourceId: params.id 
    });

    return ok({ success: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}