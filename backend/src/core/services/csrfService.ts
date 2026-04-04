import crypto from 'crypto';
import { generateResourceId } from '../utils/idGenerator';
import { prisma } from '../../config/prisma';

// CSRF Configuration
const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,
  EXPIRY_TIME: 15 * 60 * 1000, // 15 minutes
  MAX_TOKENS_PER_USER: 5,
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
};

interface CSRFToken {
  id: string;
  userId: string;
  token: string;
  purpose: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION' | 'ACCOUNT_DELETION' | 'SENSITIVE_ACTION';
  expiresAt: Date;
  used: boolean;
  ipAddress?: string;
  userAgent?: string;
}

class CSRFService {
  /**
   * Generate a secure CSRF token
   */
  static generateCSRFToken(): string {
    return crypto.randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('hex');
  }

  /**
   * Create CSRF token for specific purpose
   */
  static async createCSRFToken(
    userId: string,
    purpose: CSRFToken['purpose'],
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    // Clean up old tokens for this user and purpose
    await this.cleanupOldTokens(userId, purpose);

    const token = this.generateCSRFToken();
    const tokenId = generateResourceId('csrf');

    await prisma.cSRFToken.create({
      data: {
        id: tokenId,
        userId,
        token,
        purpose,
        expiresAt: new Date(Date.now() + CSRF_CONFIG.EXPIRY_TIME),
        used: false,
        ipAddress,
        userAgent,
        updatedAt: new Date(),
      },
    });

    return token;
  }

  /**
   * Validate CSRF token
   */
  static async validateCSRFToken(
    userId: string,
    token: string,
    purpose: CSRFToken['purpose'],
    ipAddress?: string
  ): Promise<boolean> {
    const csrfToken = await prisma.cSRFToken.findFirst({
      where: {
        userId,
        token,
        purpose,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!csrfToken) {
      return false;
    }

    // Optional: Validate IP address if provided
    if (ipAddress && csrfToken.ipAddress && csrfToken.ipAddress !== ipAddress) {
      console.warn(`CSRF token IP mismatch for user ${userId}`);
      return false;
    }

    // Mark token as used
    await prisma.cSRFToken.update({
      where: { id: csrfToken.id },
      data: { 
        used: true,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  /**
   * Clean up old tokens for a user and purpose
   */
  private static async cleanupOldTokens(userId: string, purpose: CSRFToken['purpose']): Promise<void> {
    // Delete expired tokens
    await prisma.cSRFToken.deleteMany({
      where: {
        userId,
        purpose,
        expiresAt: { lt: new Date() },
      },
    });

    // Delete used tokens
    await prisma.cSRFToken.deleteMany({
      where: {
        userId,
        purpose,
        used: true,
      },
    });

    // If user has too many active tokens, delete oldest ones
    const activeTokens = await prisma.cSRFToken.count({
      where: {
        userId,
        purpose,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (activeTokens >= CSRF_CONFIG.MAX_TOKENS_PER_USER) {
      const oldestTokens = await prisma.cSRFToken.findMany({
        where: {
          userId,
          purpose,
          used: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'asc' },
        take: activeTokens - CSRF_CONFIG.MAX_TOKENS_PER_USER + 1,
      });

      for (const oldToken of oldestTokens) {
        await prisma.cSRFToken.delete({
          where: { id: oldToken.id },
        });
      }
    }
  }

  /**
   * Revoke all CSRF tokens for a user
   */
  static async revokeAllCSRFTokens(userId: string): Promise<void> {
    await prisma.cSRFToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get active CSRF tokens for a user
   */
  static async getUserCSRFTokens(userId: string): Promise<any[]> {
    return await prisma.cSRFToken.findMany({
      where: {
        userId,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Clean up all expired CSRF tokens
   */
  static async cleanupExpiredCSRFTokens(): Promise<number> {
    const result = await prisma.cSRFToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  /**
   * Validate token security (rate limiting, suspicious activity)
   */
  static async validateCSRFSecurity(userId: string, ipAddress?: string): Promise<boolean> {
    // Check for too many recent token creations
    const recentTokens = await prisma.cSRFToken.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
      },
    });

    if (recentTokens > 10) {
      console.warn(`Suspicious CSRF activity for user ${userId}`);
      return false;
    }

    return true;
  }
}

export default CSRFService; 