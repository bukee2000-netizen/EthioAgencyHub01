export type PaymentGatewayId = 'telebirr' | 'cbe' | 'awash' | 'card';

export interface PaymentRequest {
  transactionId: string;
  amount: number;
  currency: string;
  description?: string;
  returnUrl?: string;
  notifyUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  gatewayReference?: string;
  redirectUrl?: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
}

export interface WebhookPayload {
  transactionId: string;
  gatewayReference: string;
  status: 'completed' | 'failed' | 'pending';
  amount: number;
  currency: string;
  paymentMethod: PaymentGatewayId;
  signature: string;
  rawBody: string;
  metadata?: Record<string, unknown>;
}

export interface GatewayAdapter {
  initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(transactionId: string): Promise<PaymentResponse>;
  parseWebhook(body: string, headers: Record<string, string>): Promise<WebhookPayload>;
}

class TelebirrAdapter implements GatewayAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: request.transactionId,
      gatewayReference: `TEL-${request.transactionId.slice(0, 12)}`,
      redirectUrl: `https://checkout.telebirr.et/pay/${request.transactionId}`,
      status: 'pending',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      gatewayReference: `TEL-${transactionId.slice(0, 12)}`,
      status: 'completed',
    };
  }

  async parseWebhook(body: string, headers: Record<string, string>): Promise<WebhookPayload> {
    const data = JSON.parse(body);
    return {
      transactionId: data.outTradeNo || data.transactionId,
      gatewayReference: data.tradeNo || `TEL-${Date.now()}`,
      status: data.tradeStatus === 'TRADE_SUCCESS' ? 'completed' : 'failed',
      amount: data.totalAmount || 0,
      currency: 'ETB',
      paymentMethod: 'telebirr',
      signature: data.sign || headers['x-sign'] || '',
      rawBody: body,
    };
  }
}

class CbeAdapter implements GatewayAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: request.transactionId,
      gatewayReference: `CBE-${request.transactionId.slice(0, 12)}`,
      redirectUrl: `https://ibank.cbe.com.et/pay/${request.transactionId}`,
      status: 'pending',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      gatewayReference: `CBE-${transactionId.slice(0, 12)}`,
      status: 'completed',
    };
  }

  async parseWebhook(body: string, headers: Record<string, string>): Promise<WebhookPayload> {
    const data = JSON.parse(body);
    return {
      transactionId: data.transactionId || data.orderId,
      gatewayReference: data.reference || `CBE-${Date.now()}`,
      status: data.status === 'success' ? 'completed' : 'failed',
      amount: data.amount || 0,
      currency: data.currency || 'ETB',
      paymentMethod: 'cbe',
      signature: data.signature || headers['x-signature'] || '',
      rawBody: body,
    };
  }
}

class AwashAdapter implements GatewayAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: request.transactionId,
      gatewayReference: `AWASH-${request.transactionId.slice(0, 12)}`,
      redirectUrl: `https://ebanking.awashbank.com/pay/${request.transactionId}`,
      status: 'pending',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      gatewayReference: `AWASH-${transactionId.slice(0, 12)}`,
      status: 'completed',
    };
  }

  async parseWebhook(body: string, headers: Record<string, string>): Promise<WebhookPayload> {
    const data = JSON.parse(body);
    return {
      transactionId: data.txnId || data.transactionId,
      gatewayReference: data.refNo || `AWASH-${Date.now()}`,
      status: data.txnStatus === 'success' ? 'completed' : 'failed',
      amount: data.amount || 0,
      currency: data.currency || 'ETB',
      paymentMethod: 'awash',
      signature: data.hmac || headers['x-hmac'] || '',
      rawBody: body,
    };
  }
}

class CardAdapter implements GatewayAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: request.transactionId,
      gatewayReference: `CHAPA-${request.transactionId.slice(0, 12)}`,
      redirectUrl: `https://api.chapa.co/checkout/${request.transactionId}`,
      status: 'pending',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      gatewayReference: `CHAPA-${transactionId.slice(0, 12)}`,
      status: 'completed',
    };
  }

  async parseWebhook(body: string, headers: Record<string, string>): Promise<WebhookPayload> {
    const data = JSON.parse(body);
    return {
      transactionId: data.tx_ref || data.transactionId,
      gatewayReference: data.id || `CHAPA-${Date.now()}`,
      status: data.status === 'success' ? 'completed' : 'failed',
      amount: data.amount || 0,
      currency: data.currency || 'ETB',
      paymentMethod: 'card',
      signature: data['x-chapa-signature'] || headers['x-chapa-signature'] || '',
      rawBody: body,
    };
  }
}

export function getGatewayAdapter(gateway: PaymentGatewayId): GatewayAdapter {
  const adapters: Record<PaymentGatewayId, GatewayAdapter> = {
    telebirr: new TelebirrAdapter(),
    cbe: new CbeAdapter(),
    awash: new AwashAdapter(),
    card: new CardAdapter(),
  };
  return adapters[gateway];
}
