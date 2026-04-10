import { EnrollmentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { stripe } from "../../../config/stripe";
import { env, features } from "../../../config/config";
import { slugify } from "../../../core/utils/slugify";
import { generateResourceId } from "../../../core/utils/idGenerator";
import { AppError } from "../../../core/middleware/errorHandler";
import { ERRORS } from "../../../config/constants/messages";
import {
  notifyEnrollment,
  notifyCourseComplete,
  notifyInstructorNewStudent,
} from "../../../core/services/notificationService";

// -------------------------------------------------------------------------
// Public course browsing
// -------------------------------------------------------------------------

type ListFilter = {
  limit: number;
  cursor?: string;
  search?: string;
  categoryId?: string;
  isFree?: string;
  sortBy?: string;
};

export const getAllPublished = async (filter: ListFilter) => {
  const { limit, cursor, search, categoryId, isFree, sortBy } = filter;

  const where: any = { isPublished: true };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (isFree === "true") where.isFree = true;
  else if (isFree === "false") where.isFree = false;

  const orderBy: any =
    sortBy === "price_low"
      ? { price: "asc" }
      : sortBy === "price_high"
        ? { price: "desc" }
        : sortBy === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

  const courses = await prisma.course.findMany({
    where,
    select: {
      id: true,
      title: true,
      imageUrl: true,
      createdAt: true,
      price: true,
      isFree: true,
      discount: true,
      dealPrice: true,
      instructor: {
        select: {
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
      Category: { select: { id: true, name: true } },
      _count: {
        select: {
          Enrollment: true,
        },
      },
    },
    orderBy,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  let nextCursor: string | null = null;
  if (courses.length > limit) {
    const nextItem = courses.pop();
    nextCursor = nextItem?.id || null;
  }

  const coursesWithStudentCount = courses.map((course) => ({
    ...course,
    studentCount: course._count.Enrollment,
  }));

  return {
    items: coursesWithStudentCount,
    pagination: {
      nextCursor,
      hasNext: !!nextCursor,
      limit,
    },
  };
};

// -------------------------------------------------------------------------
// Course CRUD
// -------------------------------------------------------------------------

export const getInstructorCreated = async (userId: string) => {
  const instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError("Instructor profile not found", 404);
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
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getEnrolled = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: "ACTIVE",
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
                  email: true,
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
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return enrollments.map((enrollment: any) => enrollment.course);
};

export const getById = async (courseId: string) => {
  if (!courseId) {
    throw new AppError(ERRORS.COURSE_ID_REQUIRED, 400);
  }

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
              shortSummary: true,
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
    throw new AppError(ERRORS.COURSE_NOT_FOUND, 404);
  }

  return course;
};

type CreateCourseInput = {
  title: string;
  description: string;
  price?: number;
  isFree?: boolean;
  categories?: string[];
  imageUrl?: string;
  categoryId?: string;
  durationInSeconds?: number;
  targetAudience?: string[];
  technologies?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  discount?: number;
  dealPrice?: number;
  level?: any;
};

export const create = async (userId: string, input: CreateCourseInput) => {
  const {
    title,
    description,
    price,
    isFree,
    categories,
    imageUrl,
    categoryId,
    durationInSeconds,
    targetAudience,
    technologies,
    prerequisites,
    learningOutcomes,
    discount,
    dealPrice,
    level,
  } = input;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new AppError(ERRORS.COURSE_TITLE_REQUIRED, 400);
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    throw new AppError(ERRORS.COURSE_DESC_REQUIRED, 400);
  }

  const courseIsFree = isFree === true;
  const coursePrice = courseIsFree
    ? 0
    : typeof price === "number" && price > 0
      ? price
      : 0;

  if (!courseIsFree && coursePrice <= 0) {
    throw new AppError(ERRORS.COURSE_PRICE_REQUIRED, 400);
  }

  return prisma.course.create({
    data: {
      id: generateResourceId("course"),
      title: title.trim(),
      slug: slugify(title),
      description: description.trim(),
      price: coursePrice,
      isFree: courseIsFree,
      imageUrl,
      instructorId: userId,
      categoryId,
      duration: durationInSeconds,
      categories: categories ?? [],
      technologies: technologies ?? [],
      targetAudience: targetAudience ?? [],
      prerequisites: prerequisites ?? [],
      learningOutcomes: learningOutcomes ?? [],
      discount: typeof discount === "number" ? discount : 0,
      dealPrice: typeof dealPrice === "number" ? dealPrice : 0,
      level: level || undefined,
    },
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
      Category: true,
    },
  });
};

type UpdateCourseInput = Partial<{
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  categories: string[];
  categoryId: string;
  isPublished: boolean;
  isLive: boolean;
  imageUrl: string;
  learningOutcomes: string[];
  technologies: string[];
  targetAudience: string[];
  prerequisites: string[];
  discount: number;
  dealPrice: number;
  level: any;
}>;

export const update = async (courseId: string, input: UpdateCourseInput) => {
  const updateData: any = {};
  const fields: (keyof UpdateCourseInput)[] = [
    "title",
    "description",
    "price",
    "isFree",
    "categories",
    "categoryId",
    "isPublished",
    "isLive",
    "imageUrl",
    "learningOutcomes",
    "technologies",
    "targetAudience",
    "prerequisites",
    "discount",
    "dealPrice",
    "level",
  ];

  for (const field of fields) {
    if (input[field] !== undefined) {
      updateData[field] = input[field];
    }
  }

  return prisma.course.update({
    where: { id: courseId },
    data: updateData,
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
      Category: true,
    },
  });
};

export const remove = async (courseId: string) => {
  await prisma.course.delete({
    where: { id: courseId },
  });
  return null;
};

// -------------------------------------------------------------------------
// Enrollment + checkout
// -------------------------------------------------------------------------

export type CheckoutResult =
  | { type: "free"; enrollment: { id: string; userId: string; courseId: string; status: string } }
  | { type: "paid"; checkoutUrl: string | null; sessionId: string };

export const createCheckout = async (
  userId: string,
  courseId: string
): Promise<CheckoutResult> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { stripeCustomer: true },
  });
  if (!user) throw new AppError("User not found", 404);

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError("Course not found", 404);

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existingEnrollment) {
    throw new AppError("Already enrolled in this course", 409);
  }

  // Free course — enroll directly, no Stripe
  if (course.isFree) {
    const enrollment = await prisma.enrollment.create({
      data: {
        id: `enrollment-${userId.slice(0, 6)}-${courseId.slice(0, 6)}`,
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
      },
    });

    // Background notifications — don't await, don't block the response
    notifyEnrollment(userId, course.title, courseId);
    if (course.instructorId) {
      notifyInstructorNewStudent(
        course.instructorId,
        course.title,
        user.name || "A student",
        courseId
      );
    }

    return { type: "free", enrollment };
  }

  // Paid course — Stripe checkout session flow
  let stripeCustomerId = user.stripeCustomer?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? "",
      name: user.name ?? "",
    });
    stripeCustomerId = customer.id;
    await prisma.stripeCustomer.create({
      data: { stripeCustomerId: customer.id, userId },
    });
  }

  const effectivePrice = course.discount > 0 ? course.dealPrice : course.price;
  const price = await stripe.prices.create({
    unit_amount: Math.round(effectivePrice),
    currency: "usd",
    product_data: {
      name: course.title,
      metadata: { id: course.id },
    },
  });

  const frontendUrl =
    features.isProd && env.FRONTEND_URL_PROD
      ? env.FRONTEND_URL_PROD
      : env.FRONTEND_URL;

  if (!frontendUrl.startsWith("http")) {
    throw new AppError(
      `Invalid FRONTEND_URL: ${frontendUrl}. Must include http:// or https://`,
      500
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer: stripeCustomerId,
    line_items: [{ price: price.id, quantity: 1 }],
    metadata: { userId, courseId },
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/cancel`,
  });

  await prisma.enrollment.create({
    data: {
      id: `enrollment-${userId.slice(0, 6)}-${courseId.slice(0, 6)}`,
      userId,
      courseId,
      status: EnrollmentStatus.PENDING,
    },
  });

  return {
    type: "paid",
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

export const getEnrollmentStatus = async (
  userId: string,
  courseId: string
) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  return {
    isEnrolled: !!enrollment,
    enrollment,
  };
};

// -------------------------------------------------------------------------
// Progress
// -------------------------------------------------------------------------

export const getCourseProgress = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    include: {
      course: {
        include: {
          sections: {
            include: {
              Chapter: {
                include: {
                  ChapterProgress: {
                    where: { userId },
                  },
                },
                orderBy: { position: "asc" },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      },
      ChapterProgress: {
        where: { userId },
      },
    },
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in this course", 404);
  }

  const totalChapters = enrollment.course.sections.reduce(
    (total, section) => total + section.Chapter.length,
    0
  );

  const completedChapters = enrollment.ChapterProgress.filter(
    (cp) => cp.isCompleted
  ).length;

  const overallProgress =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  const sectionsWithProgress = enrollment.course.sections.map((section) => ({
    id: section.id,
    title: section.title,
    position: section.position,
    chapters: section.Chapter.map((chapter) => {
      const chapterProgress = chapter.ChapterProgress[0] || null;
      return {
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        isFree: chapter.isFree,
        contentType: chapter.contentType,
        progress: chapterProgress,
      };
    }),
  }));

  return {
    enrollment: {
      id: enrollment.id,
      status: enrollment.status,
      progress: overallProgress,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
    },
    course: {
      id: enrollment.course.id,
      title: enrollment.course.title,
      totalChapters,
      completedChapters,
      progress: overallProgress,
    },
    sections: sectionsWithProgress,
    chapterProgress: enrollment.ChapterProgress,
  };
};

export const getChapterProgress = async (
  userId: string,
  chapterId: string
) => {
  const chapterProgress = await prisma.chapterProgress.findUnique({
    where: {
      chapterId_userId: { chapterId, userId },
    },
    include: {
      Chapter: {
        include: {
          CourseSection: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!chapterProgress) {
    throw new AppError("Chapter progress not found", 404);
  }

  return chapterProgress;
};

type UpdateChapterProgressInput = {
  isCompleted?: boolean;
  progress?: number;
};

export const updateChapterProgress = async (
  userId: string,
  chapterId: string,
  input: UpdateChapterProgressInput
) => {
  const { isCompleted, progress: chapterProgressInput } = input;

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      CourseSection: {
        include: { course: true },
      },
    },
  });

  if (!chapter) {
    throw new AppError("Chapter not found", 404);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: chapter.CourseSection.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError("Not enrolled in this course", 403);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedChapterProgress = await tx.chapterProgress.upsert({
      where: {
        chapterId_userId: { chapterId, userId },
      },
      update: {
        isCompleted: isCompleted ?? undefined,
        progress: chapterProgressInput ?? undefined,
        lastAccessed: new Date(),
        updatedAt: new Date(),
      },
      create: {
        id: generateResourceId("chapterProgress"),
        chapterId,
        userId,
        enrollmentId: enrollment.id,
        isCompleted: isCompleted ?? false,
        progress: chapterProgressInput ?? 0,
        lastAccessed: new Date(),
      },
      include: { Chapter: true },
    });

    const allChapterProgress = await tx.chapterProgress.findMany({
      where: {
        userId,
        Chapter: { courseId: chapter.CourseSection.courseId },
      },
    });

    const totalChapters = await tx.chapter.count({
      where: {
        CourseSection: { courseId: chapter.CourseSection.courseId },
      },
    });

    const completedChapters = allChapterProgress.filter(
      (cp) => cp.isCompleted
    ).length;

    const overallProgress =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

    const courseProgress = await tx.courseProgress.upsert({
      where: {
        courseId_userId: {
          courseId: chapter.CourseSection.courseId,
          userId,
        },
      },
      update: {
        progress: overallProgress,
        isCompleted: overallProgress === 100,
        lastAccessed: new Date(),
      },
      create: {
        id: generateResourceId("courseProgress"),
        courseId: chapter.CourseSection.courseId,
        userId,
        progress: overallProgress,
        isCompleted: overallProgress === 100,
        lastAccessed: new Date(),
      },
    });

    if (overallProgress === 100) {
      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "COMPLETED",
          progress: overallProgress,
          endDate: new Date(),
        },
      });
    } else {
      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: { progress: overallProgress },
      });
    }

    return {
      chapterProgress: updatedChapterProgress,
      courseProgress,
      overallProgress,
    };
  });

  // Background notification on course completion
  if (result.overallProgress === 100) {
    notifyCourseComplete(
      userId,
      chapter.CourseSection.course.title,
      chapter.CourseSection.courseId
    );
  }

  return result;
};

// -------------------------------------------------------------------------
// Learning dashboard
// -------------------------------------------------------------------------

export const getLearningDashboard = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
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
          sections: {
            include: {
              Chapter: {
                include: {
                  ChapterProgress: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      },
      ChapterProgress: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return enrollments.map((enrollment) => {
    const totalChapters = enrollment.course.sections.reduce(
      (total, section) => total + section.Chapter.length,
      0
    );

    const completedChapters = enrollment.ChapterProgress.filter(
      (cp) => cp.isCompleted
    ).length;

    const progress =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

    return {
      enrollmentId: enrollment.id,
      courseId: enrollment.course.id,
      title: enrollment.course.title,
      instructor: enrollment.course.instructor?.user.name,
      imageUrl: enrollment.course.imageUrl,
      status: enrollment.status,
      progress,
      completedChapters,
      totalChapters,
      lastAccessed: enrollment.updatedAt,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
    };
  });
};
