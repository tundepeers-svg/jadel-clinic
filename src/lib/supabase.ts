// =====================================================
// JADEL CLINIC - Supabase Client Configuration
// =====================================================
// BROWSER-SIDE CLIENT - Uses cookie storage for SSR compatibility

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase credentials not found. Using placeholder values.');
  console.warn('   The app will work with mock data. To use real database:');
  console.warn('   1. Create a Supabase project at https://supabase.com');
  console.warn('   2. Add credentials to .env.local');
  console.warn('   3. Run: npm run dev');
}

// Browser client with cookie storage - compatible with SSR
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Service role client for admin operations (bypasses RLS)
// DO NOT expose this to the client - server-side only
export function getServiceSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Service role key not configured. Using placeholder.');
  }

  // Use regular createClient for service role
  const { createClient } = require('@supabase/supabase-js');
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
