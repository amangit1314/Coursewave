// services/contact.service.ts
import sgMail from "@sendgrid/mail";
import { env } from "../../config/config";

if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

export async function sendContactMessage({
  name,
  phone,
  subject,
  message,
  toEmail,
}: {
  name: string;
  phone: string;
  subject: string;
  message: string;
  toEmail: string;
}) {
  if (!env.SENDGRID_API_KEY) {
    throw new Error(
      "Email service is not configured (SENDGRID_API_KEY missing)"
    );
  }

  const msg = {
    to: toEmail,
    from: "amansoni53453@gmail.com", // legacy hardcoded sender for compat
    subject: `[CourseWave Support] ${subject}`,
    html: `
      <strong>Name:</strong> ${name}<br>
      <strong>Phone:</strong> ${phone}<br>
      <strong>Subject:</strong> ${subject}<br>
      <strong>Message:</strong><br>
      <pre style="font-family: inherit">${message}</pre>
    `,
  };
  await sgMail.send(msg);
}
