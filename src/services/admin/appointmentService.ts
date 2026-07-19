import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getAppointments(limit: number, status?: string | null) {
  let query = supabaseAdmin
    .from('appointments')
    .select(`
      *,
      patient:patients(*, user:users(*)),
      doctor:doctors(*, user:users(*), department:departments(*)),
      department:departments(*)
    `)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}