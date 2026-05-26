// @/lib/mols/sync.ts
// MOLS Database Sync - Periodic synchronization with MOLS central database

import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

interface MOLSEmployeeRecord {
  passportNumber: string;
  fullName: string;
  nationality: string;
  dateOfBirth: string;
  sex: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: string;
}

interface MOLESSyncResponse {
  success: boolean;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errors: string[];
}

export async function syncMOLSDatabase(): Promise<MOLESSyncResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, totalRecords: 0, newRecords: 0, updatedRecords: 0, errors: ['Database not configured'] };
  }

  try {
    // Get all employees with passports that need MOLS sync
    const employees = await db.employee.findMany({
      where: {
        AND: [
          { passportNumber: { not: null } },
          { passportNumber: { not: '' } }
        ]
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        passportNumber: true,
        nationality: true,
        dateOfBirth: true,
        documents: {
          where: { type: 'PASSPORT' },
          select: { id: true, type: true, filePath: true, status: true, createdAt: true }
        }
      }
    });

    let newRecords = 0;
    let updatedRecords = 0;
    const errors: string[] = [];

    for (const employee of employees) {
      try {
        const passportDoc = employee.documents.find(d => d.type === 'PASSPORT');

        // Check if we need to create or update MOLS record
        const existingRecord = await db.molsRecord.findFirst({
          where: { employeeId: employee.id }
        });

        if (existingRecord) {
          // Update existing record if passport document was renewed
          if (passportDoc && passportDoc.createdAt > existingRecord.updatedAt) {
            await db.molsRecord.update({
              where: { id: existingRecord.id },
              data: {
                stage: 'CONTRACT_LINKED',
                healthCert: false,
                insurance: false,
                coc: false,
                visaUnlocked: false
              }
            });
            updatedRecords++;

            await writeAuditLog({
              agencyId: 'system',
              action: 'mols_sync_update',
              resource: 'molsRecord',
              resourceId: existingRecord.id,
              metadata: { employeeId: employee.id, passportNumber: employee.passportNumber }
            });
          }
        } else if (passportDoc) {
          // Create new MOLS record for employee with passport
          await db.molsRecord.create({
            data: {
              employeeId: employee.id,
              stage: 'CONTRACT_LINKED',
              healthCert: false,
              insurance: false,
              coc: false,
              visaUnlocked: false
            }
          });
          newRecords++;

          await writeAuditLog({
            agencyId: 'system',
            action: 'mols_sync_create',
            resource: 'molsRecord',
            metadata: { employeeId: employee.id, passportNumber: employee.passportNumber }
          });
        }
      } catch (err) {
        errors.push(`Failed to sync employee ${employee.passportNumber}: ${String(err)}`);
      }
    }

    return {
      success: errors.length === 0,
      totalRecords: employees.length,
      newRecords,
      updatedRecords,
      errors
    };
  } catch (error) {
    console.error('[MOLS Sync] Failed:', error);
    return {
      success: false,
      totalRecords: 0,
      newRecords: 0,
      updatedRecords: 0,
      errors: [String(error)]
    };
  }
}

// Get sync status summary
export async function getSyncStatus(): Promise<{
  totalEmployees: number;
  syncedRecords: number;
  pendingRecords: number;
  lastSync?: Date;
}> {
  if (!isDatabaseConfigured()) {
    return { totalEmployees: 0, syncedRecords: 0, pendingRecords: 0 };
  }

  const [totalEmployees, molsRecords] = await Promise.all([
    db.employee.count({ where: { passportNumber: { not: null } } }),
    db.molsRecord.findMany({
      include: { employee: { select: { passportNumber: true } } }
    })
  ]);

  const syncedRecords = molsRecords.filter(r => r.stage !== 'CONTRACT_LINKED').length;
  const pendingRecords = molsRecords.filter(r => r.stage === 'CONTRACT_LINKED').length;
  const lastSync = molsRecords.length > 0
    ? molsRecords.reduce((latest, r) => r.updatedAt > latest ? r.updatedAt : latest, molsRecords[0].updatedAt)
    : undefined;

  return { totalEmployees, syncedRecords, pendingRecords, lastSync };
}