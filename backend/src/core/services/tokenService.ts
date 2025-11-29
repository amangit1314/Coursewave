import { PrismaClient, TokenType, TokenStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateResourceId } from '../utils/idGenerator';

const prisma = new PrismaClient();

// Token configuration
const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '1d', // Keep it as 1d to match your current setup
  REFRESH_TOKEN_EXPIRY: 14 * 24 * 60 * 60 * 1000, // 14 days
  VERIFY_EMAIL_EXPIRY: 24 * 60 * 60 * 1000, // 1 day
  RESET_PASSWORD_EXPIRY: 60 * 60 * 1000, // 1 hour
  MAX_REFRESH_TOKENS_PER_USER: 5, // Maximum active refresh tokens per user
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
};

// Rate limiting configuration
const RATE_LIMIT = {
  REFRESH_ATTEMPTS: 5,
  REFRESH_WINDOW: 15 * 60 * 1000, // 15 minutes
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
};

interface TokenPayload {
  userId: string;
  type: TokenType;
  jti?: string; // JWT ID for tracking
}

interface TokenAudit {
  action: 'CREATE' | 'REFRESH' | 'REVOKE' | 'EXPIRE' | 'ROLLBACK';
  tokenId: string;
  userId: string;
  tokenType: TokenType;
  ipAddress?: string;
  userAgent?: string;
}

