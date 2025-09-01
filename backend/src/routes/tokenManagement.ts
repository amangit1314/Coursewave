import express, { Request, Response } from "express";
import { TokenType, TokenStatus } from "@prisma/client";
import { verifyToken } from "../api/auth/auth.middleware";
import TokenService from "../core/services/tokenService";
import { prisma } from "../config/prisma";

const router = express.Router();

// Get user's active sessions
router.get("/sessions", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const sessions = await TokenService.getUserSessions(userId);

    return res.status(200).json({
      success: true,
      data: sessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
        deviceInfo: session.deviceInfo || "Unknown",
      })),
    });
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
});

// Revoke specific session
router.delete(
  "/sessions/:sessionId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const sessionId = req.params.sessionId;

      // Verify the session belongs to the user
      const session = await prisma.token.findFirst({
        where: {
          id: sessionId,
          userId,
          type: TokenType.REFRESH,
        },
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      await TokenService.revokeToken(sessionId, "USER_REVOKE");

      return res.status(200).json({
        success: true,
        message: "Session revoked successfully",
      });
    } catch (error: any) {
      console.error("Error revoking session:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to revoke session",
        error: error.message,
      });
    }
  }
);

// Revoke all sessions (logout from all devices)
router.delete("/sessions", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    await TokenService.revokeAllUserTokens(userId, "LOGOUT_ALL_DEVICES");

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error: any) {
    console.error("Error revoking all sessions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout from all devices",
      error: error.message,
    });
  }
});

// Token rollback endpoint
router.post("/rollback", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentTokenId } = req.body;

    if (!currentTokenId) {
      return res.status(400).json({
        success: false,
        message: "Current token ID is required",
      });
    }

    const rollbackToken = await TokenService.rollbackToken(
      userId,
      currentTokenId
    );

    if (!rollbackToken) {
      return res.status(404).json({
        success: false,
        message: "No previous valid token found for rollback",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        rollbackToken,
        message: "Token rolled back successfully",
      },
    });
  } catch (error: any) {
    console.error("Error rolling back token:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rollback token",
      error: error.message,
    });
  }
});

// Enhanced refresh token endpoint with security
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await TokenService.refreshAccessToken(
      refreshToken,
      ipAddress,
      userAgent
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Token refresh error:", error);
    return res.status(401).json({
      success: false,
      message: error.message || "Failed to refresh token",
    });
  }
});

// Security validation endpoint
router.post(
  "/validate-security",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.body;

      if (!tokenId) {
        return res.status(400).json({
          success: false,
          message: "Token ID is required",
        });
      }

      const isValid = await TokenService.validateTokenSecurity(tokenId);

      return res.status(200).json({
        success: true,
        data: {
          isValid,
          message: isValid
            ? "Token security validation passed"
            : "Token security validation failed",
        },
      });
    } catch (error: any) {
      console.error("Security validation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to validate token security",
        error: error.message,
      });
    }
  }
);

// Cleanup expired tokens (admin endpoint)
router.post("/cleanup", verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user.id },
    });

    const isAdmin = userRoles.some((role) => role.role === "ADMIN");

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const cleanedCount = await TokenService.cleanupExpiredTokens();

    return res.status(200).json({
      success: true,
      data: {
        cleanedCount,
        message: `Cleaned up ${cleanedCount} expired tokens`,
      },
    });
  } catch (error: any) {
    console.error("Token cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cleanup expired tokens",
      error: error.message,
    });
  }
});

// Get token statistics (admin endpoint)
router.get("/stats", verifyToken, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user.id },
    });

    const isAdmin = userRoles.some((role) => role.role === "ADMIN");

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const stats = await prisma.token.groupBy({
      by: ["type", "status"],
      _count: {
        id: true,
      },
    });

    const totalTokens = await prisma.token.count();
    const activeTokens = await prisma.token.count({
      where: { status: TokenStatus.ACTIVE },
    });
    const expiredTokens = await prisma.token.count({
      where: { status: TokenStatus.EXPIRED },
    });
    const revokedTokens = await prisma.token.count({
      where: { status: TokenStatus.REVOKED },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalTokens,
        activeTokens,
        expiredTokens,
        revokedTokens,
        breakdown: stats,
      },
    });
  } catch (error: any) {
    console.error("Token stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get token statistics",
      error: error.message,
    });
  }
});

export default router;
