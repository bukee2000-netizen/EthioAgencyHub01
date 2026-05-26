import { created, handleAuthError, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { whatsappService } from '@/lib/whatsapp';
import { z } from 'zod';

const sendSchema = z.object({
  to: z.string().min(5),
  message: z.string().min(1).max(4096),
  employeeId: z.string().optional(),
  type: z.enum(['registration', 'document_status', 'travel', 'custom']).default('custom'),
  metadata: z.record(z.unknown()).optional(),
});

const bulkSendSchema = z.object({
  recipients: z.array(z.object({
    to: z.string().min(5),
    message: z.string().min(1),
    employeeId: z.string().optional(),
  })).min(1).max(100),
  type: z.enum(['registration', 'document_status', 'travel', 'custom']).default('custom'),
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid WhatsApp send payload', parsed.error.flatten());

    const { to, message, employeeId, type, metadata } = parsed.data;

    if (!isDatabaseConfigured()) {
      return ok({ success: true, message: 'Mock: WhatsApp message would be sent', to, type, source: 'mock' });
    }

    const service = whatsappService;
    if (!service.isConfigured()) {
      return ok({ success: false, reason: 'not_configured', message: 'WhatsApp service not configured' });
    }

    const result = await service.sendMessage(message, to);

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'whatsapp_send',
      resource: 'whatsapp_message',
      resourceId: employeeId || null,
      metadata: { to, type, success: result.success, ...metadata }
    });

    return ok(result);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok({ configured: false, source: 'mock', health: 'ok' });
    }

    const service = whatsappService;

    return ok({
      configured: service.isConfigured(),
      health: 'ok',
      service: 'whatsapp'
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = bulkSendSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid bulk send payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok({ success: true, sent: parsed.data.recipients.length, failed: 0, source: 'mock' });
    }

    const service = whatsappService;
    if (!service.isConfigured()) {
      return ok({ success: false, reason: 'not_configured' });
    }

    const recipients = parsed.data.recipients.map(r => ({
      phone: r.to,
      message: r.message
    }));

    const results = await Promise.all(recipients.map(r => whatsappService.sendMessage(r.phone, r.message).then(() => true).catch(() => false)));
    const sent = results.filter(Boolean).length;

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'whatsapp_bulk_send',
      resource: 'whatsapp_message',
      resourceId: null,
      metadata: { sent, failed: recipients.length - sent, count: recipients.length }
    });

    return ok(results);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}