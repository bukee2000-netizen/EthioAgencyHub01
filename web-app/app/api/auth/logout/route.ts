import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';

export async function POST() {
  const response = NextResponse.json({ success: true, data: { message: 'Logged out' } });
  response.cookies.set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
