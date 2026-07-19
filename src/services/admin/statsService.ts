import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getAdminStats() {
  // Total patients
  const { count: totalPatients } = await supabaseAdmin
    .from('patients')
    .select('*', { count: 'exact', head: true });

  // Total doctors
  const { count: totalDoctors } = await supabaseAdmin
    .from('doctors')
    .select('*', { count: 'exact', head: true });

  // Total departments
  const { count: totalDepartments } = await supabaseAdmin
    .from('departments')
    .select('*', { count: 'exact', head: true });

  // Total appointments
  const { count: totalAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  const today = new Date().toISOString().split('T')[0];

  // Today's appointments
  const { count: todayPatients } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('appointment_date', today);

  // Pending appointments
  const { count: pendingAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Completed appointments
  const { count: completedAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const totalRevenue = (completedAppointments ?? 0) * 20000;

  return {
    total_patients: totalPatients ?? 0,
    total_doctors: totalDoctors ?? 0,
    total_departments: totalDepartments ?? 0,
    total_appointments: totalAppointments ?? 0,
    today_patients: todayPatients ?? 0,
    pending_appointments: pendingAppointments ?? 0,
    completed_appointments: completedAppointments ?? 0,
    total_revenue: totalRevenue,
  };
}