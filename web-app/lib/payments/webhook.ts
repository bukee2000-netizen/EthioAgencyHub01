import crypto from 'node:crypto';
import { db } from '@/lib/db/prisma';
import { writeAuditLog } from '@/lib/audit/log';
import type { PaymentGatewayId, WebhookPayload } from './gateway';

export interface WebhookEvent {
  type: 'payment.completed' | 'payment.failed' | 'payment.pending';
  transactionId: string;
  gatewayReference: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentGatewayId;
  metadata?: Record<string, unknown>;
}

export async function processWebhookEvent(event: WebhookEvent, agencyId?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (event.type === 'payment.completed') {
      const existing = await db.paymentWebhook.findUnique({
        where: { transactionId: event.transactionId },
      });
      if (existing) {
        return { success: true, message: 'Duplicate webhook ignored' };
      }

      await db.paymentWebhook.create({
        data: {
          transactionId: event.transactionId,
          paymentMethod: event.paymentMethod,
          amount: event.amount,
          currency: event.currency,
          status: 'completed',
          metadata: (event.metadata || {}) as any,
        },
      });

      return { success: true, message: 'Payment recorded' };
    }

    if (event.type === 'payment.failed') {
      await db.paymentWebhook.create({
        data: {
          transactionId: event.transactionId,
          paymentMethod: event.paymentMethod,
          amount: event.amount,
          currency: event.currency,
          status: 'failed',
          metadata: (event.metadata || {}) as any,
        },
      });
      return { success: true, message: 'Failed payment recorded' };
    }

    if (event.type === 'payment.pending') {
      await db.paymentWebhook.upsert({
        where: { transactionId: event.transactionId },
        update: { status: 'pending', metadata: (event.metadata || {}) as any },
        create: {
          transactionId: event.transactionId,
          paymentMethod: event.paymentMethod,
          amount: event.amount,
          currency: event.currency,
          status: 'pending',
          metadata: (event.metadata || {}) as any,
        },
      });
      return { success: true, message: 'Pending payment recorded' };
    }

    return { success: false, message: `Unknown event type: ${event.type}` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Webhook processing failed' };
  }
}

export function verifyWebhookSignature(payload: WebhookPayload, secret: string): boolean {
  if (!payload.signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload.rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(payload.signature), Buffer.from(expected));
}

export function mapWebhookToEvent(payload: WebhookPayload): WebhookEvent {
  const typeMap: Record<string, 'payment.completed' | 'payment.failed' | 'payment.pending'> = {
    completed: 'payment.completed',
    failed: 'payment.failed',
    pending: 'payment.pending',
  };

  return {
    type: typeMap[payload.status] || 'payment.pending',
    transactionId: payload.transactionId,
    gatewayReference: payload.gatewayReference,
    amount: payload.amount,
    currency: payload.currency,
    paymentMethod: payload.paymentMethod,
    metadata: payload.metadata,
  };
}
