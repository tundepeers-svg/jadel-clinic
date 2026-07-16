import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get appointments by status
    const { data: appointmentsByStatus } = await supabase
      .from('appointments')
      .select('status')
      .then(({ data }) => {
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

    // Get appointments by department
    const { data: appointmentsByDepartment } = await supabase
      .from('appointments')
      .select('department:departments(name)')
      .then(({ data }) => {
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

    // Get monthly appointments (last 6 months)
    const { data: appointments } = await supabase
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

    // Get patient growth
    const { data: patients } = await supabase.from('patients').select('created_at');

    const patientGrowth = patients?.reduce((acc: any, curr: any) => {
      const month = new Date(curr.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const analytics = {
      appointments_by_status: appointmentsByStatus || [],
      appointments_by_department:
        appointmentsByDepartment?.sort((a, b) => b.count - a.count) || [],
      monthly_appointments: Object.keys(monthlyAppointments || {}).map((month) => ({
        month,
        count: monthlyAppointments[month],
      })),
      patient_growth: Object.keys(patientGrowth || {}).map((month) => ({
        month,
        count: patientGrowth[month],
      })),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
