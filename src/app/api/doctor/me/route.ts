import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server';
import { getDoctorProfile } from '@/services/doctor/doctorService';

export const dynamic = 'force-dynamic';

/**
 * Get current doctor's profile
 * Uses session from cookie to identify doctor
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from cookies
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const doctor = await getDoctorProfile(user.id);

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error('Error fetching doctor profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
