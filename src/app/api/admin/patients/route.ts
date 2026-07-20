import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getPatients } from '@/services/admin/patientService';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    

    // Use service role key to bypass RLS
    

    const result = await getPatients(page, limit);

   return NextResponse.json({
  success: true,
  ...result,
});
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
