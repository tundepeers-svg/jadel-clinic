import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getMedicalRecords(patientId?: string | null) {
  let query = supabaseAdmin
    .from('medical_records')
    .select(`
      *,
      doctor:doctors(*, user:users(*)),
      prescriptions(*)
    `)
    .order('created_at', { ascending: false });

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}