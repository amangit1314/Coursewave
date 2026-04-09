import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler, sendSuccess } from "../../core/middleware/errorHandler";

export const getPlatformLandingStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const [
      totalCourses,
      totalInstructors,
      totalUsers,
      totalSessions,
      totalProjects,
      totalArticles,
    ] = await Promise.all([
      prisma.course.count(),
      prisma.userRole.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count(),
      prisma.session.count(),
      prisma.project.count(),
      prisma.blog.count({ where: { isPublished: true } }),
    ]);

    sendSuccess(res, {
      totalCourses,
      totalInstructors,
      totalUsers,
      totalSessions,
      totalProjects,
      totalArticles,
    });
  }
);

export const getLandingReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;

    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4.5 },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    const transformedReviews = reviews.map((review: any) => ({
      id: review.id,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      user: {
        id: review.user?.id,
        name: review.user?.name || "Anonymous",
        profileImageUrl: review.user?.profileImageUrl,
      },
      course: {
        id: review.course.id,
        title: review.course.title,
        instructorName:
          review.course.instructor?.user?.name || "Unknown Instructor",
      },
    }));

    sendSuccess(res, transformedReviews);
  }
);
