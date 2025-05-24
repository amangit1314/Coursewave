import express, { Request, Response } from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
// import { redisClient } from "../config/redis";
import { generateResourceId } from "../utils/idGenerator";
import { User } from "../types";
import multer from "multer";

const upload = multer(); // this stores files in memory
const router: Router = express.Router();
const prisma = new PrismaClient();

// Constants for token expiration
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Token types and statuses
const TokenType = {
  REFRESH: "REFRESH",
  ACCESS: "ACCESS",
  VERIFY: "VERIFY",
  RESET: "RESET",
} as const;

const TokenStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  USED: "USED",
  REVOKED: "REVOKED",
} as const;

// Helper function to generate tokens
const generateTokens = async (userId: string) => {
  // Generate access token
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  // Generate refresh token
  const refreshToken = uuidv4();

  // Generate verification token
  const verificationToken = uuidv4();

  // Store refresh token in database
  await prisma.token.create({
    data: {
      userId,
      type: TokenType.REFRESH,
      value: refreshToken,
      status: TokenStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Store verification token in database (should i)?
  await prisma.token.create({
    data: {
      userId,
      type: TokenType.VERIFY,
      value: verificationToken,
      status: TokenStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    },
  });

  return { accessToken, refreshToken, verificationToken };
};

// Register user
router.post("/register", upload.none(), async (req: Request, res: Response) => {
  // console.log("register hit before try catch")
  try {
    const { name, email, password } = req.body;

    console.log("🎯 Register endpoint hit");

    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = generateResourceId("user");

    // Create user
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create default user role
    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: "USER",
      },
    });

    // Generate tokens
    const { accessToken, refreshToken, verificationToken } =
      await generateTokens(user.id);

    console.log("Successfully register");

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          // include user role
          roles: (user as User).roles?.map((role) => role.role) || [],
        },
        accessToken,
        refreshToken,
        verificationToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);

    // Store user session in Redis
    // await redisClient.setEx(
    //   `session:${user.id}`,
    //   15 * 60, // 15 minutes
    //   JSON.stringify({
    //     userId: user.id,
    //     email: user.email,
    //     roles: (user as User).roles?.map((role) => role.role) || [],
    //   })
    // );

    // get user role
    const roles = await prisma.userRole.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          about: user.about,
          shortSummary: user.shortSummary,
          isEmailVerified: user.isEmailVerified,
          roles: roles.map((role) => role.role),
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Refresh token
router.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Find refresh token in database
    const token = await prisma.token.findFirst({
      where: {
        value: refreshToken,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });

    if (!token || !token.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if token is expired
    if (token.expiresAt && token.expiresAt < new Date()) {
      // Update token status to expired
      await prisma.token.update({
        where: { id: token.id },
        data: { status: TokenStatus.EXPIRED },
      });

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: token.user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Update user session in Redis
    // await redisClient.setEx(
    //   `session:${token.user.id}`,
    //   15 * 60, // 15 minutes
    //   JSON.stringify({
    //     userId: token.user.id,
    //     email: token.user.email,
    //     roles: (token.user as User).roles?.map((role) => role.role) || [],
    //   })
    // );

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Token refresh error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Verify email
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Find token in database
    const verificationToken = await prisma.token.findFirst({
      where: {
        value: token,
        type: TokenType.VERIFY,
        status: TokenStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken || !verificationToken.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    // Check if token is expired
    if (
      verificationToken.expiresAt &&
      verificationToken.expiresAt < new Date()
    ) {
      // Update token status to expired
      await prisma.token.update({
        where: { id: verificationToken.id },
        data: { status: TokenStatus.EXPIRED },
      });

      return res.status(401).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    // Update user email verification status
    await prisma.user.update({
      where: { id: verificationToken.user.id },
      data: { isEmailVerified: true },
    });

    // Invalidate the verification token
    await prisma.token.update({
      where: { id: verificationToken.id },
      data: { status: TokenStatus.USED },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Request password reset
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate password reset token
    const resetToken = uuidv4();

    // Store token in database
    await prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.RESET,
        value: resetToken,
        status: TokenStatus.ACTIVE,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    // Send password reset email (pseudo code)
    // await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to request password reset",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// forget password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Find token in database
    const resetToken = await prisma.token.findFirst({
      where: {
        value: token,
        type: TokenType.RESET,
        status: TokenStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });

    if (!resetToken || !resetToken.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // Check if token is expired
    if (resetToken.expiresAt && resetToken.expiresAt < new Date()) {
      // Update token status to expired
      await prisma.token.update({
        where: { id: resetToken.id },
        data: { status: TokenStatus.EXPIRED },
      });

      return res.status(401).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: { password: hashedPassword },
    });

    // Invalidate the reset token
    await prisma.token.update({
      where: { id: resetToken.id },
      data: { status: TokenStatus.USED },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Logout user
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Invalidate refresh token
      await prisma.token.updateMany({
        where: {
          value: refreshToken,
          type: TokenType.REFRESH,
          status: TokenStatus.ACTIVE,
        },
        data: { status: TokenStatus.REVOKED },
      });
    }

    // Clear user session from Redis
    const userId = req.user?.id;
    // if (userId) {
    //   await redisClient.del(`session:${userId}`);
    // }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get current user
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        about: user.about,
        shortSummary: user.shortSummary,
        isEmailVerified: user.isEmailVerified,
        roles: (user as User).roles?.map((role) => role.role) || [],
      },
    });
  } catch (error: any) {
    console.log("ERROR in getting current user: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 0 auth for sso, google, apple, github
router.get("/sso/:provider", async (req: Request, res: Response) => {
  const { provider } = req.params;
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/${provider}`;
  // Redirect to the provider's authentication page
  res.redirect(
    `https://example.com/auth/${provider}?redirect_uri=${encodeURIComponent(
      redirectUrl
    )}`
  );
});

// 1 auth for sso, google, apple, github
router.get("/sso/:provider/callback", async (req: Request, res: Response) => {
  const { provider } = req.params;
  const { code } = req.query;

  // Exchange the authorization code for an access token
  const accessToken = await exchangeCodeForAccessToken(
    provider,
    code as string
  );

  // Use the access token to fetch user information from the provider
  const userInfo = await fetchUserInfo(provider, accessToken);

  // Check if the user exists in your database
  let user = await prisma.user.findUnique({
    where: { email: userInfo.email },
  });

  if (!user) {
    // If the user doesn't exist, create a new user in your database
    user = await prisma.user.create({
      data: {
        id: generateResourceId("user"), // Generate a unique user ID
        name: userInfo.name,
        email: userInfo.email,
        profileImageUrl: userInfo.profileImageUrl,
        password: await bcrypt.hash(uuidv4(), 10), // Generate a hashed random password
      },
    });
  }

  // Generate tokens and respond with them
  const { accessToken: jwtAccessToken, refreshToken } = await generateTokens(
    user.id
  );

  res.status(200).json({
    success: true,
    data: {
      user,
      accessToken: jwtAccessToken,
      refreshToken,
    },
  });
});

// Helper function to exchange authorization code for access token
async function exchangeCodeForAccessToken(provider: string, code: string) {
  // Implement the logic to exchange the authorization code for an access token
  // This will vary depending on the provider (Google, Apple, GitHub, etc.)
  // For example, you might make a POST request to the provider's token endpoint
  return "access_token"; // Replace with actual access token
}

async function fetchUserInfo(provider: string, accessToken: string) {
  switch (provider) {
    case "google":
      // Fetch user info from Google
      const googleResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!googleResponse.ok) {
        throw new Error("Failed to fetch user info from Google");
      }
      return await googleResponse.json();

    case "github":
      // Fetch user info from GitHub
      const githubResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!githubResponse.ok) {
        throw new Error("Failed to fetch user info from GitHub");
      }
      const githubData = await githubResponse.json();
      return {
        name: githubData.name,
        email: githubData.email,
        profileImageUrl: githubData.avatar_url,
      };

    case "apple":
      // Fetch user info from Apple (pseudo-code, as Apple requires JWT decoding)
      // You would typically decode the ID token provided by Apple to extract user info
      throw new Error("Fetching user info from Apple is not implemented");

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export default router;
