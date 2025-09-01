import { Request, Response, Router } from "express";
import { prisma } from '../config/prisma';
import { verifyToken } from "../api/auth/auth.middleware";
import { requireInstructor } from "../core/middleware/roleCheck";

const router = Router();

// Get instructor by user ID
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const instructor = await prisma.instructor.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            about: true,
          },
        },
        courses: {
          include: {
            Category: true,
            sections: {
              include: {
                Chapter: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor by user ID: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor by ID
router.get("/:instructorId", async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId;

    const instructor = await prisma.instructor.findUnique({
      where: {
        userId: instructorId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            about: true,
          },
        },
        courses: {
          include: {
            Category: true,
            sections: {
              include: {
                Chapter: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor analytics
router.get("/:instructorId/analytics", async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId;

    const instructor = await prisma.instructor.findUnique({
      where: {
        userId: instructorId,
      },
      include: {
        courses: true,
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Calculate total earnings
    const totalEarning = await prisma.instructorEarning.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        instructorId: instructorId,
      },
    });

    // Calculate total number of students across all courses
    const totalEnrolledStudents = await prisma.enrollment.aggregate({
      _count: {
        userId: true,
      },
      where: {
        courseId: {
          in: instructor.courses.map((course: any) => course.id),
        },
        status: "ACTIVE",
      },
    });

    // Calculate average star rating across all courses
    const averageStarRating = await prisma.course.aggregate({
      where: {
        instructorId: instructorId,
      },
      _avg: {
        averageRating: true,
      },
    });

    const analytics = {
      totalEarning: (totalEarning._sum?.amount || 0).toString(),
      totalStudents: totalEnrolledStudents._count?.userId || 0,
      totalCourses: instructor.courses.length,
      createdCourses: instructor.courses,
      averageStarRating: averageStarRating._avg?.averageRating || 5.0,
    };

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor analytics: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor courses
router.get("/:instructorId/courses", async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId;

    const courses = await prisma.course.findMany({
      where: {
        instructorId: instructorId,
      },
      include: {
        Category: true,
        sections: {
          include: {
            Chapter: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor courses: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor total students
router.get("/:instructorId/students", async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId;

    const studentsCount = await prisma.enrollment.count({
      where: {
        course: {
          instructorId: instructorId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: studentsCount,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor students count: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router; 