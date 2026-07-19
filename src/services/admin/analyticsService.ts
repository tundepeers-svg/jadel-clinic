import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getAnalytics() {
  // Appointments by status
  const { data: appointmentsByStatus } = await supabaseAdmin
    .from('appointments')
    .select('status')
    .then(({ data }: { data: any[] | null }) => {
      const statusCounts = data?.reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      return {
        data: Object.keys(statusCounts || {}).map((status) => ({
          status,
          count: statusCounts[status],
        })),
      };
    });

  // Appointments by department
  const { data: appointmentsByDepartment } = await supabaseAdmin
    .from('appointments')
    .select('department:departments(name)')
    .then(({ data }: { data: any[] | null }) => {
      const deptCounts = data?.reduce((acc: any, curr: any) => {
        const deptName = curr.department?.name || 'Unassigned';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {});

      return {
        data: Object.keys(deptCounts || {}).map((department_name) => ({
          department_name,
          count: deptCounts[department_name],
        })),
      };
    });

  // Monthly appointments
  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select('appointment_date, created_at');

  const monthlyAppointments = appointments?.reduce((acc: any, curr: any) => {
    const month = new Date(curr.appointment_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Patient growth
  const { data: patients } = await supabaseAdmin
    .from('patients')
    .select('created_at');

  const patientGrowth = patients?.reduce((acc: any, curr: any) => {
    const month = new Date(curr.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return {
    appointments_by_status: appointmentsByStatus || [],

    appointments_by_department:
      appointmentsByDepartment?.sort(
        (a: { count: number }, b: { count: number }) =>
          b.count - a.count
      ) || [],

    monthly_appointments: Object.keys(monthlyAppointments || {}).map((month) => ({
      month,
      count: monthlyAppointments[month],
    })),

    patient_growth: Object.keys(patientGrowth || {}).map((month) => ({
      month,
      count: patientGrowth[month],
    })),
  };
}