import { Prisma } from '@prisma/client';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const paymentSchema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly']),
  paymentMethod: z.enum(['telebirr', 'cbe', 'awash', 'card']),
  amount: z.number().positive(),
  currency: z.string().default('ETB'),
  reference: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const verifyPaymentSchema = z.object({
  transactionId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid payment payload', parsed.error.flatten());

    const {
      planId,
      billingCycle,
      paymentMethod,
      amount,
      currency,
      reference,
      metadata
    } = parsed.data;

    if (!isDatabaseConfigured()) {
      return ok({
        success: true,
        id: 'mock-payment-' + Date.now(),
        planId,
        billingCycle,
        status: 'completed',
        source: 'mock'
      });
    }

    // Check for duplicate transaction
    const transactionId = 'payment-' + planId + '-' + Date.now();
    const existing = await db.paymentWebhook.findUnique({
      where: { transactionId }
    });

    if (existing) {
      return ok({ success: true, id: existing.id, planId, billingCycle, duplicate: true });
    }

    // Create payment record
    const payment = await db.paymentWebhook.create({
      data: {
        transactionId,
        paymentMethod,
        amount,
        currency,
        status: 'completed',
        reference,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });

    // Update related travel booking if reference exists
    if (reference) {
      const relatedTravel = await db.travel.findFirst({
        where: { bookingReference: reference }
      });

      if (relatedTravel) {
        await db.travel.update({
          where: { id: relatedTravel.id },
          data: { paymentStatus: 'paid' }
        });

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'payment_webhook',
          resource: 'travel',
          resourceId: relatedTravel.id,
          metadata: { transactionId, paymentMethod, amount }
        });
      }
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'payment_received',
      resource: 'paymentWebhook',
      resourceId: payment.id,
      metadata: { planId, billingCycle, paymentMethod, amount }
    });

    return ok(payment);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');
    const bookingReference = searchParams.get('bookingReference');

    if (!isDatabaseConfigured()) {
      return ok({ transactions: [], total: 0, source: 'mock' });
    }

    const where: Prisma.PaymentWebhookWhereInput = {
      ...(transactionId ? { transactionId } : {}),
    };
    if (bookingReference) {
      const travel = await db.travel.findFirst({ where: { bookingReference } });
      if (travel) {
        return ok(await db.paymentWebhook.findMany({ where: { reference: bookingReference } }));
      }
    }

    const payments = await db.paymentWebhook.findMany({
      where,
      orderBy: { receivedAt: 'desc' },
      take: 100
    });

    return ok(payments, { total: payments.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = verifyPaymentSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid verify payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok({ transactionId: body.transactionId, status: 'completed', verified: true, source: 'mock' });
    }

    const payment = await db.paymentWebhook.findUnique({
      where: { transactionId: parsed.data.transactionId }
    });

    if (!payment) return notFound('Payment not found');

    const updated = await db.paymentWebhook.update({
      where: { transactionId: parsed.data.transactionId },
      data: { status: 'completed' }
    });

    // Also mark related travel as paid
    if (payment.reference) {
      await db.travel.updateMany({
        where: { bookingReference: payment.reference },
        data: { paymentStatus: 'paid' }
      });
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'payment_verify',
      resource: 'paymentWebhook',
      resourceId: payment.id,
      metadata: { transactionId: payment.transactionId }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
