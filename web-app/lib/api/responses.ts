import { NextResponse } from 'next/server';
import { AuthorizationError } from '@/lib/auth/session';

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function validationError(message: string, details?: unknown) {
  return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message, details } }, { status: 400 });
}

export function unauthorized(message = 'Authentication required') {
  return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message } }, { status: 401 });
}

export function forbidden(message = 'Insufficient permissions') {
  return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message } }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message } }, { status: 404 });
}

export function serverError(message = 'Unexpected server error') {
  return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message } }, { status: 500 });
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthorizationError) {
    return error.status === 403 ? forbidden(error.message) : unauthorized(error.message);
  }
  return null;
}
