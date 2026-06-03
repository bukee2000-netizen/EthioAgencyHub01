export const SESSION_COOKIE_NAME = 'ethio_agency_session';
export const REFRESH_COOKIE_NAME = 'ethio_agency_refresh';
export const CSRF_COOKIE_NAME = 'ethio_agency_csrf';

export const sessionCookieOptions: Record<string, unknown> = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 15
};

export const refreshCookieOptions: Record<string, unknown> = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7
};

export const csrfCookieOptions: Record<string, unknown> = {
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24
};