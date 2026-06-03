import { db } from '@/lib/db/prisma';

export async function getInstitutionsByAgency(agencyId: string) {
  return db.institution.findMany({
    where: { agencyId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function getInstitutionById(id: string, agencyId: string) {
  return db.institution.findFirst({
    where: { id, agencyId, deletedAt: null },
  });
}

export async function createInstitution(data: {
  agencyId: string;
  name: string;
  type?: string;
  contact?: string;
  country?: string;
}) {
  return db.institution.create({ data });
}

export async function softDeleteInstitution(id: string, agencyId: string) {
  return db.institution.updateMany({
    where: { id, agencyId },
    data: { deletedAt: new Date() },
  });
}
