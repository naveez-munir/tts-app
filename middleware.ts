/**
 * Next.js Middleware for Authentication and Route Protection
 * Protects admin, operator, and dashboard routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/operator': ['OPERATOR', 'ADMIN'],
  '/dashboard': ['CUSTOMER', 'OPERATOR', 'ADMIN'],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/quote',
  '/checkout', // Checkout handles auth inline
  '/about',
  '/contact',
  '/operators',
  '/operators/register',
  '/privacy',
  '/terms',
  '/cookies',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an API route, static file, or other non-page route
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get auth token and user role from cookies
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Check if user is authenticated
  if (!token) {
    // Redirect to sign-in page with return URL
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check if route requires specific role
  const matchedRoute = Object.keys(protectedRoutes).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (matchedRoute) {
    const allowedRoles = protectedRoutes[matchedRoute];

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role - redirect based on their role
      if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'OPERATOR') {
        return NextResponse.redirect(new URL('/operator/dashboard', request.url));
      } else if (userRole === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        // No valid role - redirect to sign-in
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};

