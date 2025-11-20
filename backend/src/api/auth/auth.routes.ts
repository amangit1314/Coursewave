import express from "express";

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

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/verify-email", validate(tokenSchema), verifyUserEmail);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/resend-verification", validate(emailSchema), resendVerification);
router.post("/refresh", validate(refreshSchema), refreshToken);
router.post("/logout", validate(refreshSchema), logoutUser);
router.get("/me", getCurrentUser);

export default router;
