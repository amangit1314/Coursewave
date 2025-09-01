import express, { Request, Response } from "express";
import { Router } from "express";
import { prisma } from '../config/prisma';
import { verifyToken } from "../api/auth/auth.middleware";
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

// Get course progress for a user
router.get(
  "/course/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }

      // Get course progress
      const courseProgress = await prisma.courseProgress.findUnique({
        where: {
          courseId_userId: {
            courseId,
            userId,
          },
        },
        include: {
          Course: true,
          ChapterProgress: true,
        },
      });

      if (!courseProgress) {
        return res.status(404).json({
          success: false,
          message: "Course progress not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: courseProgress,
      });
    } catch (error: any) {
      console.log("ERROR in fetching course progress: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Update course progress
router.put(
  "/course/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;
      const { progress, isCompleted } = req.body;

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }

      // Update or create course progress
      const courseProgress = await prisma.courseProgress.upsert({
        where: {
          courseId_userId: {
            courseId,
            userId,
          },
        },
        update: {
          progress: progress || 0,
          isCompleted: isCompleted || false,
          lastAccessed: new Date(),
        },
        create: {
          id: uuidv4(),
          courseId,
          userId,
          progress: progress || 0,
          isCompleted: isCompleted || false,
          lastAccessed: new Date(),
        },
        include: {
          Course: true,
          ChapterProgress: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: courseProgress,
      });
    } catch (error: any) {
      console.log("ERROR in updating course progress: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get chapter progress for a user
router.get(
  "/chapter/:chapterId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const chapterId = req.params.chapterId;

      // Get chapter details
      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
        },
        include: {
          CourseSection: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        });
      }

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: chapter.CourseSection.courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }

      // Get chapter progress
      const chapterProgress = await prisma.chapterProgress.findUnique({
        where: {
          chapterId_userId: {
            chapterId,
            userId,
          },
        },
        include: {
          Chapter: true,
        },
      });

      if (!chapterProgress) {
        return res.status(404).json({
          success: false,
          message: "Chapter progress not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: chapterProgress,
      });
    } catch (error: any) {
      console.log("ERROR in fetching chapter progress: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Update chapter progress
router.put(
  "/chapter/:chapterId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const chapterId = req.params.chapterId;
      const { isCompleted, progress } = req.body;

      // Get chapter details
      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
        },
        include: {
          CourseSection: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        });
      }

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: chapter.CourseSection.courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }

      // Update or create chapter progress
      const chapterProgress = await prisma.chapterProgress.upsert({
        where: {
          chapterId_userId: {
            chapterId,
            userId,
          },
        },
        update: {
          isCompleted: isCompleted || false,
          progress: progress || 0,
          lastAccessed: new Date(),
        },
        create: {
          id: uuidv4(),
          chapterId,
          userId,
          isCompleted: isCompleted || false,
          progress: progress || 0,
          lastAccessed: new Date(),
          updatedAt: new Date(),
        },
        include: {
          Chapter: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: chapterProgress,
      });
    } catch (error: any) {
      console.log("ERROR in updating chapter progress: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get all progress for a user
router.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const courseProgress = await prisma.courseProgress.findMany({
      where: {
        userId,
      },
      include: {
        Course: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        ChapterProgress: {
          include: {
            Chapter: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      data: courseProgress,
    });
  } catch (error: any) {
    console.log("ERROR in fetching user progress: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
