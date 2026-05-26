import { z } from 'zod';

export const documentCreateSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['PASSPORT', 'VISA', 'MOLS', 'MEDICAL', 'PHOTO', 'CONTRACT', 'OTHER']),
  filePath: z.string().min(1),
  expiresAt: z.coerce.date().optional()
});
