import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Use service role key to bypass RLS for admin operations
    const supabaseAdmin = getServiceSupabase();

    // Get total patients
    const { count: totalPatients, error: patientsError } = await supabaseAdmin
      .from('patients')
      .select('*', { count: 'exact', head: true });

    if (patientsError) {
      console.error('Error fetching patients count:', patientsError);
    }

    // Get total doctors
    const { count: totalDoctors, error: doctorsError } = await supabaseAdmin
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    if (doctorsError) {
      console.error('Error fetching doctors count:', doctorsError);
    }

    // Get total departments
    const { count: totalDepartments, error: departmentsError } = await supabaseAdmin
      .from('departments')
      .select('*', { count: 'exact', head: true });

    if (departmentsError) {
      console.error('Error fetching departments count:', departmentsError);
    }

    // Get total appointments
    const { count: totalAppointments, error: appointmentsError } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (appointmentsError) {
      console.error('Error fetching appointments count:', appointmentsError);
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments
    const { count: todayPatients, error: todayError } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today);

    if (todayError) {
      console.error('Error fetching today appointments:', todayError);
    }

    // Get pending appointments
    const { count: pendingAppointments, error: pendingError } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error fetching pending appointments:', pendingError);
    }

    // Get completed appointments
    const { count: completedAppointments, error: completedError } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (completedError) {
      console.error('Error fetching completed appointments:', completedError);
    }

    // Calculate demo revenue (in real app, calculate from appointments)
    const totalRevenue = (completedAppointments || 0) * 20000; // Average ₦20,000 per appointment

    const stats = {
      total_patients: totalPatients || 0,
      total_doctors: totalDoctors || 0,
      total_departments: totalDepartments || 0,
      total_appointments: totalAppointments || 0,
      today_patients: todayPatients || 0,
      pending_appointments: pendingAppointments || 0,
      completed_appointments: completedAppointments || 0,
      total_revenue: totalRevenue,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
