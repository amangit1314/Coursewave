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

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Verify email
router.post("/verify-email", verifyUserEmail);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Resend verification email
router.post("/resend-verification", resendVerification);

// Refresh token
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", logoutUser);

// Get current user
router.get("/me", getCurrentUser);

export default router;
