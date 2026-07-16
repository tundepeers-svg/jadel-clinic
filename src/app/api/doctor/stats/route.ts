import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, we'll use a simple approach - get doctor ID from query or session
    // In production, verify JWT token here
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get doctor record
    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor profile not found' },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('appointment_date', today);

    // Get pending appointments
    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('status', 'pending');

    // Get completed appointments today
    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('appointment_date', today)
      .eq('status', 'completed');

    // Get total unique patients
    const { data: appointments } = await supabase
      .from('appointments')
      .select('patient_id')
      .eq('doctor_id', doctor.id);

    const uniquePatients = new Set(appointments?.map(a => a.patient_id) || []);

    const stats = {
      today_appointments: todayAppointments || 0,
      pending_appointments: pendingAppointments || 0,
      completed_appointments: completedAppointments || 0,
      total_patients: uniquePatients.size,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching doctor stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
