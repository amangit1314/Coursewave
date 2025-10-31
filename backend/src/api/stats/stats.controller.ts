import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const getPlatformLandingStats = async (req: Request, res: Response) => {
  try {
    // Execute all count queries in parallel for better performance
    const [
      totalCourses,
      totalInstructors,
      totalUsers,
      totalSessions,
      totalProjects,
      totalArticles,
    ] = await Promise.all([
      // Total courses (all courses, not just published)
      prisma.course.count(),

      // Total instructors (users with instructor role)
      prisma.userRole.count({
        where: { role: "INSTRUCTOR" },
      }),

      // Total users
      prisma.user.count(),

      // Total sessions
      prisma.session.count(),

      // Total projects
      prisma.project.count(),

      // Total articles (published blogs)
      prisma.blog.count({
        where: { isPublished: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalInstructors,
        totalUsers,
        totalSessions,
        totalProjects,
        totalArticles,
      },
    });
  } catch (error: any) {
    console.error("ERROR in fetching platform stats: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getLandingReviews = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4.5 }, // Only show high-rated reviews for landing page
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

    // Transform the data for frontend
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

    return res.status(200).json({
      success: true,
      data: transformedReviews,
    });
  } catch (error: any) {
    console.error("ERROR in fetching landing reviews: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
