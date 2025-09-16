import nodemailer from 'nodemailer';

// Simple transport: for production replace with authenticated SMTP or provider (Resend, SES, etc.)
// Uses environment variables:
//  - SMTP_HOST
//  - SMTP_PORT
//  - SMTP_USER
//  - SMTP_PASS
//  - INQUIRY_DEST_EMAIL (fallback: and360900@gmail.com)

const dest = process.env.INQUIRY_DEST_EMAIL || 'and360900@gmail.com';

let transporter: nodemailer.Transporter | null = null;

function getTransport() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    // Fallback to ethereal test account if not provided
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'user', pass: 'pass' },
      secure: false
    });
    return transporter;
  }
  transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
  return transporter;
}

export async function sendInquiryMail(data: { name: string; email: string; message: string }) {
  const t = getTransport();
  const subject = `Custom Inquiry from ${data.name}`;
  const text = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
  try {
    await t.sendMail({
      to: dest,
      from: data.email,
      subject,
      text
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
