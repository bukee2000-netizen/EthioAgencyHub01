import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerUserSchema = loginSchema.extend({
  agencyId: z.string().min(1),
  role: z.enum(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'VIEWER']).default('VIEWER')
});

export const registerAgencySchema = z.object({
  agencyName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});
