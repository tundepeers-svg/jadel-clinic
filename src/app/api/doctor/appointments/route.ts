import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { getDoctorAppointments } from '@/services/doctor/appointmentService';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const patientId = searchParams.get('patient_id');

    // Get authenticated user from cookies
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Use authenticated client to query data
    const supabase = createClient();

    // Get doctor record for authenticated user
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();
      





    if (doctorError || !doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor profile not found' },
        { status: 404 }
      );
    }

    // Build query - filter by doctor's appointments
   const { data, error } = await getDoctorAppointments(
  doctor.id,
  date,
  patientId
);
    if (error) {
      console.error('Error fetching doctor appointments:', error);
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
    console.error('Error in doctor appointments route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
