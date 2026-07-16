// =====================================================
// JADEL CLINIC - Email Service (Resend)
// =====================================================

import { Resend } from 'resend';
import { APP_CONFIG } from './constants';
import { formatDate, formatTime } from './utils';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface AppointmentEmailData {
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

function getEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: #dbeafe;
      margin: 10px 0 0 0;
      font-size: 14px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1e293b;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    .content p {
      color: #475569;
      margin: 0 0 15px 0;
    }
    .details-box {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .details-box h3 {
      color: #1e293b;
      font-size: 16px;
      margin: 0 0 15px 0;
      font-weight: 600;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #64748b;
      font-weight: 500;
    }
    .detail-value {
      color: #1e293b;
      font-weight: 600;
      text-align: right;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: #ffffff;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #1e293b;
      color: #cbd5e1;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_CONFIG.name}</h1>
      <p>${APP_CONFIG.tagline}</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>${APP_CONFIG.name}</strong></p>
      <p>${APP_CONFIG.location}</p>
      <p>Phone: ${APP_CONFIG.phone} | Emergency: ${APP_CONFIG.emergency}</p>
      <p>Email: <a href="mailto:${APP_CONFIG.email}">${APP_CONFIG.email}</a></p>
      <p style="margin-top: 20px; color: #94a3b8; font-size: 12px;">
        © ${new Date().getFullYear()} ${APP_CONFIG.name}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.log('Resend not configured. Email would be sent:', {
      to: data.patient_email,
      subject: 'Appointment Confirmation',
    });
    return;
  }

  const content = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${data.patient_name},</p>
    <p>Thank you for booking an appointment with ${APP_CONFIG.name}. Your appointment has been received and is pending approval.</p>

    <div class="details-box">
      <h3>Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${data.doctor_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Department</span>
        <span class="detail-value">${data.department_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(data.appointment_date, 'PPP')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(data.appointment_time)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Reason</span>
        <span class="detail-value">${data.reason}</span>
      </div>
    </div>

    <p>You will receive a confirmation email once your appointment is approved by our reception team.</p>
    <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.patient_email,
      subject: `Appointment Confirmation - ${APP_CONFIG.name}`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
  }
}

export async function sendAppointmentApproval(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.log('Resend not configured. Email would be sent:', {
      to: data.patient_email,
      subject: 'Appointment Approved',
    });
    return;
  }

  const content = `
    <h2>Appointment Approved ✓</h2>
    <p>Dear ${data.patient_name},</p>
    <p>Great news! Your appointment has been approved and confirmed.</p>

    <div class="details-box">
      <h3>Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${data.doctor_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Department</span>
        <span class="detail-value">${data.department_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(data.appointment_date, 'PPP')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(data.appointment_time)}</span>
      </div>
    </div>

    <p><strong>Important Reminders:</strong></p>
    <ul>
      <li>Please arrive 15 minutes before your appointment time</li>
      <li>Bring a valid ID and insurance card (if applicable)</li>
      <li>Bring any previous medical records or test results</li>
      <li>If you need to cancel, notify us at least 24 hours in advance</li>
    </ul>

    <p>We look forward to seeing you!</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.patient_email,
      subject: `Appointment Approved - ${APP_CONFIG.name}`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error('Error sending appointment approval email:', error);
  }
}

export async function sendAppointmentCancellation(data: AppointmentEmailData, reason?: string): Promise<void> {
  if (!resend) {
    console.log('Resend not configured. Email would be sent:', {
      to: data.patient_email,
      subject: 'Appointment Cancelled',
    });
    return;
  }

  const content = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${data.patient_name},</p>
    <p>Your appointment has been cancelled.</p>

    <div class="details-box">
      <h3>Cancelled Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${data.doctor_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(data.appointment_date, 'PPP')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(data.appointment_time)}</span>
      </div>
      ${reason ? `
      <div class="detail-row">
        <span class="detail-label">Reason</span>
        <span class="detail-value">${reason}</span>
      </div>
      ` : ''}
    </div>

    <p>If you would like to reschedule, please book a new appointment through our website or contact us directly.</p>
    <a href="${APP_CONFIG.url}/book-appointment" class="button">Book New Appointment</a>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.patient_email,
      subject: `Appointment Cancelled - ${APP_CONFIG.name}`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error('Error sending appointment cancellation email:', error);
  }
}

export async function sendAppointmentReminder(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.log('Resend not configured. Email would be sent:', {
      to: data.patient_email,
      subject: 'Appointment Reminder',
    });
    return;
  }

  const content = `
    <h2>Appointment Reminder</h2>
    <p>Dear ${data.patient_name},</p>
    <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>

    <div class="details-box">
      <h3>Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Doctor</span>
        <span class="detail-value">${data.doctor_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Department</span>
        <span class="detail-value">${data.department_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(data.appointment_date, 'PPP')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${formatTime(data.appointment_time)}</span>
      </div>
    </div>

    <p><strong>Don't forget to:</strong></p>
    <ul>
      <li>Arrive 15 minutes early</li>
      <li>Bring your ID and insurance card</li>
      <li>Bring any relevant medical records</li>
    </ul>

    <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
    <p>Phone: ${APP_CONFIG.phone}</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.patient_email,
      subject: `Reminder: Appointment Tomorrow - ${APP_CONFIG.name}`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
  }
}
