import { NextRequest, NextResponse } from 'next/server';
import {
  sendAppointmentConfirmation,
} from '@/lib/email';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patient_id');
    const doctorId = searchParams.get('doctor_id');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = getServiceSupabase()
      .from('appointments')
      .select(`
        *,
        patient:patients(*, user:users(*)),
        doctor:doctors(*, user:users(*), department:departments(*)),
        department:departments(*)
      `)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, doctor_id, department_id, appointment_date, appointment_time, reason } = body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: existingAppointment } = await getServiceSupabase()
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .neq('status', 'cancelled')
      .single();

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    const [hours, minutes] = appointment_time.split(':');
    const endTime = `${String(parseInt(hours) + (parseInt(minutes) === 30 ? 1 : 0)).padStart(2, '0')}:${parseInt(minutes) === 30 ? '00' : '30'}`;

    const { data: appointment, error } = await getServiceSupabase()
      .from('appointments')
      .insert({
        patient_id,
        doctor_id,
        department_id,
        appointment_date,
        appointment_time,
        end_time: endTime,
        reason,
        status: 'pending',
      })
      .select(`
        *,
        patient:patients(*, user:users(*)),
        doctor:doctors(*, user:users(*), department:departments(*)),
        department:departments(*)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    await getServiceSupabase().from('notifications').insert({
      user_id: patient_id,
      title: 'Appointment Booked',
      message: `Your appointment with ${appointment.doctor?.user?.full_name} on ${appointment_date} at ${appointment_time} has been booked and is pending approval.`,
      type: 'appointment',
      link: '/patient/appointments',
    });

try {
console.log("===== APPOINTMENT DATA =====");
console.log(JSON.stringify(appointment, null, 2));
console.log("============================");
  await sendAppointmentConfirmation({
    patient_name: appointment.patient?.user?.full_name || 'Patient',
    patient_email: appointment.patient?.user?.email,
    doctor_name: appointment.doctor?.user?.full_name || 'Doctor',
    department_name: appointment.department?.name || 'General',
    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    reason: appointment.reason,
  });
} catch (emailError) {
  console.error('Failed to send appointment confirmation email:', emailError);
}

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
