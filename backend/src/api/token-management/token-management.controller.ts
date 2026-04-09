import { Request, Response } from "express";
import { TokenType, TokenStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import TokenService from "../../core/services/tokenService";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

const requireAdmin = (req: Request) => {
  const userId = requireUserId(req);
  if (!req.user?.roles?.includes("ADMIN")) {
    throw new AppError("Admin access required", 403);
  }
  return userId;
};

// Get user's active sessions
export const getUserSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const sessions = await TokenService.getUserSessions(userId);

    sendSuccess(
      res,
      sessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
        deviceInfo: session.deviceInfo || "Unknown",
      }))
    );
  }
);

// Revoke specific session
export const revokeSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const sessionId = req.params.sessionId;

    const session = await prisma.token.findFirst({
      where: { id: sessionId, userId, type: TokenType.REFRESH },
    });

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    await TokenService.revokeToken(sessionId, "USER_REVOKE");

    sendSuccess(res, null, "Session revoked successfully");
  }
);

// Revoke all sessions
export const revokeAllSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    await TokenService.revokeAllUserTokens(userId, "LOGOUT_ALL_DEVICES");
    sendSuccess(res, null, "Logged out from all devices successfully");
  }
);

// Rollback token
export const rollbackToken = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const { currentTokenId } = req.body;

    if (!currentTokenId) {
      throw new AppError("Current token ID is required", 400);
    }

    const rolledBack = await TokenService.rollbackToken(userId, currentTokenId);

    if (!rolledBack) {
      throw new AppError("No previous valid token found for rollback", 404);
    }

    sendSuccess(res, { rollbackToken: rolledBack }, "Token rolled back successfully");
  }
);

// Refresh token — note: failure here is 401 (unauthenticated), not 500
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    try {
      const result = await TokenService.refreshAccessToken(
        refreshToken,
        ipAddress,
        userAgent
      );
      sendSuccess(res, result);
    } catch (error: any) {
      // Token service throws plain errors — translate to 401 for auth failures
      throw new AppError(error.message || "Failed to refresh token", 401);
    }
  }
);

// Validate token security
export const validateSecurity = asyncHandler(
  async (req: Request, res: Response) => {
    const { tokenId } = req.body;

    if (!tokenId) {
      throw new AppError("Token ID is required", 400);
    }

    const isValid = await TokenService.validateTokenSecurity(tokenId);

    sendSuccess(res, {
      isValid,
      message: isValid
        ? "Token security validation passed"
        : "Token security validation failed",
    });
  }
);

// Cleanup expired tokens (admin)
export const cleanupExpiredTokens = asyncHandler(
  async (req: Request, res: Response) => {
    requireAdmin(req);

    const cleanedCount = await TokenService.cleanupExpiredTokens();

    sendSuccess(res, {
      cleanedCount,
      message: `Cleaned up ${cleanedCount} expired tokens`,
    });
  }
);

// Get token statistics (admin)
export const getTokenStats = asyncHandler(
  async (req: Request, res: Response) => {
    requireAdmin(req);

    const [stats, totalTokens, activeTokens, expiredTokens, revokedTokens] =
      await Promise.all([
        prisma.token.groupBy({
          by: ["type", "status"],
          _count: { id: true },
        }),
        prisma.token.count(),
        prisma.token.count({ where: { status: TokenStatus.ACTIVE } }),
        prisma.token.count({ where: { status: TokenStatus.EXPIRED } }),
        prisma.token.count({ where: { status: TokenStatus.REVOKED } }),
      ]);

    sendSuccess(res, {
      totalTokens,
      activeTokens,
      expiredTokens,
      revokedTokens,
      breakdown: stats,
    });
  }
);
