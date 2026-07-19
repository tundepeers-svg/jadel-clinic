import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getAppointments } from '@/services/admin/appointmentService';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get('limit') ?? '100');
    const status = searchParams.get('status');

    const appointments = await getAppointments(limit, status);

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error: any) {
    console.error('Error in admin appointments route:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}