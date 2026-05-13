import { ok } from '@/lib/api/responses';

export async function GET(_: Request, { params }: { params: { slug?: string[] } }) {
  return ok({ module: 'agents', path: params.slug ?? [], status: 'Agent API scaffold ready for implementation' });
}
