import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated and is admin
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use service role key to bypass RLS
    const supabaseAdmin = getServiceSupabase();

    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('*, user:users(*), department:departments(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
