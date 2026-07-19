import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getPatients(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('patients')
    .select(
      `
      *,
      user:users(*)
      `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}