// src/config/constants.ts

export const EMAIL = {
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@coursewave.com",
  FROM_NAME: process.env.FROM_NAME || "Coursewave",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};

export const JWT = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret",
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
};

export const CSRF = {
  TOKEN_EXPIRY_HOURS: 24,
};

export const CRON_SCHEDULES = {
  EMAIL_VERIFICATION_REMINDER: "0 9 * * *", // 9 AM daily
  WEEKLY_REPORT: "0 8 * * 1", // 8 AM every Monday
};

