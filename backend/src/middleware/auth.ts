import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware to check for access token in header
export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['access_token'];
  
  if (!accessToken || accessToken !== 'coursewave_access_token') {
    return res.status(401).json({
      success: false,
      message: 'Access token is required or invalid'
    });
  }
  
  next();
};

// Middleware to verify JWT token for protected routes
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
} 