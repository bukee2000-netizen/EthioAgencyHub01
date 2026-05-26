import { WhatsAppService } from '@/lib/whatsapp';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const whatsappService = WhatsAppService.getInstance();

// Hook into employee registration to send WhatsApp notification
export async function notifyEmployeeRegistration(employeeData: {
  name: string;
  phone: string;
  employeeId?: string;
  destination?: string;
  season?: string;
  groupName?: string;
}) {
  if (!whatsappService.isConfigured()) {
    console.warn('[WhatsApp] Not configured - skipping notification');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const result = await whatsappService.sendRegistrationConfirmation(
      employeeData.phone,
      employeeData.name,
      employeeData.employeeId || `TEMP-${Date.now()}`,
      employeeData.destination || 'TBD',
      employeeData.season || 'N/A',
      employeeData.groupName
    );

    if (isDatabaseConfigured() && employeeData.employeeId) {
      await writeAuditLog({
        agencyId: 'system',
        actorId: 'system',
        action: 'whatsapp_notification',
        resource: 'employee',
        resourceId: employeeData.employeeId,
        metadata: { type: 'registration', phone: employeeData.phone, result: result.success }
      });
    }

    return result;
  } catch (error) {
    console.error('[WhatsApp] Registration notification failed:', error);
    return { success: false, error: String(error) };
  }
}

// Hook into document upload to send WhatsApp notification
export async function notifyDocumentStatus(employeeData: {
  name: string;
  phone: string;
  employeeId?: string;
  documentType: string;
  status: 'uploaded' | 'verified' | 'rejected';
  rejectionReason?: string;
  remainingDocs?: number;
}) {
  if (!whatsappService.isConfigured()) {
    console.warn('[WhatsApp] Not configured - skipping notification');
    return { success: false, reason: 'not_configured' };
  }

  try {
    let result;
    switch (employeeData.status) {
      case 'uploaded':
        result = await whatsappService.sendDocumentNotification(
          employeeData.phone,
          employeeData.name,
          employeeData.documentType,
          'uploaded'
        );
        break;
      case 'verified':
        result = await whatsappService.sendDocumentNotification(
          employeeData.phone,
          employeeData.name,
          employeeData.documentType,
          'verified'
        );
        break;
      case 'rejected':
        result = await whatsappService.sendDocumentNotification(
          employeeData.phone,
          employeeData.name,
          employeeData.documentType,
          'rejected',
          employeeData.rejectionReason
        );
        break;
    }

    if (isDatabaseConfigured() && employeeData.employeeId) {
      await writeAuditLog({
        agencyId: 'system',
        actorId: 'system',
        action: 'whatsapp_notification',
        resource: 'document',
        resourceId: employeeData.employeeId,
        metadata: { type: employeeData.status, documentType: employeeData.documentType, phone: employeeData.phone }
      });
    }

    return result;
  } catch (error) {
    console.error('[WhatsApp] Document notification failed:', error);
    return { success: false, error: String(error) };
  }
}

// Hook into travel status changes to send WhatsApp notification
export async function notifyTravelReady(employeeData: {
  name: string;
  phone: string;
  employeeId?: string;
  destination: string;
  departureDate: string;
  groupName?: string;
}) {
  if (!whatsappService.isConfigured()) {
    console.warn('[WhatsApp] Not configured - skipping notification');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const result = await whatsappService.sendTravelReadyNotification(
      employeeData.phone,
      employeeData.name,
      employeeData.destination,
      employeeData.departureDate,
      employeeData.groupName || 'Not assigned'
    );

    if (isDatabaseConfigured() && employeeData.employeeId) {
      await writeAuditLog({
        agencyId: 'system',
        actorId: 'system',
        action: 'whatsapp_notification',
        resource: 'travel',
        resourceId: employeeData.employeeId,
        metadata: { destination: employeeData.destination, departureDate: employeeData.departureDate }
      });
    }

    return result;
  } catch (error) {
    console.error('[WhatsApp] Travel notification failed:', error);
    return { success: false, error: String(error) };
  }
}

// Send bulk notifications to multiple employees
export async function sendBulkNotifications(recipients: {
  phone: string;
  message: string;
}[]) {
  if (!whatsappService.isConfigured()) {
    return { success: false, reason: 'not_configured', sent: 0, failed: recipients.length };
  }

  try {
    const result = await whatsappService.sendBulkNotifications(recipients);
    return { success: true, ...result };
  } catch (error) {
    console.error('[WhatsApp] Bulk notification failed:', error);
    return { success: false, error: String(error), sent: 0, failed: recipients.length };
  }
}

// Health check for WhatsApp service
export function checkWhatsAppHealth() {
  return {
    configured: whatsappService.isConfigured(),
    service: 'whatsapp',
    timestamp: new Date().toISOString()
  };
}