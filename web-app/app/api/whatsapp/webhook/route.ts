import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { object } = body;

    if (object === undefined) {
      return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ success: true, received: false });
    }

    const message = messages[0];
    const senderPhone = message.from;
    const messageType = message.type;

    switch (messageType) {
      case 'text':
        await handleTextMessage(senderPhone, message.text?.body);
        break;
      case 'document':
        await handleDocumentMessage(senderPhone, message.document);
        break;
      case 'image':
        await handleImageMessage(senderPhone, message.image);
        break;
      default:
        console.log(`[WhatsApp Webhook] Unhandled message type: ${messageType}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleTextMessage(phone: string, text: string | undefined) {
  if (!text) return;
  console.log(`[WhatsApp Webhook] Text from ${phone}: ${text.substring(0, 100)}`);

  if (isDatabaseConfigured()) {
    try {
      await db.auditLog.create({
        data: {
          agencyId: 'system',
          actorId: 'whatsapp',
          action: 'whatsapp_msg',
          resource: 'message',
          resourceId: 'msg-' + Date.now(),
          metadata: JSON.stringify({ phone, messageType: 'text', content: text, direction: 'INBOUND' })
        }
      });
    } catch (error) {
      console.error('[WhatsApp Webhook] Failed to store message:', error);
    }
  }
}

async function handleDocumentMessage(phone: string, document: any) {
  console.log(`[WhatsApp Webhook] Document from ${phone}: ${document?.filename}`);

  if (isDatabaseConfigured()) {
    try {
      await db.auditLog.create({
        data: {
          agencyId: 'system',
          actorId: 'whatsapp',
          action: 'whatsapp_doc',
          resource: 'message',
          resourceId: 'doc-' + Date.now(),
          metadata: JSON.stringify({ phone, messageType: 'document', content: document?.filename || '' })
        }
      });
    } catch (error) {
      console.error('[WhatsApp Webhook] Failed to store document message:', error);
    }
  }
}

async function handleImageMessage(phone: string, image: any) {
  console.log(`[WhatsApp Webhook] Image from ${phone}: ${image?.id}`);
}
