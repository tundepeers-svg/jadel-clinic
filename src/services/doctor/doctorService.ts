import { supabaseAdmin } from '@/lib/supabase-admin';
import { Doctor } from '@/types/doctor';

export async function getDoctorByUserId(
  userId: string
): Promise<Doctor> {
  const { data, error } = await supabaseAdmin
    .from('doctors')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Doctor profile not found');
  }

  return data;
}

export async function getDoctorProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('doctors')
    .select(`
      *,
      user:users(*),
      department:departments(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Doctor profile not found');
  }

  return data;
}