import { supabaseAdmin } from '@/lib/supabase-admin';
import { getDoctorByUserId } from './doctorService';

export async function getPatientById(patientId: string) {
  const { data, error } = await supabaseAdmin
    .from('patients')
    .select(`
      *,
      user:users(*)
    `)
    .eq('id', patientId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Patient not found');
  }

  return data;
}

export async function getDoctorPatients(userId: string) {
  const doctor = await getDoctorByUserId(userId);

  const { data: appointments, error: appointmentsError } =
    await supabaseAdmin
      .from('appointments')
      .select('patient_id')
      .eq('doctor_id', doctor.id);

  if (appointmentsError) {
    throw new Error(appointmentsError.message);
  }

  const uniquePatientIds = [
    ...new Set(appointments?.map(a => a.patient_id) ?? []),
  ];

  if (uniquePatientIds.length === 0) {
    return [];
  }

  const { data: patients, error: patientsError } =
    await supabaseAdmin
      .from('patients')
      .select(`
        *,
        user:users(*)
      `)
      .in('id', uniquePatientIds);

  if (patientsError) {
    throw new Error(patientsError.message);
  }

  return patients ?? [];
}