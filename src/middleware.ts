// =====================================================
// JADEL CLINIC - Middleware for Authentication & Route Protection
// =====================================================
// This middleware:
// 1. Refreshes Supabase session cookies on every request
// 2. Protects role-based routes
// 3. Redirects unauthenticated users to login

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/patient': ['patient'],
  '/doctor': ['doctor'],
  '/admin': ['admin'],
  '/reception': ['reception'],
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with cookie management
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = userData?.role;
    const allowedRoles = protectedRoutes[protectedRoute];

    // Check if user has required role
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      const dashboardMap: Record<string, string> = {
        'patient': '/patient/dashboard',
        'doctor': '/doctor/dashboard',
        'admin': '/admin/dashboard',
        'reception': '/reception/dashboard',
      };

      const redirectPath = userRole ? dashboardMap[userRole] || '/' : '/login';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/admin/:path*',
    '/reception/:path*',
  ],
};
