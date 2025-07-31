import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface to include owned resource
declare global {
  namespace Express {
    interface Request {
      ownedResource?: any;
    }
  }
}

/**
 * Middleware to check if instructor owns a course
 * @returns Middleware function
 */
export const requireCourseOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const instructor = req.instructor;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (!instructor) {
      return res.status(401).json({
        success: false,
        message: 'Instructor authentication required'
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId !== instructor.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this course'
      });
    }

    // Attach course to request for use in route handlers
    req.ownedResource = course;
    next();
  } catch (error: any) {
    console.error('Course ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking course ownership',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user owns a resource by ID
 * @param resourceType - The type of resource to check (e.g., 'course', 'blog', 'review')
 * @param idParam - The parameter name containing the resource ID (default: 'id')
 * @returns Middleware function
 */
export const requireResourceOwnership = (resourceType: string, idParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params[idParam] || req.body[idParam];
      const userId = req.user?.id;

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: `${resourceType} ID is required`
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      let resource;
      let ownerId;

      switch (resourceType.toLowerCase()) {
        case 'course':
          resource = await prisma.course.findUnique({
            where: { id: resourceId },
            include: { instructor: true }
          });
          ownerId = resource?.instructor?.userId;
          break;
        
        case 'blog':
          resource = await prisma.blog.findUnique({
            where: { id: resourceId }
          });
          ownerId = resource?.authorId;
          break;
        
        case 'review':
          resource = await prisma.review.findUnique({
            where: { id: resourceId }
          });
          ownerId = resource?.userId;
          break;
        
        case 'comment':
          resource = await prisma.blogComment.findUnique({
            where: { id: resourceId }
          });
          ownerId = resource?.authorId;
          break;
        
        default:
          return res.status(400).json({
            success: false,
            message: `Unsupported resource type: ${resourceType}`
          });
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${resourceType} not found`
        });
      }

      if (ownerId !== userId) {
        return res.status(403).json({
          success: false,
          message: `You are not authorized to modify this ${resourceType}`
        });
      }

      // Attach resource to request for use in route handlers
      req.ownedResource = resource;
      next();
    } catch (error: any) {
      console.error(`${resourceType} ownership check error:`, error);
      return res.status(500).json({
        success: false,
        message: `Error checking ${resourceType} ownership`,
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user is enrolled in a course
 * @returns Middleware function
 */
export const requireCourseEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const userId = req.user?.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Attach enrollment to request for use in route handlers
    req.ownedResource = enrollment;
    next();
  } catch (error: any) {
    console.error('Course enrollment check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking course enrollment',
      error: error.message
    });
  }
}; 