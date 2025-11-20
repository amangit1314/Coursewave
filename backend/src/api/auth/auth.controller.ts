import { Request, Response } from "express";
import AuthService from "./auth.service";
import { sendSuccess, sendError } from "../../core/middleware/errorHandler";
import { logger } from "../../core/utils/logger";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const result = await AuthService.registerUser(email, password, firstName, lastName, role);
    return sendSuccess(res, result, "User registered", 201);
  } catch (error: any) {
    logger.warn("auth.registerUser error", { error: error.message });
    return sendError(res, error.message || "Registration failed", error.status || 500);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    return sendSuccess(res, result, "Login successful");
  } catch (error: any) {
    logger.warn("auth.loginUser error", { error: error.message });
    return sendError(res, error.message || "Login failed", error.status || 401);
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  try {
    const { token, csrfToken } = req.body;
    const result = await AuthService.verifyEmail(token, csrfToken);
    return sendSuccess(res, result, "Email verified");
  } catch (error: any) {
    logger.warn("auth.verifyUserEmail error", { error: error.message });
    return sendError(res, error.message || "Verification failed", error.status || 400);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    return sendSuccess(res, result, "Password reset email sent");
  } catch (error: any) {
    logger.warn("auth.forgotPassword error", { error: error.message });
    return sendError(res, error.message || "Forgot password failed", error.status || 400);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, csrfToken, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, csrfToken, newPassword);
    return sendSuccess(res, result, "Password reset successful");
  } catch (error: any) {
    logger.warn("auth.resetPassword error", { error: error.message });
    return sendError(res, error.message || "Reset failed", error.status || 400);
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await AuthService.resendVerification(email);
    return sendSuccess(res, result, "Verification email resent");
  } catch (error: any) {
    logger.warn("auth.resendVerification error", { error: error.message });
    return sendError(res, error.message || "Resend failed", error.status || 400);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    return sendSuccess(res, result, "Access token refreshed");
  } catch (error: any) {
    logger.warn("auth.refreshToken error", { error: error.message });
    return sendError(res, error.message || "Refresh failed", error.status || 401);
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.logout(refreshToken);
    return sendSuccess(res, result, "Logged out");
  } catch (error: any) {
    logger.warn("auth.logoutUser error", { error: error.message });
    return sendError(res, error.message || "Logout failed", error.status || 500);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const result = await AuthService.getCurrentUser(token || "");
    return sendSuccess(res, result, "Current user");
  } catch (error: any) {
    logger.warn("auth.getCurrentUser error", { error: error.message });
    return sendError(res, error.message || "Unauthorized", error.status || 401);
  }
};
