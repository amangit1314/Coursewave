import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
import TokenService from "../../core/services/tokenService";
import { generateResourceId } from "../../core/utils/idGenerator";

interface OAuthProfile {
  provider: "google" | "github";
  providerAccountId: string;
  email: string;
  name?: string;
  image?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

class OAuthService {
  /**
   * Handle OAuth login/register.
   * If user exists with this email → link account and login.
   * If new user → create account with OAuth and login.
   */
  static async handleOAuthLogin(profile: OAuthProfile) {
    const { provider, providerAccountId, email, name, image, accessToken, refreshToken, expiresAt } = profile;

    if (!email) {
      throw { status: 400, message: "Email is required from OAuth provider" };
    }

    // Check if this OAuth account already exists
    const existingOAuth = await prisma.oAuthAccount.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: {
        user: {
          include: { roles: true },
        },
      },
    });

    if (existingOAuth) {
      // User already linked — update tokens and login
      await prisma.oAuthAccount.update({
        where: { id: existingOAuth.id },
        data: { accessToken, refreshToken, expiresAt },
      });

      const user = existingOAuth.user;
      const tokens = await this.generateTokens(user.id);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            roles: user.roles.map((r) => r.role),
          },
          ...tokens,
        },
        message: "Login successful",
        status: 200,
      };
    }

    // Check if user exists with this email (registered via email/password)
    let user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (user) {
      // Link OAuth to existing user
      await prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider,
          providerAccountId,
          accessToken,
          refreshToken,
          expiresAt,
        },
      });

      // Update profile image if missing
      if (!user.profileImageUrl && image) {
        await prisma.user.update({
          where: { id: user.id },
          data: { profileImageUrl: image },
        });
      }
    } else {
      // Create new user via OAuth (no password needed)
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            id: generateResourceId("user"),
            email,
            name: name || email.split("@")[0],
            profileImageUrl: image,
            isEmailVerified: true, // OAuth emails are verified by the provider
          },
        });

        await tx.userRole.create({
          data: {
            userId: newUser.id,
            role: Role.USER,
          },
        });

        await tx.oAuthAccount.create({
          data: {
            userId: newUser.id,
            provider,
            providerAccountId,
            accessToken,
            refreshToken,
            expiresAt,
          },
        });

        return tx.user.findUnique({
          where: { id: newUser.id },
          include: { roles: true },
        });
      });

      if (!user) throw { status: 500, message: "Failed to create user" };
    }

    const tokens = await this.generateTokens(user.id);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          roles: user.roles.map((r) => r.role),
        },
        ...tokens,
      },
      message: user ? "Login successful" : "Account created successfully",
      status: 200,
    };
  }

  private static async generateTokens(userId: string) {
    const accessToken = TokenService.generateAccessToken(userId);
    const refreshToken = await TokenService.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }
}

export default OAuthService;
