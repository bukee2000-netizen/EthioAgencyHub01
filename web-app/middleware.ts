import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const protectedRoutes = [
  '/dashboard',
  '/employee-management',
  '/documents',
  '/travel',
  '/hajj-umrah',
  '/institutions',
  '/agents',
  '/administration',
  '/reporting-analytics',
  '/user-settings',
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return Response.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
