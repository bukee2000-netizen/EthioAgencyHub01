import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const webhookSchema = z.object({
  transactionId: z.string().min(1),
  paymentMethod: z.enum(['telebirr', 'cbe', 'awash', 'card']),
  amount: z.number().positive(),
  currency: z.string().default('ETB'),
  status: z.enum(['completed', 'failed', 'pending']),
  reference: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = webhookSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid webhook payload', parsed.error.flatten());
    }

    const { transactionId, paymentMethod, amount, currency, status, reference, metadata } = parsed.data;

    if (!isDatabaseConfigured()) {
      return ok({
        success: true,
        id: 'mock-payment-' + Date.now(),
        transactionId,
        status,
        source: 'mock'
      });
    }

    const existing = await db.paymentWebhook.findUnique({
      where: { transactionId }
    });

    if (existing) {
      return ok({ success: true, id: existing.id, transactionId, status, duplicate: true });
    }

    const payment = await db.paymentWebhook.create({
      data: {
        transactionId,
        paymentMethod,
        amount,
        currency,
        status,
        reference,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });

    if (reference) {
      const relatedTravel = await db.travel.findFirst({
        where: { bookingReference: reference }
      });

      if (relatedTravel) {
        await db.travel.update({
          where: { id: relatedTravel.id },
          data: {
            paymentStatus: status === 'completed' ? 'paid' : 'pending'
          }
        });

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'payment_webhook',
          resource: 'travel',
          resourceId: relatedTravel.id,
          metadata: { transactionId, status, amount, paymentMethod }
        });
      }
    }

    await writeAuditLog({
      agencyId: 'system',
      actorId: 'system',
      action: 'payment_received',
      resource: 'paymentWebhook',
      resourceId: payment.id,
      metadata: { transactionId, paymentMethod, amount, status }
    });

    return ok(payment);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
