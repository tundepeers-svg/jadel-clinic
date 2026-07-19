import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getDoctorAppointments(
  doctorId: string,
  date?: string | null,
  patientId?: string | null
) {
  let query = supabaseAdmin
    .from('appointments')
    .select(`
      *,
      patient:patients(
        *,
        user:users(*)
      ),
      department:departments(*)
    `)
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (date) {
    query = query.eq('appointment_date', date);
  }

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  return await query;
}