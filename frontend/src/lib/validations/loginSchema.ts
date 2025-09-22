// src/lib/validation/loginSchema.ts
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

export type LoginSchema = z.infer<typeof loginSchema>;
