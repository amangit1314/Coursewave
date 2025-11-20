import { z } from "zod";

export const userIdParams = z.object({
  userId: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  about: z.string().max(1000).optional(),
  shortSummary: z.string().max(280).optional(),
  profileImageUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});