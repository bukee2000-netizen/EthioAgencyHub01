import { describe, it, expect } from 'vitest';
import { mapWebhookToEvent } from '@/lib/payments/webhook';
import type { WebhookPayload } from '@/lib/payments/gateway';

describe('Payment Webhook', () => {
  describe('mapWebhookToEvent', () => {
    it('maps completed status to payment.completed', () => {
      const payload: WebhookPayload = {
        transactionId: 'txn-001',
        gatewayReference: 'REF-001',
        status: 'completed',
        amount: 1000,
        currency: 'ETB',
        paymentMethod: 'telebirr',
        signature: 'sig',
        rawBody: '{}',
      };
      const event = mapWebhookToEvent(payload);
      expect(event.type).toBe('payment.completed');
      expect(event.transactionId).toBe('txn-001');
      expect(event.amount).toBe(1000);
      expect(event.paymentMethod).toBe('telebirr');
    });

    it('maps failed status to payment.failed', () => {
      const payload: WebhookPayload = {
        transactionId: 'txn-002',
        gatewayReference: 'REF-002',
        status: 'failed',
        amount: 500,
        currency: 'ETB',
        paymentMethod: 'cbe',
        signature: 'sig',
        rawBody: '{}',
      };
      const event = mapWebhookToEvent(payload);
      expect(event.type).toBe('payment.failed');
    });

    it('maps pending status to payment.pending', () => {
      const payload: WebhookPayload = {
        transactionId: 'txn-003',
        gatewayReference: 'REF-003',
        status: 'pending',
        amount: 1500,
        currency: 'ETB',
        paymentMethod: 'awash',
        signature: 'sig',
        rawBody: '{}',
      };
      const event = mapWebhookToEvent(payload);
      expect(event.type).toBe('payment.pending');
    });

    it('includes metadata when provided', () => {
      const payload: WebhookPayload = {
        transactionId: 'txn-004',
        gatewayReference: 'REF-004',
        status: 'completed',
        amount: 2000,
        currency: 'ETB',
        paymentMethod: 'card',
        signature: 'sig',
        rawBody: '{}',
        metadata: { bookingRef: 'BOOK-001' },
      };
      const event = mapWebhookToEvent(payload);
      expect(event.metadata).toEqual({ bookingRef: 'BOOK-001' });
    });
  });
});
