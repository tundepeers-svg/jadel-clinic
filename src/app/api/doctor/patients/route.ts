import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getDoctorPatients } from '@/services/doctor/patientService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const patients = await getDoctorPatients(user.id);

    return NextResponse.json({
      success: true,
      data: patients,
    });
  } catch (error: any) {
    console.error('Error fetching doctor patients:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}