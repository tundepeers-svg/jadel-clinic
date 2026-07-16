// =====================================================
// JADEL CLINIC - Middleware for Route Protection
// =====================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = {
  '/patient': ['patient'],
  '/doctor': ['doctor'],
  '/admin': ['admin'],
  '/reception': ['reception'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    // In a real app, you would verify the JWT token from cookies
    // For now, we'll just pass through
    // You can implement proper JWT verification here
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/admin/:path*',
    '/reception/:path*',
  ],
};
