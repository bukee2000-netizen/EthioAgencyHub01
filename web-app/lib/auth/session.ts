import { cookies, headers } from 'next/headers';
import { SESSION_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/auth/cookies';
import { verifySessionToken, verifyCsrfToken, type SessionPayload } from '@/lib/auth/jwt';

export function getSession(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function requireSession(): SessionPayload {
  const session = getSession();
  if (!session) {
    throw new AuthorizationError('Authentication required', 401);
  }
  return session;
}

export function requireRole(allowed: SessionPayload['role'][]): SessionPayload {
  const session = requireSession();
  if (!allowed.includes(session.role)) {
    throw new AuthorizationError('Insufficient permissions', 403);
  }
  return session;
}

export function verifyCsrf(request: Request): boolean {
  const cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get('x-csrf-token');
  
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  try {
    return verifyCsrfToken(headerToken, cookieToken);
  } catch {
    return false;
  }
}

export function requireCsrf(request: Request): void {
  if (!verifyCsrf(request)) {
    throw new AuthorizationError('Invalid CSRF token', 403);
  }
}

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
