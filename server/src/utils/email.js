import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) return { skipped: true };
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, html });
}
