// =====================================================
// JADEL CLINIC - Server-Side Supabase Client
// =====================================================
// This file can ONLY be imported by server components and API routes
// Uses @supabase/ssr for proper cookie handling in Next.js 14 App Router

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server client for API routes and Server Components
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// Get authenticated user from server components/API routes
export async function getAuthenticatedUser() {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('❌ [AUTH] Error getting user:', error.message);
    return null;
  }

  if (!user) {
    console.log('⚠️  [AUTH] No authenticated user found');
    return null;
  }

  console.log('✅ [AUTH] User authenticated:', user.id);
  return user;
}

// Get user with profile data
export async function getUserWithProfile() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('❌ [AUTH] Error fetching profile:', error.message);
    return null;
  }

  return profile;
}
