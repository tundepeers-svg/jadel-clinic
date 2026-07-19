import { NextRequest, NextResponse } from 'next/server';
import { getPatientById } from '@/services/doctor/patientService';
import { getAuthenticatedUser } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user from cookies
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const patient = await getPatientById(params.id);
    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
