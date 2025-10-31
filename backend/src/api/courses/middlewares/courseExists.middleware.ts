import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../config/prisma";

export async function courseExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
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
          },
        },
        Category: true,
        sections: {
          include: {
            Chapter: true,
          },
        },
        _count: {
          select: { Enrollment: true }, // Assumes relation: course.enrollments[]
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Will be available as course._count.enrollments
    const studentCount = course._count.Enrollment;

    (req as any).course = course;
    (req as any).course.studentCount = studentCount;
    next();
  } catch (error: any) {
    console.error("Error in courseExists middleware:", error);

    // Handle database connection errors specifically
    if (error.name === "PrismaClientInitializationError") {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable",
        error: "Service temporarily unavailable",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
