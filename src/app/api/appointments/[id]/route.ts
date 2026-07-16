import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, cancelled_reason } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
        if (cancelled_reason) {
          updateData.cancelled_reason = cancelled_reason;
        }
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', params.id)
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

    // Create notification for patient
    if (status && data.patient?.user_id) {
      let notificationMessage = '';
      if (status === 'approved') {
        notificationMessage = `Your appointment with ${data.doctor?.user?.full_name} has been approved.`;
      } else if (status === 'cancelled') {
        notificationMessage = `Your appointment with ${data.doctor?.user?.full_name} has been cancelled.`;
      }

      if (notificationMessage) {
        await supabase.from('notifications').insert({
          user_id: data.patient.user_id,
          title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: notificationMessage,
          type: 'appointment',
          link: '/patient/appointments',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Appointment updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*, user:users(*)),
        doctor:doctors(*, user:users(*), department:departments(*)),
        department:departments(*)
      `)
      .eq('id', params.id)
      .single();

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
