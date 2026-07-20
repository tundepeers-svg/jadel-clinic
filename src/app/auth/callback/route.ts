// =====================================================
// JADEL CLINIC - Auth Callback Route
// =====================================================
// Handles Supabase email verification and magic link redirects
// Required for Next.js App Router email confirmation flow

import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // Handle error from Supabase
  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error_description || 'Authentication failed')}`,
        request.url
      )
    );
  }

  // Exchange code for session
  if (code) {
    const supabase = createClient();

    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent(exchangeError.message)}`,
            request.url
          )
        );
      }

      // Successfully verified email and created session
      // Redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error: any) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('An unexpected error occurred')}`,
          request.url
        )
      );
    }
  }

  // No code or error, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
