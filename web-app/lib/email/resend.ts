import { Resend } from 'resend';

let client: Resend | null = null;

export function getEmailClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY must be set.');
    client = new Resend(apiKey);
  }
  return client;
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  const resend = getEmailClient();
  const { data, error } = await resend.emails.send({
    from: options.from || 'EthioAgencyHub <noreply@ethioagencyhub.com>',
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}
