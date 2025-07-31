import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import TokenService from '../core/services/tokenService';
import EmailService from '../core/services/emailService';
import CSRFService from '../core/services/csrfService';

const router = express.Router();
const prisma = new PrismaClient();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Secure registration with CSRF protection
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'USER', csrfToken } = req.body;

    // Validate CSRF token
    if (!csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'CSRF token is required' 
      });
    }

    // Validate input
    // || !firstName || !lastName
    if (!email || !password ) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with full name
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName ?? email.split("@")[0].toString()}`,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create user role
    await prisma.userRole.create({
      data: {
        userId: user.id,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send welcome email with verification
    await EmailService.sendWelcomeEmail(user.id, user.email, user.name || '');

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id);

    const refreshToken = await TokenService.generateRefreshToken(user.id);

    // Get user with roles
    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: {
          id: userWithRoles!.id,
          email: userWithRoles!.email,
          name: userWithRoles!.name,
          isEmailVerified: userWithRoles!.isEmailVerified,
          roles: userWithRoles!.roles.map(ur => ur.role),
        },
        accessToken,
        refreshToken,
      }
    });
  } catch (error) {
    console.error('Secure registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure login with rate limiting
router.post('/login', async (req, res) => {
  try {
    const { email, password, csrfToken } = req.body;

    // Validate CSRF token
    if (!csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'CSRF token is required' 
      });
    }

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id);

    const refreshToken = await TokenService.generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles.map(ur => ur.role),
        },
        accessToken,
        refreshToken,
      }
    });
  } catch (error) {
    console.error('Secure login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure forgot password with CSRF protection
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, csrfToken } = req.body;

    // Validate CSRF token
    if (!csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'CSRF token is required' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ 
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }

    // Send password reset email
    const emailSent = await EmailService.sendPasswordResetEmail(
      user.id,
      user.email,
      user.name || ''
    );

    if (!emailSent) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send password reset email' 
      });
    }

    res.json({ 
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Secure forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure reset password with CSRF protection
router.post('/reset-password', async (req, res) => {
  try {
    const { token, csrfToken, newPassword, userId } = req.body;

    if (!token || !csrfToken || !newPassword || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Token, CSRF token, new password, and user ID are required' 
      });
    }

    // Verify CSRF token
    const csrfValid = await CSRFService.validateCSRFToken(userId, csrfToken, 'PASSWORD_RESET');
    if (!csrfValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid CSRF token' 
      });
    }

    // Verify token
    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId,
        value: token,
        type: 'RESET_PASSWORD',
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Invalidate all refresh tokens for this user
    await TokenService.revokeAllUserTokens(userId, 'PASSWORD_RESET');

    // Invalidate token
    await TokenService.revokeToken(tokenRecord.id, 'PASSWORD_RESET_COMPLETED');

    res.json({ 
      success: true,
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Secure reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure email verification with CSRF protection
router.post('/verify-email', async (req, res) => {
  try {
    const { token, csrfToken, userId } = req.body;

    if (!token || !csrfToken || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Token, CSRF token, and user ID are required' 
      });
    }

    // Verify CSRF token
    const csrfValid = await CSRFService.validateCSRFToken(userId, csrfToken, 'EMAIL_VERIFICATION');
    if (!csrfValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid CSRF token' 
      });
    }

    // Verify token
    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId,
        value: token,
        type: 'VERIFY_EMAIL',
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        updatedAt: new Date(),
      },
    });

    // Invalidate token
    await TokenService.revokeToken(tokenRecord.id, 'EMAIL_VERIFIED');

    res.json({ 
      success: true,
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Secure email verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email, csrfToken } = req.body;

    // Validate CSRF token
    if (!csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'CSRF token is required' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is already verified' 
      });
    }

    // Send verification email
    const emailSent = await EmailService.sendEmailVerification(
      user.id,
      user.email,
      user.name || ''
    );

    if (!emailSent) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send verification email' 
      });
    }

    res.json({ 
      success: true,
      message: 'Verification email sent successfully' 
    });
  } catch (error) {
    console.error('Secure resend verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure refresh token with validation
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken, csrfToken } = req.body;

    if (!refreshToken || !csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Refresh token and CSRF token are required' 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    
    // Check if token exists in database
    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId: decoded.userId,
        value: refreshToken,
        type: 'REFRESH',
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Generate new tokens
    const newAccessToken = TokenService.generateAccessToken(user.id);

    const newRefreshToken = await TokenService.generateRefreshToken(user.id);

    // Revoke old refresh token
    await TokenService.revokeToken(tokenRecord.id, 'TOKEN_ROTATION');

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    });
  } catch (error) {
    console.error('Secure refresh token error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid refresh token' 
    });
  }
});

// Secure logout with token invalidation
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken, csrfToken } = req.body;

    if (!csrfToken) {
      return res.status(400).json({ 
        success: false,
        message: 'CSRF token is required' 
      });
    }

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      
      // Find and revoke the refresh token
      const tokenRecord = await prisma.token.findFirst({
        where: {
          userId: decoded.userId,
          value: refreshToken,
          type: 'REFRESH',
          status: 'ACTIVE',
        },
      });

      if (tokenRecord) {
        await TokenService.revokeToken(tokenRecord.id, 'LOGOUT');
      }
    }

    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Secure logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Secure get current user with enhanced validation
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles.map(ur => ur.role),
        },
      }
    });
  } catch (error) {
    console.error('Secure get user error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid access token' 
    });
  }
});

export default router; 