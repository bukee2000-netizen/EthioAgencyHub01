import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const update = await req.json();
  return NextResponse.json({ success: true, data: { received: Boolean(update) } });
}
