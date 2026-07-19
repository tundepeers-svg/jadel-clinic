import { supabaseAdmin } from '@/lib/supabase-admin';
import { DoctorDashboardStats } from '../../types/dashboard';

export async function getDoctorStats(
  doctorId: string
): Promise<DoctorDashboardStats> {
  const today = new Date().toISOString().split('T')[0];

  // Get today's appointments
  const { count: todayAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('appointment_date', today);

  // Get pending appointments
  const { count: pendingAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('status', 'pending');

  // Get completed appointments today
  const { count: completedAppointments } = await supabaseAdmin
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('appointment_date', today)
    .eq('status', 'completed');

  // Get total unique patients
  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select('patient_id')
    .eq('doctor_id', doctorId);

  const uniquePatients = new Set(
    appointments?.map(a => a.patient_id) || []
  );

  return {
    today_appointments: todayAppointments || 0,
    pending_appointments: pendingAppointments || 0,
    completed_appointments: completedAppointments || 0,
    total_patients: uniquePatients.size,
  };
}