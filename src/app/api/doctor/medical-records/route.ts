import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getMedicalRecords } from '@/services/doctor/medicalRecordService';

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

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patient_id');

    const data = await getMedicalRecords(patientId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}