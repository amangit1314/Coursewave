// // services/emailService.ts
// import sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// type ContactPayload = {
//   fromEmail: string;
//   name: string;
//   phone: string;
//   subject: string;
//   message: string;
//   toEmail: string; // always your support inbox
// };

// export async function sendContactMessage({
//   fromEmail,
//   name,
//   phone,
//   subject,
//   message,
//   toEmail,
// }: ContactPayload) {
//   const msg = {
//     to: toEmail,
//     from: process.env.SENDGRID_VERIFIED_SENDER!, // must be your verified sender
//     replyTo: fromEmail, // so you can reply to the user
//     subject: `[CourseWave Support] ${subject}`,
//     html: `
//       <strong>Name:</strong> ${name}<br>
//       <strong>Email:</strong> ${fromEmail}<br>
//       <strong>Phone:</strong> ${phone}<br>
//       <strong>Subject:</strong> ${subject}<br>
//       <strong>Message:</strong><br>
//       <pre style="font-family: inherit">${message}</pre>
//     `
//   };
//   await sgMail.send(msg);
// }


// services/emailService.ts
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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
  const msg = {
    to: toEmail, // where you want to receive contact messages (can be your Gmail, another verified address, etc.)
    // from: process.env.SENDGRID_VERIFIED_SENDER!, // must be a verified sender
    from: "amansoni53453@gmail.com",
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
