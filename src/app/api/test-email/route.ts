import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: "Jadel Clinic - Resend Test Email",
      html: `
        <h1>🎉 Congratulations!</h1>
        <p>Your Resend integration is working successfully.</p>
        <p>This email was sent from your Jadel Clinic application.</p>
      `,
    });

    if (error) {
      return NextResponse.json({ success: false, error });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err,
    });
  }
}