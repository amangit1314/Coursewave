import { Course } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

export const getInstructorProfile = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
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
    throw new AppError("Instructor profile not found", 404);
  }

  return instructor;
};

export const getInstructorAnalytics = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
    include: { courses: true },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const [totalEarning, totalEnrolledStudents, averageStarRating] =
    await Promise.all([
      prisma.instructorEarning.aggregate({
        _sum: { amount: true },
        where: { instructorId: instructor.userId },
      }),
      prisma.enrollment.aggregate({
        _count: { userId: true },
        where: {
          courseId: { in: instructor.courses.map((c: Course) => c.id) },
          status: "ACTIVE",
        },
      }),
      prisma.course.aggregate({
        where: { instructorId: instructor.userId },
        _avg: { averageRating: true },
      }),
    ]);

  return {
    totalEarnings: totalEarning._sum?.amount || 0,
    currency: "USD",
    totalStudents: totalEnrolledStudents._count?.userId || 0,
    totalCourses: instructor.courses.length,
    createdCourses: instructor.courses,
    averageRating: averageStarRating._avg?.averageRating || 0,
  };
};

export const getInstructorCourses = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  return prisma.course.findMany({
    where: { instructorId: instructor.userId },
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
    orderBy: { createdAt: "desc" },
  });
};

export const getInstructorStudents = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  return prisma.enrollment.count({
    where: { course: { instructorId: instructor.userId } },
  });
};

export const getPublicInstructorCourses = async (instructorId: string) => {
  return prisma.course.findMany({
    where: { instructorId },
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
              profileImageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPublicInstructorAnalytics = async (instructorId: string) => {
  const instructor = await prisma.instructor.findUnique({
    where: { userId: instructorId },
    include: { courses: true },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const [totalEarning, totalEnrolledStudents, averageStarRating] =
    await Promise.all([
      prisma.instructorEarning.aggregate({
        _sum: { amount: true },
        where: { instructorId },
      }),
      prisma.enrollment.aggregate({
        _count: { userId: true },
        where: {
          courseId: { in: instructor.courses.map((c: Course) => c.id) },
          status: "ACTIVE",
        },
      }),
      prisma.course.aggregate({
        where: { instructorId },
        _avg: { averageRating: true },
      }),
    ]);

  return {
    totalEarning: (totalEarning._sum?.amount || 0).toString(),
    totalStudents: totalEnrolledStudents._count?.userId || 0,
    totalCourses: instructor.courses.length,
    createdCourses: instructor.courses,
    averageStarRating: averageStarRating._avg?.averageRating || 5.0,
  };
};
