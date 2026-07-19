import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: 'No user data found' },
        { status: 401 }
      );
    }

    // Get user profile from database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userProfile,
        session: data.session,
      },
    });
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
