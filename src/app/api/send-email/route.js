import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, options } = body;

    // A simple secret to prevent unauthorized usage
    const EXPECTED_SECRET = "Lalbaug-Roti-House-Email-Bypass-Secret-2026";
    
    if (secret !== EXPECTED_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized proxy request" }, { status: 401 });
    }

    // Hardcoded fallback removed for security. Please set these in Vercel Environment Variables.
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = process.env.SMTP_PORT || 587;

    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP credentials in Vercel Environment Variables");
      return NextResponse.json({ success: false, message: "Email configuration missing on server" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort == 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      family: 4, // Force IPv4 to fix ENETUNREACH error on Vercel
    });

    const message = {
      from: `"Lalbaug Roti House" <${smtpUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Vercel proxy email error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
