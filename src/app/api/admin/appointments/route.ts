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

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    // Use service role key to bypass RLS for admin operations
    const supabaseAdmin = getServiceSupabase();

    let query = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        patient:patients(*, user:users(*)),
        doctor:doctors(*, user:users(*), department:departments(*)),
        department:departments(*)
      `)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching admin appointments:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error('Error in admin appointments route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
