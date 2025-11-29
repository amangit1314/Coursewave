import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface to include instructor
declare global {
  namespace Express {
    interface Request {
      instructor?: any;
    }
  }
}

/**
 * Middleware to check if user has a specific role
 * @param requiredRole - The role required to access the route
 * @returns Middleware function
 */
export const requireRole = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRoles = await prisma.userRole.findMany({
        where: { userId }
      });

      const hasRole: boolean = userRoles.some((role) => role.role === requiredRole);

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${requiredRole} role required.`
        });
      }

      next();
    } catch (error: any) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user role',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user is an instructor and attach instructor profile
 * @returns Middleware function
 */
export const requireInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: { userId }
    });

    const isInstructor = userRoles.some((role) => role.role === Role.INSTRUCTOR);

    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can perform this action'
      });
    }

    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    // Attach instructor to request for use in route handlers
    req.instructor = instructor;
    next();
  } catch (error: any) {
    console.error('Instructor check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking instructor status',
      error: error.message
    });
  }
};

export async function isInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('🛡️ [isInstructor] Checking if user is instructor:', {
      userId: req.user?.id,
      userEmail: req.user?.email
    });

    const instructor = await prisma.instructor.findUnique({
      where: { userId: req.user?.id }
    });

    console.log('🛡️ [isInstructor] Instructor lookup result:', instructor);

    if (!instructor) {
      console.log('❌ [isInstructor] User is not an instructor, sending 403');
      return res.status(403).json({
        success: false,
        message: "Instructor access required"
      });
    }

    console.log('✅ [isInstructor] User is instructor, proceeding');
    req.instructor = instructor;
    next();
  } catch (error) {
    console.error('💥 [isInstructor] Error:', error);
    next(error);
  }
}

/**
 * Middleware to check if user is an admin
 * @returns Middleware function
 */
export const requireAdmin = requireRole(Role.ADMIN);

/**
 * Middleware to check if user is a moderator
 * @returns Middleware function
 */
export const requireModerator = requireRole(Role.MODERATOR);

/**
 * Middleware to check if user is a support agent
 * @returns Middleware function
 */
export const requireSupport = requireRole(Role.USER); 