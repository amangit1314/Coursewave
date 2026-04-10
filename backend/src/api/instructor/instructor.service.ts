import { Course, EnrollmentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

// -------------------------------------------------------------------------
// Prisma payload types — typed includes for relations
// -------------------------------------------------------------------------

type StudentEnrollmentPayload = Prisma.EnrollmentGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true; profileImageUrl: true } };
    course: { select: { id: true; title: true; imageUrl: true } };
  };
}>;

type CourseEnrollmentPayload = Prisma.EnrollmentGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true; profileImageUrl: true } };
    ChapterProgress: { select: { isCompleted: true } };
  };
}>;

type EarningPayload = Prisma.InstructorEarningGetPayload<{
  include: {
    course: { select: { id: true; title: true; imageUrl: true } };
  };
}>;

// -------------------------------------------------------------------------
// Reusable types for student/enrollment responses
// -------------------------------------------------------------------------

type EnrolledCourseEntry = {
  courseId: string;
  courseTitle: string;
  courseImageUrl: string | null;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: Date;
};

type StudentUser = StudentEnrollmentPayload["user"];

type StudentEntry = {
  user: StudentUser;
  enrolledCourses: EnrolledCourseEntry[];
};

type EarningByCourse = {
  courseId: string;
  courseTitle: string;
  total: number;
  count: number;
};

// -------------------------------------------------------------------------
// Instructor profile
// -------------------------------------------------------------------------

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

// -------------------------------------------------------------------------
// Analytics (with enrollment trend + top courses)
// -------------------------------------------------------------------------

export const getInstructorAnalytics = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
    include: { courses: true },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const courseIds = instructor.courses.map((c: Course) => c.id);

  const [totalEarning, totalEnrolledStudents, averageStarRating, recentEnrollments, topCoursesData] =
    await Promise.all([
      prisma.instructorEarning.aggregate({
        _sum: { amount: true },
        where: { instructorId: instructor.userId },
      }),
      prisma.enrollment.aggregate({
        _count: { userId: true },
        where: {
          courseId: { in: courseIds },
          status: EnrollmentStatus.ACTIVE,
        },
      }),
      prisma.course.aggregate({
        where: { instructorId: instructor.userId },
        _avg: { averageRating: true },
      }),
      prisma.enrollment.findMany({
        where: {
          courseId: { in: courseIds },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.course.findMany({
        where: { instructorId: instructor.userId },
        include: {
          _count: { select: { Enrollment: true } },
          Category: true,
        },
        orderBy: { Enrollment: { _count: "desc" } },
        take: 5,
      }),
    ]);

  // Build enrollment trend (group by date)
  const trendMap = new Map<string, number>();
  for (const e of recentEnrollments) {
    const dateKey = e.createdAt.toISOString().slice(0, 10);
    trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
  }
  const enrollmentTrend = Array.from(trendMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    totalEarnings: totalEarning._sum?.amount || 0,
    currency: "USD",
    totalStudents: totalEnrolledStudents._count?.userId || 0,
    totalCourses: instructor.courses.length,
    createdCourses: instructor.courses,
    averageRating: averageStarRating._avg?.averageRating || 0,
    enrollmentTrend,
    topCourses: topCoursesData.map((c) => ({
      ...c,
      studentCount: c._count.Enrollment,
    })),
  };
};

// -------------------------------------------------------------------------
// Instructor courses
// -------------------------------------------------------------------------

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

// -------------------------------------------------------------------------
// Students (count)
// -------------------------------------------------------------------------

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

// -------------------------------------------------------------------------
// Students (detailed list with enrolled courses)
// -------------------------------------------------------------------------

export const getInstructorStudentsList = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
    include: { courses: { select: { id: true } } },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const courseIds = instructor.courses.map((c) => c.id);

  const enrollments = (await prisma.enrollment.findMany({
    where: {
      courseId: { in: courseIds },
      status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImageUrl: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as StudentEnrollmentPayload[];

  // Deduplicate by userId to get unique students
  const studentMap = new Map<string, StudentEntry>();

  for (const enrollment of enrollments) {
    const existing = studentMap.get(enrollment.userId);
    const courseEntry: EnrolledCourseEntry = {
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      courseImageUrl: enrollment.course.imageUrl,
      status: enrollment.status,
      progress: enrollment.progress,
      enrolledAt: enrollment.createdAt,
    };

    if (existing) {
      existing.enrolledCourses.push(courseEntry);
    } else {
      studentMap.set(enrollment.userId, {
        user: enrollment.user,
        enrolledCourses: [courseEntry],
      });
    }
  }

  const students = Array.from(studentMap.values()).map((s) => ({
    ...s.user,
    enrolledCourses: s.enrolledCourses,
    totalCourses: s.enrolledCourses.length,
    averageProgress: Math.round(
      s.enrolledCourses.reduce((sum, c) => sum + c.progress, 0) /
        s.enrolledCourses.length
    ),
  }));

  return {
    students,
    totalStudents: students.length,
  };
};

// -------------------------------------------------------------------------
// Earnings (detailed with transactions + breakdown by course)
// -------------------------------------------------------------------------

export const getInstructorEarnings = async (userId: string) => {
  const instructor = await prisma.instructor.findFirst({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError("Instructor not found", 404);
  }

  const [earnings, totalAggregate] = await Promise.all([
    prisma.instructorEarning.findMany({
      where: { instructorId: instructor.userId },
      include: {
        course: {
          select: { id: true, title: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.instructorEarning.aggregate({
      _sum: { amount: true },
      where: { instructorId: instructor.userId },
    }),
  ]);

  // Earnings by course
  const earningsByCourse = new Map<string, EarningByCourse>();
  for (const earning of earnings) {
    const existing = earningsByCourse.get(earning.courseId);
    if (existing) {
      existing.total += earning.amount;
      existing.count += 1;
    } else {
      earningsByCourse.set(earning.courseId, {
        courseId: earning.courseId,
        courseTitle: earning.course.title,
        total: earning.amount,
        count: 1,
      });
    }
  }

  return {
    totalEarnings: totalAggregate._sum?.amount || 0,
    currency: "USD",
    transactions: earnings,
    earningsByCourse: Array.from(earningsByCourse.values()),
  };
};

// -------------------------------------------------------------------------
// Course-specific enrollments (for instructor to see who enrolled)
// -------------------------------------------------------------------------

export const getCourseEnrollments = async (
  userId: string,
  courseId: string
) => {
  // Verify instructor owns this course
  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId: userId },
    select: { id: true, title: true },
  });

  if (!course) {
    throw new AppError("Course not found or you are not the instructor", 404);
  }

  const [enrollments, totalChapters] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
        ChapterProgress: {
          select: {
            isCompleted: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.chapter.count({
      where: { CourseSection: { courseId } },
    }),
  ]);

  return {
    course: { id: course.id, title: course.title },
    totalChapters,
    enrollments: enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      progress: e.progress,
      startDate: e.startDate,
      endDate: e.endDate,
      createdAt: e.createdAt,
      completedChapters: e.ChapterProgress.filter((cp) => cp.isCompleted).length,
      totalChapters,
      user: e.user,
    })),
    totalEnrollments: enrollments.length,
  };
};

// -------------------------------------------------------------------------
// Public instructor routes
// -------------------------------------------------------------------------

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
          status: EnrollmentStatus.ACTIVE,
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
