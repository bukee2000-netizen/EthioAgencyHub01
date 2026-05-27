import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });

export async function softDelete(model: string, id: string): Promise<void> {
  await (db as Record<string, any>)[model].update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}