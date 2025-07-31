import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Attach course to request
    (req as any).course = course;

    next();
  } catch (error: any) {
    console.error("Error in courseExists middleware:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
