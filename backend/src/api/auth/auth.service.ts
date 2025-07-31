// src/modules/auth/services/auth.service.ts

import EmailService from "../../core/services/emailService";
import TokenService from "../../core/services/tokenService";
import { generateRefreshToken, generateToken, verifyToken } from "../../core/utils/jwt";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import createHttpError from "http-errors";

const prisma = new PrismaClient();

export class AuthService {
  async register(userData: { name: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw createHttpError(409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    // await sendVerificationEmail(user.email, token);
    await EmailService.sendWelcomeEmail(user.id, user.email, user.name || "");

    const accessToken = TokenService.generateAccessToken(user.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id);

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw createHttpError(401, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, "Invalid credentials");

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async verifyEmail(token: string) {
    const decoded = verifyToken(token);
    const user = await prisma.user.update({
      where: { id: decoded?.id },
      data: { isEmailVerified: true },
    });
    return user;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw createHttpError(404, "User not found");
    const token = generateToken(user.id);
    // await sendResetPasswordEmail(user.email, token);
    const emailSent = await EmailService.sendPasswordResetEmail(
      user.id,
      user.email,
      user.name || ""
    );

    if (!emailSent) {
      return false;
    }
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = verifyToken(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: decoded?.id || "" },
      data: { password: hashedPassword },
    });
    return true;
  }
}
