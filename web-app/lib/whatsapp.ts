import crypto from 'crypto';

const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  [key: string]: any;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface NotificationTemplate {
  type: 'registration' | 'document_uploaded' | 'document_verified' | 'document_rejected' | 'travel_ready' | 'group_update';
  pilgrimName: string;
  pilgrimPhone: string;
  additionalData?: Record<string, string>;
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private phoneId: string;
  private accessToken: string;
  private verifyToken: string;

  private constructor() {
    this.phoneId = WHATSAPP_PHONE_ID || '';
    this.accessToken = WHATSAPP_ACCESS_TOKEN || '';
    this.verifyToken = WHATSAPP_VERIFY_TOKEN || '';
  }

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  isConfigured(): boolean {
    return !!(this.phoneId && this.accessToken);
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('251')) {
      return cleaned;
    }
    if (cleaned.startsWith('0')) {
      return '251' + cleaned.substring(1);
    }
    if (cleaned.length === 9) {
      return '251' + cleaned;
    }
    return cleaned;
  }

  getTemplateBody(template: NotificationTemplate): string {
    switch (template.type) {
      case 'registration':
        return `🕌 *Hajj & Umrah Registration Confirmation*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `Welcome! You have been successfully registered for ${template.additionalData?.destination || 'Hajj/Umrah'} ${template.additionalData?.season || ''}.\n\n` +
          `📋 *Registration Details:*\n` +
          `• ID: ${template.additionalData?.pilgrimId || 'N/A'}\n` +
          `• Group: ${template.additionalData?.groupName || 'Not assigned'}\n\n` +
          `📚 Next Steps:\n` +
          `Please upload your required documents through our portal.\n\n` +
          `Best regards,\nEthio Agency`;

      case 'document_uploaded':
        return `📄 *Document Uploaded*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `Your ${template.additionalData?.documentType || 'document'} has been uploaded successfully.\n\n` +
          `📋 *Details:*\n` +
          `• Document: ${template.additionalData?.documentName || 'N/A'}\n` +
          `• Status: Awaiting verification\n\n` +
          `We'll notify you once verified.\n\n` +
          `Ethio Agency`;

      case 'document_verified':
        return `✅ *Document Verified*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `Great news! Your ${template.additionalData?.documentType || 'document'} has been verified.\n\n` +
          `📋 *Verified Document:*\n` +
          `• ${template.additionalData?.documentType || 'Document'}\n\n` +
          `${template.additionalData?.remainingDocs ? `Remaining: ${template.additionalData.remainingDocs} documents` : ''}\n\n` +
          `Keep going! You're one step closer to your pilgrimage. 🕋\n\n` +
          `Ethio Agency`;

      case 'document_rejected':
        return `⚠️ *Document Needs Correction*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `Your ${template.additionalData?.documentType || 'document'} requires changes.\n\n` +
          `📋 *Reason:*\n` +
          `${template.additionalData?.rejectionReason || 'Please contact support'}\n\n` +
          `📝 *Action Required:*\n` +
          `Please re-upload the correct document.\n\n` +
          `Need help? Contact us.\n\n` +
          `Ethio Agency`;

      case 'travel_ready':
        return `🎉 *Ready for Travel!*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `MashAllah! All your documents have been verified and you're ready for your pilgrimage! 🕋\n\n` +
          `📋 *Trip Details:*\n` +
          `• Destination: ${template.additionalData?.destination || 'Hajj/Umrah'}\n` +
          `• Departure: ${template.additionalData?.departureDate || 'TBA'}\n` +
          `• Group: ${template.additionalData?.groupName || 'TBA'}\n\n` +
          `🛫 Stay tuned for travel instructions!\n\n` +
          `May Allah accept your journey! 🤲\n\n` +
          `Ethio Agency`;

      case 'group_update':
        return `📢 *Group Update*\n\n` +
          `Dear ${template.pilgrimName},\n\n` +
          `Your group has been updated:\n\n` +
          `📋 *New Details:*\n` +
          `• Group: ${template.additionalData?.groupName || 'N/A'}\n` +
          `• Leader: ${template.additionalData?.groupLeader || 'TBA'}\n` +
          `• Departure: ${template.additionalData?.departureDate || 'TBA'}\n\n` +
          `Check your portal for full details.\n\n` +
          `Ethio Agency`;

      default:
        return `Notification from Ethio Agency`;
    }
  }

  async sendMessage(to: string, message: string): Promise<WhatsAppResponse> {
    if (!this.isConfigured()) {
      return { success: false, error: 'WhatsApp not configured' };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(to);

      const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message },
      };

      const response = await fetch(
        `${WHATSAPP_API_URL}/${this.phoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.id) {
        return { success: true, messageId: data.id };
      }

      return { success: false, error: data.error?.message || 'Failed to send' };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }

  async sendTemplate(to: string, template: NotificationTemplate): Promise<WhatsAppResponse> {
    const message = this.getTemplateBody(template);
    return this.sendMessage(to, message);
  }

  async sendBulkNotifications(recipients: { phone: string; message: string }[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendMessage(recipient.phone, recipient.message);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { sent, failed };
  }

  verifyWebhook(token: string): boolean {
    return token === this.verifyToken;
  }

  async sendDocumentNotification(
    pilgrimPhone: string,
    pilgrimName: string,
    documentType: string,
    status: 'uploaded' | 'verified' | 'rejected',
    rejectionReason?: string
  ): Promise<WhatsAppResponse> {
    let templateType: NotificationTemplate['type'];

    switch (status) {
      case 'uploaded':
        templateType = 'document_uploaded';
        break;
      case 'verified':
        templateType = 'document_verified';
        break;
      case 'rejected':
        templateType = 'document_rejected';
        break;
      default:
        templateType = 'document_uploaded';
    }

    return this.sendTemplate(pilgrimPhone, {
      type: templateType,
      pilgrimName,
      pilgrimPhone,
      additionalData: {
        documentType,
        rejectionReason: rejectionReason || '',
      },
    });
  }

  async sendRegistrationConfirmation(
    pilgrimPhone: string,
    pilgrimName: string,
    pilgrimId: string,
    destination: string,
    season: string,
    groupName?: string
  ): Promise<WhatsAppResponse> {
    return this.sendTemplate(pilgrimPhone, {
      type: 'registration',
      pilgrimName,
      pilgrimPhone,
      additionalData: {
        pilgrimId,
        destination,
        season,
        groupName: groupName || 'Not assigned',
      },
    });
  }

  async sendTravelReadyNotification(
    pilgrimPhone: string,
    pilgrimName: string,
    destination: string,
    departureDate: string,
    groupName: string
  ): Promise<WhatsAppResponse> {
    return this.sendTemplate(pilgrimPhone, {
      type: 'travel_ready',
      pilgrimName,
      pilgrimPhone,
      additionalData: {
        destination,
        departureDate,
        groupName,
      },
    });
  }
}

export const whatsappService = WhatsAppService.getInstance();