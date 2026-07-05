import { z } from "zod";

const envSchema = z.object({
  // Runtime
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5002),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .optional(),

  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),
  ACCESS_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_SECRET: z.string().optional(),

  // Frontend URLs
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_URL_PROD: z.string().url().optional(),
  APP_URL: z.string().url().default("http://localhost:3000"),

  // Stripe — required; failing fast at startup is better than failing
  // at the first checkout request
  STRIPE_API_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // Cloudinary (community chat attachments — optional, upload endpoint
  // degrades to a clear error if unset rather than crashing the server)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Redis / cache (optional — cache middleware guards on presence)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Message queue (optional — background jobs degrade gracefully)
  RABBITMQ_URL: z.string().default("amqp://localhost"),

  // OAuth (optional per provider)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Email / SMTP (optional — features that need email degrade if absent)
  SENDGRID_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().default("noreply@coursewave.com"),
  FROM_EMAIL: z.string().default("noreply@coursewave.com"),
  FROM_NAME: z.string().default("Coursewave"),
  SUPPORT_EMAIL: z.string().default("support@coursewave.com"),

  // Legacy — some code still reads ENVIRONMENT === "DEVELOPMENT" for bcrypt rounds
  ENVIRONMENT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast with a readable error listing every missing/invalid var
  console.error(
    "❌ Invalid environment configuration:\n" +
      parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")
  );
  process.exit(1);
}

export const env = parsed.data;

export const features = {
  cacheEnabled: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
  emailEnabled: !!(env.SENDGRID_API_KEY || (env.SMTP_USER && env.SMTP_PASS)),
  cloudinaryEnabled: !!(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ),
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
};
