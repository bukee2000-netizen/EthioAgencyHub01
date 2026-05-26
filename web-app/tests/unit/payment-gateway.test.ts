import { describe, it, expect } from 'vitest';
import { getGatewayAdapter } from '@/lib/payments/gateway';

describe('Payment Gateway Adapters', () => {
  describe('getGatewayAdapter', () => {
    it('returns telebirr adapter', () => {
      const adapter = getGatewayAdapter('telebirr');
      expect(adapter).toBeDefined();
      expect(typeof adapter.initiatePayment).toBe('function');
      expect(typeof adapter.verifyPayment).toBe('function');
      expect(typeof adapter.parseWebhook).toBe('function');
    });

    it('returns cbe adapter', () => {
      const adapter = getGatewayAdapter('cbe');
      expect(adapter).toBeDefined();
    });

    it('returns awash adapter', () => {
      const adapter = getGatewayAdapter('awash');
      expect(adapter).toBeDefined();
    });

    it('returns card adapter', () => {
      const adapter = getGatewayAdapter('card');
      expect(adapter).toBeDefined();
    });
  });

  describe('TelebirrAdapter', () => {
    it('initiates payment and returns pending status', async () => {
      const adapter = getGatewayAdapter('telebirr');
      const result = await adapter.initiatePayment({
        transactionId: 'txn-001',
        amount: 1000,
        currency: 'ETB',
      });
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn-001');
      expect(result.status).toBe('pending');
      expect(result.gatewayReference).toContain('TEL-');
      expect(result.redirectUrl).toContain('telebirr.et');
    });

    it('parses webhook payload', async () => {
      const adapter = getGatewayAdapter('telebirr');
      const body = JSON.stringify({
        outTradeNo: 'txn-001',
        tradeNo: 'TEL12345',
        tradeStatus: 'TRADE_SUCCESS',
        totalAmount: 1000,
        sign: 'abc123',
      });
      const payload = await adapter.parseWebhook(body, { 'x-sign': 'abc123' });
      expect(payload.transactionId).toBe('txn-001');
      expect(payload.status).toBe('completed');
      expect(payload.paymentMethod).toBe('telebirr');
    });
  });

  describe('CbeAdapter', () => {
    it('initiates payment and returns pending status', async () => {
      const adapter = getGatewayAdapter('cbe');
      const result = await adapter.initiatePayment({
        transactionId: 'txn-002',
        amount: 2000,
        currency: 'ETB',
      });
      expect(result.success).toBe(true);
      expect(result.gatewayReference).toContain('CBE-');
    });
  });

  describe('AwashAdapter', () => {
    it('initiates payment and returns pending status', async () => {
      const adapter = getGatewayAdapter('awash');
      const result = await adapter.initiatePayment({
        transactionId: 'txn-003',
        amount: 3000,
        currency: 'ETB',
      });
      expect(result.success).toBe(true);
      expect(result.gatewayReference).toContain('AWASH-');
    });
  });

  describe('CardAdapter', () => {
    it('initiates payment and returns pending status', async () => {
      const adapter = getGatewayAdapter('card');
      const result = await adapter.initiatePayment({
        transactionId: 'txn-004',
        amount: 4000,
        currency: 'ETB',
      });
      expect(result.success).toBe(true);
      expect(result.gatewayReference).toContain('CHAPA-');
    });
  });

  describe('verifyPayment', () => {
    it('returns completed status for telebirr', async () => {
      const adapter = getGatewayAdapter('telebirr');
      const result = await adapter.verifyPayment('txn-001');
      expect(result.success).toBe(true);
      expect(result.status).toBe('completed');
    });
  });
});
