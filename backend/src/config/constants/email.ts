// src/config/constants/email.ts
import { env } from "../config";

export const EMAIL = {
  FROM_EMAIL: env.FROM_EMAIL,
  FROM_NAME: env.FROM_NAME,
  SMTP_HOST: env.SMTP_HOST,
  SMTP_PORT: env.SMTP_PORT,
  FRONTEND_URL: env.FRONTEND_URL,
};

export const JWT = {
  // ACCESS_TOKEN_SECRET / REFRESH_TOKEN_SECRET are legacy optional vars.
  // Fall back to JWT_SECRET / JWT_REFRESH_SECRET from the main config if unset.
  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET ?? env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET ?? env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
};

export const CSRF = {
  TOKEN_EXPIRY_HOURS: 24,
};

export const CRON_SCHEDULES = {
  EMAIL_VERIFICATION_REMINDER: "0 9 * * *",
  WEEKLY_REPORT: "0 8 * * 1",
};
