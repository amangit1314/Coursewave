import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all attachments for a course
router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    
    const attachments = await prisma.courseAttachment.findMany({
      where: {
        courseId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: attachments
    });
  } catch (error: any) {
    console.log('ERROR in fetching course attachments: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get attachment by ID
router.get('/:attachmentId', async (req: Request, res: Response) => {
  try {
    const attachmentId = req.params.attachmentId;
    
    const attachment = await prisma.courseAttachment.findUnique({
      where: {
        id: attachmentId
      },
      include: {
        course: true
      }
    });
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: attachment
    });
  } catch (error: any) {
    console.log('ERROR in fetching attachment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create attachment
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create attachments'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    const { name, url, courseId } = req.body;
    
    // Check if course exists and belongs to instructor
    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId
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
        message: 'You are not authorized to add attachments to this course'
      });
    }
    
    const attachment = await prisma.courseAttachment.create({
      data: {
        name,
        url,
        courseId,
        instructorId: instructor.id
      }
    });
    
    return res.status(201).json({
      success: true,
      data: attachment
    });
  } catch (error: any) {
    console.log('ERROR in creating attachment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update attachment
router.put('/:attachmentId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const attachmentId = req.params.attachmentId;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can update attachments'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    // Check if attachment exists and belongs to instructor
    const attachment = await prisma.courseAttachment.findUnique({
      where: {
        id: attachmentId
      }
    });
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }
    
    if (attachment.instructorId !== instructor.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this attachment'
      });
    }
    
    const { name, url } = req.body;
    
    const updatedAttachment = await prisma.courseAttachment.update({
      where: {
        id: attachmentId
      },
      data: {
        name,
        url
      }
    });
    
    return res.status(200).json({
      success: true,
      data: updatedAttachment
    });
  } catch (error: any) {
    console.log('ERROR in updating attachment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete attachment
router.delete('/:attachmentId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const attachmentId = req.params.attachmentId;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can delete attachments'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    // Check if attachment exists and belongs to instructor
    const attachment = await prisma.courseAttachment.findUnique({
      where: {
        id: attachmentId
      }
    });
    
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }
    
    if (attachment.instructorId !== instructor.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this attachment'
      });
    }
    
    await prisma.courseAttachment.delete({
      where: {
        id: attachmentId
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully'
    });
  } catch (error: any) {
    console.log('ERROR in deleting attachment: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 