import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    { expiresIn: '30d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret') as { id: string };
  } catch (error) {
    return null;
  }
};

// Create or update token in database
export const createOrUpdateToken = async (
  userId: string,
  type: 'VERIFY' | 'REFRESH' | 'ACCESS' | 'RESET',
  value: string,
  expiresAt?: Date
) => {
  // Delete any existing tokens of the same type for this user
  await prisma.token.deleteMany({
    where: {
      userId,
      type,
      status: 'ACTIVE'
    }
  });

  // Create new token
  return prisma.token.create({
    data: {
      userId,
      type,
      value,
      status: 'ACTIVE',
      expiresAt
    }
  });
}; 