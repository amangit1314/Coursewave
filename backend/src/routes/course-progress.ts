import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get course progress for a user
router.get('/course/:courseId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }
    
    // Get course progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId
        }
      },
      include: {
        chapters: {
          include: {
            chapter: true
          }
        }
      }
    });
    
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: 'Course progress not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: courseProgress
    });
  } catch (error: any) {
    console.log('ERROR in fetching course progress: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update course progress
router.put('/course/:courseId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const { progress, isCompleted } = req.body;
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }
    
    // Update or create course progress
    const courseProgress = await prisma.courseProgress.upsert({
      where: {
        courseId_userId: {
          courseId,
          userId
        }
      },
      update: {
        progress,
        isCompleted,
        lastAccessed: new Date()
      },
      create: {
        courseId,
        userId,
        progress,
        isCompleted
      },
      include: {
        chapters: {
          include: {
            chapter: true
          }
        }
      }
    });
    
    return res.status(200).json({
      success: true,
      data: courseProgress
    });
  } catch (error: any) {
    console.log('ERROR in updating course progress: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get chapter progress for a user
router.get('/chapter/:chapterId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const chapterId = req.params.chapterId;
    
    // Get chapter details
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId
      },
      include: {
        course: true
      }
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: chapter.courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }
    
    // Get chapter progress
    const chapterProgress = await prisma.chapterProgress.findUnique({
      where: {
        chapterId_userId: {
          chapterId,
          userId
        }
      },
      include: {
        chapter: true
      }
    });
    
    if (!chapterProgress) {
      return res.status(404).json({
        success: false,
        message: 'Chapter progress not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: chapterProgress
    });
  } catch (error: any) {
    console.log('ERROR in fetching chapter progress: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update chapter progress
router.put('/chapter/:chapterId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const chapterId = req.params.chapterId;
    const { progress, isCompleted } = req.body;
    
    // Get chapter details
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId
      },
      include: {
        course: true
      }
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: chapter.courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }
    
    // Get course progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        courseId_userId: {
          courseId: chapter.courseId,
          userId
        }
      }
    });
    
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: 'Course progress not found'
      });
    }
    
    // Update or create chapter progress
    const chapterProgress = await prisma.chapterProgress.upsert({
      where: {
        chapterId_userId: {
          chapterId,
          userId
        }
      },
      update: {
        progress,
        isCompleted,
        lastAccessed: new Date()
      },
      create: {
        chapterId,
        userId,
        progress,
        isCompleted,
        courseProgressId: courseProgress.id,
        enrollmentId: enrollment.id
      },
      include: {
        chapter: true
      }
    });
    
    // Update course progress if all chapters are completed
    if (isCompleted) {
      const allChapters = await prisma.chapter.findMany({
        where: {
          courseId: chapter.courseId
        }
      });
      
      const completedChapters = await prisma.chapterProgress.count({
        where: {
          userId,
          chapterId: {
            in: allChapters.map((chapter: { id: string }) => chapter.id)
          },
          isCompleted: true
        }
      });
      
      const courseProgressPercentage = Math.round((completedChapters / allChapters.length) * 100);
      const isCourseCompleted = courseProgressPercentage === 100;
      
      await prisma.courseProgress.update({
        where: {
          id: courseProgress.id
        },
        data: {
          progress: courseProgressPercentage,
          isCompleted: isCourseCompleted
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: chapterProgress
    });
  } catch (error: any) {
    console.log('ERROR in updating chapter progress: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all progress for a user
router.get('/user', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const courseProgress = await prisma.courseProgress.findMany({
      where: {
        userId
      },
      include: {
        course: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        chapters: {
          include: {
            chapter: true
          }
        }
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: courseProgress
    });
  } catch (error: any) {
    console.log('ERROR in fetching user progress: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 