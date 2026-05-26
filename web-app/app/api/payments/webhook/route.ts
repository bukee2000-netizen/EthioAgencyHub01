import { NextRequest, NextResponse } from 'next/server';
import { getGatewayAdapter } from '@/lib/payments/gateway';
import { mapWebhookToEvent, processWebhookEvent } from '@/lib/payments/webhook';
import type { PaymentGatewayId } from '@/lib/payments/gateway';

export async function POST(req: NextRequest) {
  try {
    const gateway = req.nextUrl.searchParams.get('gateway') as PaymentGatewayId | null;
    if (!gateway || !['telebirr', 'cbe', 'awash', 'card'].includes(gateway)) {
      return NextResponse.json({ success: false, error: 'Invalid or missing gateway parameter' }, { status: 400 });
    }

    const rawBody = await req.text();
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => { headers[key] = value; });

    const adapter = getGatewayAdapter(gateway);
    const payload = await adapter.parseWebhook(rawBody, headers);

    const event = mapWebhookToEvent(payload);
    const result = await processWebhookEvent(event);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: result.message }, { status: 500 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
