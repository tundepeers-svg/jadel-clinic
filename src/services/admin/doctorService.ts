import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getDoctors() {
  const { data, error } = await supabaseAdmin
    .from('doctors')
    .select(`
      *,
      user:users(*),
      department:departments(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}