import { ok, serverError } from '@/lib/api/responses';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return ok({ received: true, event: body });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inngest webhook failed.';
    return serverError(message);
  }
}
