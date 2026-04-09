import { env } from "./config";

export const EMAIL_CONFIG = {
  // Legacy hardcoded "from" address — kept for compatibility with existing
  // email templates that expect amansoni53453@gmail.com as the sender.
  FROM_EMAIL: "amansoni53453@gmail.com",
  FROM_NAME: env.FROM_NAME,
  SENDGRID_API_KEY: env.SENDGRID_API_KEY ?? "",
  FRONTEND_URL: env.FRONTEND_URL,
};