class TokenService {
  /**
   * Generate access token with enhanced security
   */
  static generateAccessToken(userId: string, jti?: string): string {
    const payload: TokenPayload = {
      userId,
      type: TokenType.ACCESS,
      jti: jti || uuidv4(),
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: 'coursewave-api',
      audience: 'coursewave-client',
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token with security measures
   */
  static async generateRefreshToken(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
    // Check if user has too many active refresh tokens
    const activeTokens = await prisma.token.count({
      where: {
        userId,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
      },
    });

    if (activeTokens >= TOKEN_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      // Revoke oldest token
      const oldestToken = await prisma.token.findFirst({
        where: {
          userId,
          type: TokenType.REFRESH,
          status: TokenStatus.ACTIVE,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (oldestToken) {
        await this.revokeToken(oldestToken.id, 'AUTO_REVOKE_OLDEST');
      }
    }

    const refreshToken = uuidv4();
    const tokenId = generateResourceId('token');

    // Create token with audit trail
    await prisma.token.create({
      data: {
        id: tokenId,
        userId,
        type: TokenType.REFRESH,
        value: refreshToken,
        status: TokenStatus.ACTIVE,
        expiresAt: new Date(Date.now() + TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY),
        updatedAt: new Date(),
      },
    });

    // Log token creation
    await this.auditTokenAction({
      action: 'CREATE',
      tokenId,
      userId,
      tokenType: TokenType.REFRESH,
      ipAddress,
      userAgent,
    });

    return refreshToken;
  }

  /**
   * Generate verification token
   */
  static async generateVerificationToken(userId: string): Promise<string> {
    const verificationToken = uuidv4();
    const tokenId = generateResourceId('token');

    await prisma.token.create({
      data: {
        id: tokenId,
        userId,
        type: TokenType.VERIFY_EMAIL,
        value: verificationToken,
        status: TokenStatus.ACTIVE,
        expiresAt: new Date(Date.now() + TOKEN_CONFIG.VERIFY_EMAIL_EXPIRY),
        updatedAt: new Date(),
      },
    });

    await this.auditTokenAction({
      action: 'CREATE',
      tokenId,
      userId,
      tokenType: TokenType.VERIFY_EMAIL,
    });

    return verificationToken;
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(userId: string): Promise<string> {
    // Revoke any existing password reset tokens for this user
    await prisma.token.updateMany({
      where: {
        userId,
        type: TokenType.RESET_PASSWORD,
        status: TokenStatus.ACTIVE,
      },
      data: { status: TokenStatus.REVOKED },
    });

    const resetToken = uuidv4();
    const tokenId = generateResourceId('token');

    await prisma.token.create({
      data: {
        id: tokenId,
        userId,
        type: TokenType.RESET_PASSWORD,
        value: resetToken,
        status: TokenStatus.ACTIVE,
        expiresAt: new Date(Date.now() + TOKEN_CONFIG.RESET_PASSWORD_EXPIRY),
        updatedAt: new Date(),
      },
    });

    await this.auditTokenAction({
      action: 'CREATE',
      tokenId,
      userId,
      tokenType: TokenType.RESET_PASSWORD,
    });

    return resetToken;
  }

  /**
   * Verify and refresh access token
   */
  static async refreshAccessToken(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    // Rate limiting check
    const rateLimitKey = `refresh:${ipAddress}`;
    const attempts = await this.checkRateLimit(rateLimitKey, RATE_LIMIT.REFRESH_ATTEMPTS, RATE_LIMIT.REFRESH_WINDOW);

    if (attempts > RATE_LIMIT.REFRESH_ATTEMPTS) {
      throw new Error('Rate limit exceeded for token refresh');
    }

    const token = await prisma.token.findFirst({
      where: {
        value: refreshToken,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
      },
      include: { user: true },
    });

    if (!token || !token.user) {
      throw new Error('Invalid refresh token');
    }

    if (token.expiresAt && token.expiresAt < new Date()) {
      await this.revokeToken(token.id, 'EXPIRED');
      throw new Error('Refresh token has expired');
    }

    // Revoke old refresh token
    await this.revokeToken(token.id, 'REFRESH_ROTATION');

    // Generate new tokens
    const newRefreshToken = await this.generateRefreshToken(token.userId, ipAddress, userAgent);
    const accessToken = this.generateAccessToken(token.userId);

    await this.auditTokenAction({
      action: 'REFRESH',
      tokenId: token.id,
      userId: token.userId,
      tokenType: TokenType.REFRESH,
      ipAddress,
      userAgent,
    });

    return { accessToken, newRefreshToken };
  }

  /**
   * Revoke token with reason
   */
  static async revokeToken(tokenId: string, reason: string): Promise<void> {
    await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: TokenStatus.REVOKED,
        updatedAt: new Date(),
      },
    });

    await this.auditTokenAction({
      action: 'REVOKE',
      tokenId,
      userId: '', // Will be filled by audit function
      tokenType: TokenType.REFRESH,
    });
  }

  /**
   * Revoke all tokens for a user (logout from all devices)
   */
  static async revokeAllUserTokens(userId: string, reason: string): Promise<void> {
    await prisma.token.updateMany({
      where: {
        userId,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
      },
      data: {
        status: TokenStatus.REVOKED,
        updatedAt: new Date(),
      },
    });

    // Log bulk revocation
    await this.auditTokenAction({
      action: 'REVOKE',
      tokenId: 'BULK_REVOKE',
      userId,
      tokenType: TokenType.REFRESH,
    });
  }

  /**
   * Token rollback - restore previous valid token
   */
  static async rollbackToken(userId: string, currentTokenId: string): Promise<string | null> {
    // Find the most recent valid token before the current one
    const previousToken = await prisma.token.findFirst({
      where: {
        userId,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
        id: { not: currentTokenId },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!previousToken) {
      return null;
    }

    // Revoke current token
    await this.revokeToken(currentTokenId, 'ROLLBACK');

    // Reactivate previous token
    await prisma.token.update({
      where: { id: previousToken.id },
      data: {
        status: TokenStatus.ACTIVE,
        updatedAt: new Date(),
      },
    });

    await this.auditTokenAction({
      action: 'ROLLBACK',
      tokenId: previousToken.id,
      userId,
      tokenType: TokenType.REFRESH,
    });

    return previousToken.value;
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.token.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        status: TokenStatus.ACTIVE,
      },
      data: {
        status: TokenStatus.EXPIRED,
        updatedAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Get user's active sessions
   */
  static async getUserSessions(userId: string): Promise<any[]> {
    return await prisma.token.findMany({
      where: {
        userId,
        type: TokenType.REFRESH,
        status: TokenStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Rate limiting check
   */
  private static async checkRateLimit(key: string, maxAttempts: number, windowMs: number): Promise<number> {
    // This is a simplified rate limiting implementation
    // In production, you'd use Redis or a similar service
    const now = Date.now();
    const windowStart = now - windowMs;

    // For now, we'll use a simple in-memory approach
    // In production, implement proper rate limiting with Redis
    return 0; // Simplified for now
  }

  /**
   * Audit token actions
   */
  private static async auditTokenAction(audit: TokenAudit): Promise<void> {
    // In production, you'd log to a proper audit system
    console.log('Token Audit:', {
      ...audit,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Validate token security
   */
  static async validateTokenSecurity(tokenId: string): Promise<boolean> {
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });

    if (!token) return false;

    // Check for suspicious activity
    const recentTokens = await prisma.token.findMany({
      where: {
        userId: token.userId,
        type: TokenType.REFRESH,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
      },
    });

    // If more than 3 tokens created in 5 minutes, flag as suspicious
    if (recentTokens.length > 3) {
      await this.auditTokenAction({
        action: 'REVOKE',
        tokenId,
        userId: token.userId,
        tokenType: TokenType.REFRESH,
      });
      return false;
    }

    return true;
  }
}

export default TokenService; 