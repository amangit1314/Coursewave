import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import EmailService from "../../core/services/emailService";
import TokenService from "../../core/services/tokenService";
import CSRFService from "../../core/services/csrfService";
import { generateResourceId } from "../../core/utils/idGenerator";
import { env } from "../../config/config";
import { prisma } from "../../config/prisma";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;

class AuthService {
  static async registerUser(
    email: string,
    password: string,
    // firstName?: string,
    // lastName?: string,
    role = "USER"
  ) {
    if (!email || !password)
      throw { status: 400, message: "Email and password are required" };

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw { status: 400, message: "User already exists" };

    const saltRounds = process.env.ENVIRONMENT === "DEVELOPMENT" ? 4 : 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user + role + fetch roles in transaction
    const userWithRoles = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: generateResourceId(`user`),
          email,
          password: hashedPassword,
          name: email.split("@")[0],
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (!role || !Object.values(Role).includes(role as Role)) {
        throw new Error("Invalid role provided");
      }

      await tx.userRole.create({
        data: {
          userId: user.id,
          role: role as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const userWithRoles = await tx.user.findUnique({
        where: { id: user.id },
        include: { roles: true },
      });

      return userWithRoles;
    });

    // Generate tokens immediately
    const accessToken = TokenService.generateAccessToken(userWithRoles!.id);
    const refreshToken = await TokenService.generateRefreshToken(
      userWithRoles!.id
    );

    // Send email verification in background without blocking or breaking registration
    process.nextTick(async () => {
      try {
        const emailSent = await EmailService.sendEmailVerification(
          userWithRoles!.id,
          userWithRoles!.email,
          userWithRoles!.name || ""
        );
        if (!emailSent) {
          console.warn(
            `Failed to send verification email to ${userWithRoles!.email}`
          );
        }
      } catch (err) {
        console.error("Background verification email task failed:", err);
      }
    });

    return {
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: {
        user: {
          id: userWithRoles!.id,
          email: userWithRoles!.email,
          name: userWithRoles!.name,
          isEmailVerified: userWithRoles!.isEmailVerified,
          roles: userWithRoles!.roles.map((ur) => ur.role),
        },
        accessToken,
        refreshToken,
      },
    };
  }

  static async loginUser(email: string, password: string) {
    if (!email || !password)
      throw { status: 400, message: "Email and password are required" };

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (!user) throw { status: 401, message: "Invalid credentials" };

    if (!user.password) {
      throw { status: 400, message: "This account uses Google or GitHub login. Please sign in with your provider." };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw { status: 401, message: "Invalid credentials" };

    const accessToken = TokenService.generateAccessToken(user.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id);

    return {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles.map((ur) => ur.role),
        },
        accessToken,
        refreshToken,
      },
    };
  }

  static async verifyEmail(token: string, csrfToken: string) {
    if (!token || !csrfToken)
      throw {
        status: 400,
        message: "Token and CSRF token are required",
      };

    // Find token record first
    const tokenRecord = await prisma.token.findFirst({
      where: {
        value: token,
        type: "VERIFY_EMAIL",
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord)
      throw { status: 400, message: "Invalid or expired verification token" };

    // Validate CSRF token based on userId found in the token
    const csrfValid = await CSRFService.validateCSRFToken(
      tokenRecord.userId,
      csrfToken,
      "EMAIL_VERIFICATION"
    );
    if (!csrfValid) throw { status: 400, message: "Invalid CSRF token" };

    // Mark email as verified
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { isEmailVerified: true, updatedAt: new Date() },
    });

    await TokenService.revokeToken(tokenRecord.id, "EMAIL_VERIFIED");

    return { success: true, message: "Email verified successfully" };
  }

  static async forgotPassword(email: string) {
    if (!email) throw { status: 400, message: "Email is required" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const emailSent = await EmailService.sendPasswordResetEmail(
        user.id,
        user.email,
        user.name || ""
      );
      if (!emailSent)
        throw { status: 500, message: "Failed to send password reset email" };
    }

    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  }

  static async resetPassword(
    token: string,
    csrfToken: string,
    newPassword: string
  ) {
    if (!token || !csrfToken || !newPassword)
      throw {
        status: 400,
        message: "Token, CSRF token and new password are required",
      };

    // Fetch token record — contains userId
    const tokenRecord = await prisma.token.findFirst({
      where: {
        value: token,
        type: "RESET_PASSWORD",
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord)
      throw { status: 400, message: "Invalid or expired reset token" };

    // CSRF validation with tokenRecord.userId
    const csrfValid = await CSRFService.validateCSRFToken(
      tokenRecord.userId,
      csrfToken,
      "PASSWORD_RESET"
    );
    if (!csrfValid) throw { status: 400, message: "Invalid CSRF token" };

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword, updatedAt: new Date() },
    });

    await TokenService.revokeAllUserTokens(
      tokenRecord.userId,
      "PASSWORD_RESET"
    );
    await TokenService.revokeToken(tokenRecord.id, "PASSWORD_RESET_COMPLETED");

    return { success: true, message: "Password reset successfully" };
  }

  static async resendVerification(email: string) {
    if (!email) throw { status: 400, message: "Email is required" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 404, message: "User not found" };
    if (user.isEmailVerified)
      throw { status: 400, message: "Email is already verified" };

    const emailSent = await EmailService.sendEmailVerification(
      user.id,
      user.email,
      user.name || ""
    );
    if (!emailSent)
      throw { status: 500, message: "Failed to send verification email" };

    return { success: true, message: "Verification email sent successfully" };
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw { status: 400, message: "Refresh token is required" };

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: string;
    };

    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId: decoded.userId,
        value: refreshToken,
        type: "REFRESH",
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) throw { status: 401, message: "Invalid refresh token" };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true },
    });
    if (!user) throw { status: 401, message: "User not found" };

    const newAccessToken = TokenService.generateAccessToken(user.id);
    const newRefreshToken = await TokenService.generateRefreshToken(user.id);

    await TokenService.revokeToken(tokenRecord.id, "TOKEN_ROTATION");

    return {
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  }

  static async logout(refreshToken: string) {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
      };

      const tokenRecord = await prisma.token.findFirst({
        where: {
          userId: decoded.userId,
          value: refreshToken,
          type: "REFRESH",
          status: "ACTIVE",
        },
      });

      if (tokenRecord) {
        await TokenService.revokeToken(tokenRecord.id, "LOGOUT");
      }
    }

    return { success: true, message: "Logged out successfully" };
  }

  static async getCurrentUser(token: string) {
    if (!token) throw { status: 401, message: "Access token required" };

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true },
    });
    if (!user) throw { status: 404, message: "User not found" };

    return {
      success: true,
      message: "User retrieved successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles.map((ur) => ur.role),
        },
      },
    };
  }
}

export default AuthService;
