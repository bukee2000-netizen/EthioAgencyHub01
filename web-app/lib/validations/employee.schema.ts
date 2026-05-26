import { z } from 'zod';

export const employeeCreateSchema = z.object({
  agencyId: z.string().min(1),
  personal: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    region: z.string().optional(),
    zone: z.string().optional(),
    woreda: z.string().optional(),
    kebele: z.string().optional(),
    contactPhone: z.string().min(7),
    alternatePhone: z.string().optional(),
    emergencyContact: z.string(),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
    nationalId: z.string().optional(),
    laborId: z.string().optional(),
    passportNumber: z.string().optional(),
    passportExpiryDate: z.string().optional(),
    passportIssuingDate: z.string().optional(),
    passportPlaceOfIssue: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankBranch: z.string().optional(),
    medicalHistory: z.string().optional(),
    religion: z.string().optional()
  }),
  skills: z.object({
    education: z.string().optional(),
    role: z.string().optional(),
    experience: z.string().optional(),
    destination: z.string().optional(),
    languages: z.array(z.string()).optional(),
    additionalSkills: z.string().optional()
  }).optional(),
  documents: z.object({
    docPath: z.string().optional(),
    tgVideoId: z.string().optional(),
    passportSizePhoto: z.string().optional(),
    fullBodyPhoto: z.string().optional(),
    pdfDocuments: z.array(z.string()).optional()
  }).optional(),
  psychology: z.object({
    score: z.number().optional(),
    answers: z.array(z.object({
      questionId: z.string(),
      answerIndex: z.number(),
      score: z.number()
    })).optional(),
    notes: z.string().optional(),
    interview: z.object({
      interviewerName: z.string().optional(),
      interviewerRole: z.string().optional(),
      interviewDate: z.string().optional(),
      observations: z.string().optional(),
      emotionalStability: z.number().optional(),
      socialAdaptability: z.number().optional(),
      communicationSkills: z.number().optional(),
      workMotivation: z.number().optional(),
      selfAwareness: z.number().optional(),
      problemSolving: z.number().optional(),
      overallAssessment: z.string().optional(),
      recommendations: z.string().optional(),
    }).optional()
  }).optional()
});

export const employeeUploadSchema = z.object({
  name: z.string().min(2),
  agencyId: z.string().min(1)
});

export const registrationSchema = z.object({
  personal: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    region: z.string().optional(),
    zone: z.string().optional(),
    woreda: z.string().optional(),
    kebele: z.string().optional(),
    contactPhone: z.string().min(7, 'Valid phone number is required'),
    alternatePhone: z.string().optional(),
    emergencyContact: z.string().min(2, 'Emergency contact name is required'),
    emergencyPhone: z.string().min(7, 'Emergency contact phone is required'),
    emergencyRelation: z.string().optional(),
    nationalId: z.string().optional(),
    laborId: z.string().optional(),
    passportNumber: z.string().optional(),
    passportExpiryDate: z.string().optional(),
    passportIssuingDate: z.string().optional(),
    passportPlaceOfIssue: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankBranch: z.string().optional(),
    medicalHistory: z.string().optional(),
    religion: z.string().optional()
  }),
  skills: z.object({
    education: z.string().optional(),
    role: z.string().optional(),
    experience: z.string().optional(),
    destination: z.string().optional(),
    languages: z.array(z.string()).optional(),
    additionalSkills: z.string().optional()
  }).optional(),
  documents: z.object({
    docPath: z.string().optional(),
    tgVideoId: z.string().optional(),
    passportSizePhoto: z.string().optional(),
    fullBodyPhoto: z.string().optional(),
    pdfDocuments: z.array(z.string()).optional()
  }).optional(),
  psychology: z.object({
    score: z.number().optional(),
    answers: z.array(z.object({
      questionId: z.string(),
      answerIndex: z.number(),
      score: z.number()
    })).optional(),
    notes: z.string().optional(),
    interview: z.object({
      interviewerName: z.string().optional(),
      interviewerRole: z.string().optional(),
      interviewDate: z.string().optional(),
      observations: z.string().optional(),
      emotionalStability: z.number().optional(),
      socialAdaptability: z.number().optional(),
      communicationSkills: z.number().optional(),
      workMotivation: z.number().optional(),
      selfAwareness: z.number().optional(),
      problemSolving: z.number().optional(),
      overallAssessment: z.string().optional(),
      recommendations: z.string().optional(),
    }).optional()
  }).optional()
});
