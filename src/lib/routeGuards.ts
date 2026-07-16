// =====================================================
// JADEL CLINIC - Route Guards
// =====================================================

import { AuthUser } from '@/types';

/**
 * Check if user has permission to access a route
 */
export function canAccessRoute(user: AuthUser | null, requiredRole: string): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Check if user can access admin routes
 */
export function canAccessAdmin(user: AuthUser | null): boolean {
  return canAccessRoute(user, 'admin');
}

/**
 * Check if user can access doctor routes
 */
export function canAccessDoctor(user: AuthUser | null): boolean {
  return canAccessRoute(user, 'doctor');
}

/**
 * Check if user can access reception routes
 */
export function canAccessReception(user: AuthUser | null): boolean {
  return canAccessRoute(user, 'reception');
}

/**
 * Check if user can access patient routes
 */
export function canAccessPatient(user: AuthUser | null): boolean {
  return canAccessRoute(user, 'patient');
}

/**
 * Get redirect URL for unauthorized access
 */
export function getUnauthorizedRedirect(user: AuthUser | null): string {
  if (!user) return '/login';

  switch (user.role) {
    case 'admin':
      return '/admin/dashboard';
    case 'doctor':
      return '/doctor/dashboard';
    case 'reception':
      return '/patient/dashboard'; // Temporary until reception dashboard is built
    case 'patient':
      return '/patient/dashboard';
    default:
      return '/';
  }
}
