import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
  refreshToken,
  logoutUser,
  getCurrentUser,
  oauthLogin,
} from "./auth.controller";

import { validate } from "../../core/middleware/validate";
import {
  registerSchema,
  loginSchema,
  tokenSchema,
  emailSchema,
  refreshSchema,
  resetPasswordSchema,
} from "./auth.schemas";

const router = express.Router();

// Strict rate limiting for auth-sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", strictLimiter, validate(loginSchema), loginUser);
router.post("/verify-email", authLimiter, validate(tokenSchema), verifyUserEmail);
router.post("/forgot-password", strictLimiter, validate(emailSchema), forgotPassword);
router.post("/reset-password", strictLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/resend-verification", authLimiter, validate(emailSchema), resendVerification);
router.post("/refresh", authLimiter, validate(refreshSchema), refreshToken);
router.post("/logout", validate(refreshSchema), logoutUser);
router.post("/oauth", authLimiter, oauthLogin);
router.get("/me", getCurrentUser);

export default router;
