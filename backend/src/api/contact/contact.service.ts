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

export async function sendFeedback({
  name,
  email,
  type,
  rating,
  message,
  toEmail,
}: {
  name: string;
  email: string;
  type: "bug" | "improvement" | "general";
  rating: number;
  message: string;
  toEmail: string;
}) {
  if (!env.SENDGRID_API_KEY) {
    throw new Error(
      "Email service is not configured (SENDGRID_API_KEY missing)"
    );
  }

  const ratingStars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const msg = {
    to: toEmail,
    from: "amansoni53453@gmail.com",
    subject: `[CourseWave Feedback] ${type} — ${ratingStars}`,
    html: `
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Type:</strong> ${type}<br>
      <strong>Rating:</strong> ${ratingStars} (${rating}/5)<br>
      <strong>Message:</strong><br>
      <pre style="font-family: inherit">${message}</pre>
    `,
  };
  await sgMail.send(msg);
}

export async function sendFeatureRequest({
  name,
  email,
  title,
  category,
  description,
  priority,
  toEmail,
}: {
  name: string;
  email: string;
  title: string;
  category: string;
  description: string;
  priority: "low" | "medium" | "high";
  toEmail: string;
}) {
  if (!env.SENDGRID_API_KEY) {
    throw new Error(
      "Email service is not configured (SENDGRID_API_KEY missing)"
    );
  }

  const msg = {
    to: toEmail,
    from: "amansoni53453@gmail.com",
    subject: `[CourseWave Feature Request] [${priority.toUpperCase()}] ${title}`,
    html: `
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Title:</strong> ${title}<br>
      <strong>Category:</strong> ${category}<br>
      <strong>Priority:</strong> ${priority}<br>
      <strong>Description:</strong><br>
      <pre style="font-family: inherit">${description}</pre>
    `,
  };
  await sgMail.send(msg);
}
