import { Router } from "express";
import * as SecureAuthController from "./secure-auth.controller";

const router = Router();

// Registration & Login
router.post("/register", SecureAuthController.register);
router.post("/login", SecureAuthController.login);

// Password management
router.post("/forgot-password", SecureAuthController.forgotPassword);
router.post("/reset-password", SecureAuthController.resetPassword);

// Email verification
router.post("/verify-email", SecureAuthController.verifyEmail);
router.post("/resend-verification", SecureAuthController.resendVerification);

// Tokens
router.post("/refresh", SecureAuthController.refreshToken);
router.post("/logout", SecureAuthController.logout);

// User info
router.get("/me", SecureAuthController.getMe);

export default router;
