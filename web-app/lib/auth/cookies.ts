import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const SESSION_COOKIE_NAME = 'ethio_agency_session';
export const REFRESH_COOKIE_NAME = 'ethio_agency_refresh';
export const CSRF_COOKIE_NAME = 'ethio_agency_csrf';

export const sessionCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 15
};

export const refreshCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7
};

export const csrfCookieOptions: Partial<ResponseCookie> = {
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24
};