import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get total patients
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // Get total doctors
    const { count: totalDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    // Get total departments
    const { count: totalDepartments } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true });

    // Get total appointments
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments
    const { count: todayPatients } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today);

    // Get pending appointments
    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get completed appointments
    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

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
