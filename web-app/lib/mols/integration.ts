// @/lib/mols/integration.ts
// MOLS (Ministry of Labor & Social Affairs) Integration Module
// Handles live API connections to MOLS for document processing, visa approval callbacks, etc.

import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

class MOLSIntegration {
  private static instance: MOLSIntegration;

  private constructor() {}

  static getInstance(): MOLSIntegration {
    if (!MOLSIntegration.instance) {
      MOLSIntegration.instance = new MOLSIntegration();
    }
    return MOLSIntegration.instance;
  }

  get isConfigured(): boolean {
    return Boolean(
      process.env.MOLS_API_URL &&
      process.env.MOLS_API_KEY &&
      process.env.MOLS_AGENCY_CODE
    );
  }

  // Submit document to MOLS for verification
  async submitDocument(employeeId: string, documentData: {
    type: string;
    filePath: string;
    passportNumber: string;
    employeeName: string;
  }): Promise<{ success: boolean; molsId?: string; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'MOLS not configured' };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/documents/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        },
        body: JSON.stringify({
          employeeId,
          documentType: documentData.type,
          passportNumber: documentData.passportNumber,
          employeeName: documentData.employeeName,
          documentUrl: documentData.filePath
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'MOLS submission failed');
      }

      // Update document status in our DB
      if (isDatabaseConfigured()) {
        await db.document.update({
          where: { id: documentData.filePath }, // using filePath as placeholder
          data: { status: 'VERIFIED' }
        });

        await writeAuditLog({
          agencyId: 'system',
          action: 'mols_submit',
          resource: 'document',
          resourceId: documentData.filePath,
          metadata: { molsId: data.id, type: documentData.type }
        });
      }

      return { success: true, molsId: data.id };
    } catch (error) {
      console.error('[MOLS] Document submission failed:', error);
      return { success: false, error: String(error) };
    }
  }

  // Check document status in MOLS
  async checkDocumentStatus(molsId: string): Promise<{ success: boolean; status?: string; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'MOLS not configured' };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/documents/${molsId}/status`, {
        headers: {
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'MOLS status check failed');
      }

      return { success: true, status: data.status };
    } catch (error) {
      console.error('[MOLS] Status check failed:', error);
      return { success: false, error: String(error) };
    }
  }

  // Request visa approval through MOLS
  async requestVisaApproval(employeeId: string, visaData: {
    passportNumber: string;
    destination: string;
    visaType: string;
    expiryDate: string;
  }): Promise<{ success: boolean; visaId?: string; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'MOLS not configured' };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/visa/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        },
        body: JSON.stringify({
          employeeId,
          passportNumber: visaData.passportNumber,
          destination: visaData.destination,
          visaType: visaData.visaType,
          expiryDate: visaData.expiryDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Visa request failed');
      }

      // Update VisaApplication status
      if (isDatabaseConfigured()) {
        await db.visaApplication.updateMany({
          where: { employeeId, stage: 'DOCUMENT_COLLECTION' },
          data: { stage: 'PORTAL_REGISTRATION' }
        });

        await writeAuditLog({
          agencyId: 'system',
          action: 'mols_visa_request',
          resource: 'visaApplication',
          resourceId: employeeId,
          metadata: { visaId: data.id, destination: visaData.destination }
        });
      }

      return { success: true, visaId: data.id };
    } catch (error) {
      console.error('[MOLS] Visa request failed:', error);
      return { success: false, error: String(error) };
    }
  }

  // Get MOLS processing statistics
  async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'MOLS not configured' };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        }
      });

      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, error: data.message };
    } catch (error) {
      console.error('[MOLS] Stats fetch failed:', error);
      return { success: false, error: String(error) };
    }
  }

  // Sync employee list with MOLS
  async syncEmployeeList(employees: any[]): Promise<{ success: boolean; synced: number; errors: string[] }> {
    if (!this.isConfigured) {
      return { success: false, synced: 0, errors: ['MOLS not configured'] };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/employees/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        },
        body: JSON.stringify({ employees })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sync failed');
      }

      return { success: true, synced: data.synced || 0, errors: data.errors || [] };
    } catch (error) {
      console.error('[MOLS] Employee sync failed:', error);
      return { success: false, synced: 0, errors: [String(error)] };
    }
  }

  // Verify cross-match through MOLS
  async verifyCrossMatch(employeeId: string): Promise<{ success: boolean; passed: boolean; errors?: string[] }> {
    if (!this.isConfigured) {
      return { success: false, passed: false, errors: ['MOLS not configured'] };
    }

    try {
      const response = await fetch(`${process.env.MOLS_API_URL}/api/cross-match/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOLS_API_KEY}`,
          'X-Agency-Code': process.env.MOLS_AGENCY_CODE || ''
        },
        body: JSON.stringify({ employeeId })
      });

      const data = await response.json();
      return { success: true, passed: data.passed, errors: data.errors };
    } catch (error) {
      console.error('[MOLS] Cross-match verification failed:', error);
      return { success: false, passed: false, errors: [String(error)] };
    }
  }
}

export const molsIntegration = MOLSIntegration.getInstance();
export default molsIntegration;