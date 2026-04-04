import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import TokenService from "../../core/services/tokenService";
import EmailService from "../../core/services/emailService";
import CSRFService from "../../core/services/csrfService";

import { env } from "../../config/config";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;

/* ================== REGISTER ================== */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role = "USER", csrfToken } =
      req.body;

    if (!csrfToken) {
      return res.status(400).json({ success: false, message: "CSRF token is required" });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: firstName ?? email.split("@")[0],
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.userRole.create({
      data: { userId: user.id, role, createdAt: new Date(), updatedAt: new Date() },
    });

    await EmailService.sendWelcomeEmail(user.id, user.email, user.name || "");

    const accessToken = TokenService.generateAccessToken(user.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id);

    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: true },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        user: {
          id: userWithRoles!.id,
          email: userWithRoles!.email,
          name: userWithRoles!.name,
          isEmailVerified: userWithRoles!.isEmailVerified,
          roles: userWithRoles!.roles.map((r) => r.role),
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Secure register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== LOGIN ================== */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, csrfToken } = req.body;

    if (!csrfToken) {
      return res.status(400).json({ success: false, message: "CSRF token is required" });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } });
    if (!user || !user.password) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const accessToken = TokenService.generateAccessToken(user.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles.map((r) => r.role),
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Secure login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== FORGOT PASSWORD ================== */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, csrfToken } = req.body;

    if (!csrfToken) return res.status(400).json({ success: false, message: "CSRF token required" });
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: "If account exists, reset link sent" });
    }

    const emailSent = await EmailService.sendPasswordResetEmail(user.id, user.email, user.name || "");
    if (!emailSent) return res.status(500).json({ success: false, message: "Failed to send email" });

    res.json({ success: true, message: "If account exists, reset link sent" });
  } catch (error: any) {
    console.error("Secure forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== RESET PASSWORD ================== */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, csrfToken, newPassword, userId } = req.body;
    if (!token || !csrfToken || !newPassword || !userId)
      return res.status(400).json({ success: false, message: "All fields required" });

    const csrfValid = await CSRFService.validateCSRFToken(userId, csrfToken, "PASSWORD_RESET");
    if (!csrfValid) return res.status(400).json({ success: false, message: "Invalid CSRF token" });

    const tokenRecord = await prisma.token.findFirst({
      where: { userId, value: token, type: "RESET_PASSWORD", status: "ACTIVE", expiresAt: { gt: new Date() } },
    });
    if (!tokenRecord) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword, updatedAt: new Date() } });

    await TokenService.revokeAllUserTokens(userId, "PASSWORD_RESET");
    await TokenService.revokeToken(tokenRecord.id, "PASSWORD_RESET_COMPLETED");

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    console.error("Secure reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== EMAIL VERIFICATION ================== */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, csrfToken, userId } = req.body;
    if (!token || !csrfToken || !userId)
      return res.status(400).json({ success: false, message: "All fields required" });

    const csrfValid = await CSRFService.validateCSRFToken(userId, csrfToken, "EMAIL_VERIFICATION");
    if (!csrfValid) return res.status(400).json({ success: false, message: "Invalid CSRF token" });

    const tokenRecord = await prisma.token.findFirst({
      where: { userId, value: token, type: "VERIFY_EMAIL", status: "ACTIVE", expiresAt: { gt: new Date() } },
    });
    if (!tokenRecord) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    await prisma.user.update({ where: { id: userId }, data: { isEmailVerified: true, updatedAt: new Date() } });
    await TokenService.revokeToken(tokenRecord.id, "EMAIL_VERIFIED");

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Secure email verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== RESEND VERIFICATION ================== */
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email, csrfToken } = req.body;
    if (!csrfToken) return res.status(400).json({ success: false, message: "CSRF token required" });
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    const emailSent = await EmailService.sendEmailVerification(user.id, user.email, user.name || "");
    if (!emailSent) return res.status(500).json({ success: false, message: "Failed to send verification email" });

    res.json({ success: true, message: "Verification email sent successfully" });
  } catch (error: any) {
    console.error("Secure resend verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== REFRESH TOKEN ================== */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken, csrfToken } = req.body;
    if (!refreshToken || !csrfToken) return res.status(400).json({ success: false, message: "Token & CSRF required" });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

    const tokenRecord = await prisma.token.findFirst({
      where: { userId: decoded.userId, value: refreshToken, type: "REFRESH", status: "ACTIVE", expiresAt: { gt: new Date() } },
    });
    if (!tokenRecord) return res.status(401).json({ success: false, message: "Invalid refresh token" });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { roles: true } });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const newAccessToken = TokenService.generateAccessToken(user.id);
    const newRefreshToken = await TokenService.generateRefreshToken(user.id);
    await TokenService.revokeToken(tokenRecord.id, "TOKEN_ROTATION");

    res.json({ success: true, message: "Token refreshed successfully", data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (error: any) {
    console.error("Secure refresh token error:", error);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

/* ================== LOGOUT ================== */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken, csrfToken } = req.body;
    if (!csrfToken) return res.status(400).json({ success: false, message: "CSRF token required" });

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      const tokenRecord = await prisma.token.findFirst({ where: { userId: decoded.userId, value: refreshToken, type: "REFRESH", status: "ACTIVE" } });
      if (tokenRecord) await TokenService.revokeToken(tokenRecord.id, "LOGOUT");
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Secure logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ================== GET CURRENT USER ================== */
export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Access token required" });

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { roles: true } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: { user: { id: user.id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified, roles: user.roles.map((r) => r.role) } },
    });
  } catch (error: any) {
    console.error("Secure get user error:", error);
    res.status(401).json({ success: false, message: "Invalid access token" });
  }
};
