import { Request, Response } from "express";
import { generateResourceId } from "../../core/utils/idGenerator";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";
import z from "zod";
import {
  getAllAttachmentsForCourse,
  getAttachmentDetails as getAttachmentService,
  createNewAttachment as createAttachmentService,
  updateExistingAttachment as updateAttachmentService,
  deleteAttachmentById as deleteAttachmentService,
} from "../courses/services/attachments.service";
import {
  createNote,
  deleteNoteById,
  getNoteById,
  getNotesByChapter,
  updateNoteById,
} from "./services/notes.service";
import {
  deleteReviewService,
  editReviewService,
  getAllReviewsForCourseIdService,
  writeReviewService,
} from "./services/reviews.service";

import { prisma } from "../../config/prisma";
import { slugify } from "../../core/utils/slugify";
import { stripe } from "../../config/stripe";
import { EnrollmentStatus } from "@prisma/client";
import {
  notifyEnrollment,
  notifyCourseComplete,
  notifyInstructorNewStudent,
} from "../../core/services/notificationService";
import { ERRORS } from "../../config/constants/messages";
import { env, features } from "../../config/config";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

// Translate service errors that carry a numeric `.code` as HTTP status
// (reviews.service and attachments.service still use this pattern).
const throwAsAppError = (err: any, fallbackStatus = 500): never => {
  if (err instanceof AppError) throw err;
  const status = typeof err?.code === "number" ? err.code : fallbackStatus;
  throw new AppError(err?.message ?? "Unknown error", status);
};

// ------------------------------------------ COURSES ----------------------------------------
export const getAllPublishedCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const isFree = req.query.isFree as string | undefined;
    const sortBy = (req.query.sortBy as string) || "newest";

    const where: any = { isPublished: true };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (isFree === "true") {
      where.isFree = true;
    } else if (isFree === "false") {
      where.isFree = false;
    }

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

    const coursesWithStudentCount = courses.map((course) => ({
      ...course,
      studentCount: course._count.Enrollment,
    }));

    let nextCursor: string | null = null;
    if (courses.length > limit) {
      const nextItem = courses.pop();
      nextCursor = nextItem?.id || null;
    }

    // Preserves legacy response shape with `pagination` at root
    res.status(200).json({
      success: true,
      data: coursesWithStudentCount,
      pagination: {
        nextCursor,
        hasNext: !!nextCursor,
        limit,
      },
    });
  }
);

export const getInstructorCreatedCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);

    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new AppError("Instructor profile not found", 404);
    }

    const courses = await prisma.course.findMany({
      where: {
        instructorId: instructor.userId,
      },
      include: {
        Category: true,
        sections: {
          include: {
            Chapter: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    sendSuccess(res, courses);
  }
);

export const getEnrolledCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);

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
      orderBy: {
        createdAt: "desc",
      },
    });

    const courses = enrollments.map((enrollment: any) => enrollment.course);

    sendSuccess(res, courses);
  }
);

// ------------------------------------------- COURSE ----------------------------------------

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;

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

    sendSuccess(res, course);
  }
);

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);

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
    } = req.body;

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

    const course = await prisma.course.create({
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

    sendSuccess(res, course, "Course created successfully", 201);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;

    const {
      title,
      description,
      price,
      isFree,
      categories,
      categoryId,
      isPublished,
      isLive,
      imageUrl,
      learningOutcomes,
      technologies,
      targetAudience,
      prerequisites,
      discount,
      dealPrice,
      level,
    } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (isFree !== undefined) updateData.isFree = isFree;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (isLive !== undefined) updateData.isLive = isLive;
    if (categories !== undefined) updateData.categories = categories;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (learningOutcomes !== undefined)
      updateData.learningOutcomes = learningOutcomes;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
    if (discount !== undefined) updateData.discount = discount;
    if (level !== undefined) updateData.level = level;
    if (dealPrice !== undefined) updateData.dealPrice = dealPrice;

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
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

    sendSuccess(res, updatedCourse, "Course updated successfully");
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    sendSuccess(res, null, "Course deleted successfully");
  }
);

// ------------------------------------------- COURSE ENROLLMENT & PAYMENT --------------------

export const createCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = requireUserId(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stripeCustomer: true },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      throw new AppError("Already enrolled in this course", 409);
    }

    // Handle free course
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

      // Notify student + instructor in background
      notifyEnrollment(userId, course.title, courseId);
      if (course.instructorId) {
        notifyInstructorNewStudent(
          course.instructorId,
          course.title,
          user.name || "A student",
          courseId
        );
      }

      sendSuccess(res, enrollment, "Successfully enrolled in free course", 201);
      return;
    }

    // --- Stripe Customer Setup ---
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

    // --- Dynamic Price Creation ---
    const effectivePrice = course.discount > 0 ? course.dealPrice : course.price;
    const price = await stripe.prices.create({
      unit_amount: Math.round(effectivePrice),
      currency: "usd",
      product_data: {
        name: course.title,
        metadata: {
          id: course.id,
        },
      },
    });

    // --- Frontend URLs ---
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

    // --- Create Stripe Checkout Session ---
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { userId, courseId },
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
    });

    // --- Create Pending Enrollment ---
    await prisma.enrollment.create({
      data: {
        id: `enrollment-${userId.slice(0, 6)}-${courseId.slice(0, 6)}`,
        userId,
        courseId,
        status: EnrollmentStatus.PENDING,
      },
    });

    sendSuccess(res, {
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  }
);

export const getEnrollmentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = requireUserId(req);

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    sendSuccess(res, {
      isEnrolled: !!enrollment,
      enrollment,
    });
  }
);

// -------------------------------------- COURSE PROGRESS -------------------------------------

export const getCourseProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const courseId = req.params.courseId;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
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

    sendSuccess(res, {
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
    });
  }
);

// -------------------------------------- SECTIONS -------------------------------------------

export const getAllCourseSections = asyncHandler(
  async (req: Request, res: Response) => {
    const course = (req as any).course;
    sendSuccess(res, course.sections);
  }
);

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const { title, description } = req.body;

    const course = (req as any).course;

    const createdSection = await prisma.courseSection.create({
      data: {
        id: generateResourceId("courseSection"),
        title,
        description,
        position:
          course.sections.length === 0
            ? 1
            : Math.max(
                ...course.sections.map((s: any) => s.position || 0),
                0
              ) + 1,
        course: { connect: { id: courseId } },
      },
    });

    sendSuccess(res, createdSection, "Section created successfully");
  }
);

export const editSection = asyncHandler(
  async (req: Request, res: Response) => {
    const sectionId = req.params.sectionId;
    const { title: newTitle, description: newDescription } = req.body;

    if (!sectionId) {
      throw new AppError("sectionId is required to update a section", 400);
    }

    const updatedSection = await prisma.courseSection.update({
      where: { id: sectionId },
      data: {
        title: newTitle,
        description: newDescription,
      },
    });

    sendSuccess(res, updatedSection, "Section updated successfully");
  }
);

export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    const sectionId = req.params.sectionId;

    if (!sectionId) {
      throw new AppError("sectionId is required to delete a section", 400);
    }

    await prisma.courseSection.delete({
      where: { id: sectionId },
    });

    sendSuccess(res, null, "Section deleted successfully");
  }
);

// --------------------------------------- CHAPTERS -----------------------------------------

export const getAllCourseSectionChapters = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;

    const chapters = await prisma.chapter.findMany({
      where: { sectionId },
      orderBy: { position: "asc" },
    });

    sendSuccess(res, chapters);
  }
);

export const getChapterById = asyncHandler(
  async (req: Request, res: Response) => {
    const chapter = (req as any).chapter;
    sendSuccess(res, chapter);
  }
);

export const createChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      position,
      content,
      contentType,
      courseId,
      sectionId,
    } = req.body;

    const chapterSchema = z.object({
      title: z.string().min(10).max(150),
      description: z.string().min(50).max(500),
      contentType: z.string(),
      position: z.any().optional(),
      content: z.any().optional(),
      courseId: z.string().optional(),
      sectionId: z.string().optional(),
    });

    const parseResult = chapterSchema.safeParse({
      title,
      description,
      contentType,
      position,
      content,
      courseId,
      sectionId,
    });

    if (!parseResult.success) {
      // Preserves the { success, error: issues } shape frontends expect for Zod errors
      res.status(400).json({
        success: false,
        error: parseResult.error.issues,
      });
      return;
    }

    const chapter = await prisma.chapter.create({
      data: {
        id: generateResourceId("chapter"),
        title,
        description,
        position: Number(position),
        content,
        contentType,
        sectionId,
        courseId,
        isPublished: true,
        isFree: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    sendSuccess(res, chapter, "Chapter created successfully", 201);
  }
);

export const editChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const { chapterId } = req.params;
    const { title, description, position, content, contentType, newSectionId } =
      req.body;

    const normalizeContentType = (contentType: string): string => {
      const typeMap: Record<string, string> = {
        video: "VIDEO",
        text: "TEXT",
        quiz: "QUIZ",
        assignment: "ASSIGNMENT",
        resource: "RESOURCE",
        live: "LIVE",
      };
      return typeMap[contentType.toLowerCase()] || contentType.toUpperCase();
    };

    const validContentTypes = [
      "VIDEO",
      "TEXT",
      "QUIZ",
      "ASSIGNMENT",
      "RESOURCE",
      "LIVE",
    ] as const;

    const chapterUpdateSchema = z.object({
      title: z
        .string()
        .min(1, "Title must be at least 1 character")
        .max(150, "Title cannot exceed 150 characters")
        .optional()
        .or(z.null()),
      description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .or(z.null()),
      contentType: z
        .enum(validContentTypes, {
          message: `Content type must be one of: ${validContentTypes.join(", ")}`,
        })
        .optional()
        .or(z.null()),
      position: z.number().optional().or(z.null()),
      content: z.any().optional().or(z.null()),
      newSectionId: z
        .string()
        .uuid("Invalid section ID format")
        .optional()
        .or(z.null()),
    });

    const normalizedContentType = contentType
      ? normalizeContentType(contentType)
      : contentType;

    const parseResult = chapterUpdateSchema.safeParse({
      title,
      description,
      contentType: normalizedContentType,
      position,
      content,
      newSectionId,
    });

    if (!parseResult.success) {
      // Preserves the { success, error, details, fields } shape the frontend
      // uses for per-field validation error display.
      const errorMessages = parseResult.error.issues.map((issue) => {
        const rawField = issue.path[0];
        const field = String(rawField ?? "");
        const capitalizedField = field
          ? field.charAt(0).toUpperCase() + field.slice(1)
          : "Field";

        switch (issue.code) {
          case "too_small":
          case "too_big":
          case "invalid_value":
          case "invalid_format":
            return `${capitalizedField} ${issue.message}`;
          case "invalid_type":
            return `${capitalizedField} has invalid type`;
          default:
            return `${capitalizedField} is invalid`;
        }
      });

      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errorMessages,
        fields: parseResult.error.issues.map((issue) => issue.path[0]),
      });
      return;
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(content !== undefined && { content }),
        ...(normalizedContentType !== undefined && {
          contentType: normalizedContentType as any,
        }),
        ...(newSectionId !== undefined && { sectionId: newSectionId }),
      },
    });

    sendSuccess(res, updatedChapter, "Chapter updated successfully");
  }
);

export const deleteChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const { chapterId } = req.params;

    await prisma.chapter.delete({ where: { id: chapterId } });

    sendSuccess(res, null, "Chapter deleted successfully");
  }
);

// ---------------------------------------- CHAPTER PROGRESS --------------------------------

export const getChapterProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const chapterId = req.params.chapterId;

    const chapterProgress = await prisma.chapterProgress.findUnique({
      where: {
        chapterId_userId: {
          chapterId,
          userId,
        },
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

    sendSuccess(res, chapterProgress);
  }
);

export const updateChapterProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const chapterId = req.params.chapterId;
    const { isCompleted, progress: chapterProgress } = req.body;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        CourseSection: {
          include: {
            course: true,
          },
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
          chapterId_userId: {
            chapterId,
            userId,
          },
        },
        update: {
          isCompleted: isCompleted ?? undefined,
          progress: chapterProgress ?? undefined,
          lastAccessed: new Date(),
          updatedAt: new Date(),
        },
        create: {
          id: generateResourceId("chapterProgress"),
          chapterId,
          userId,
          enrollmentId: enrollment.id,
          isCompleted: isCompleted ?? false,
          progress: chapterProgress ?? 0,
          lastAccessed: new Date(),
        },
        include: {
          Chapter: true,
        },
      });

      const allChapterProgress = await tx.chapterProgress.findMany({
        where: {
          userId,
          Chapter: {
            courseId: chapter.CourseSection.courseId,
          },
        },
      });

      const totalChapters = await tx.chapter.count({
        where: {
          CourseSection: {
            courseId: chapter.CourseSection.courseId,
          },
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

    if (result.overallProgress === 100) {
      const courseTitle = chapter.CourseSection.course.title;
      const courseIdForNotify = chapter.CourseSection.courseId;
      notifyCourseComplete(userId, courseTitle, courseIdForNotify);
    }

    sendSuccess(res, result);
  }
);

// ---------------------------------------- REVIEWS --------------------------------

export const getAllReviewsForCourseId = asyncHandler(
  async (req: Request, res: Response) => {
    const reviews = await getAllReviewsForCourseIdService(req.params.courseId);
    sendSuccess(res, reviews);
  }
);

export const writeReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  try {
    const review = await writeReviewService({
      courseId: req.params.courseId,
      userId: requireUserId(req),
      rating,
      comment,
    });
    sendSuccess(res, review, "Review created successfully", 201);
  } catch (err: any) {
    throwAsAppError(err);
  }
});

export const editReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  try {
    const updatedReview = await editReviewService({
      courseId: req.params.courseId,
      reviewId: req.params.reviewId,
      userId: requireUserId(req),
      rating,
      comment,
    });
    sendSuccess(res, updatedReview, "Review updated successfully");
  } catch (err: any) {
    throwAsAppError(err);
  }
});

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await deleteReviewService({
        courseId: req.params.courseId,
        reviewId: req.params.reviewId,
        userId: requireUserId(req),
      });
      sendSuccess(res, null, "Review deleted successfully.");
    } catch (err: any) {
      throwAsAppError(err);
    }
  }
);

// ---------------------------------------- NOTES -----------------------------------

export const getAllCourseNotes = asyncHandler(
  async (req: Request, res: Response) => {
    const { chapterId } = req.params;
    const userId = requireUserId(req);

    const notes = await getNotesByChapter({ chapterId, userId });

    // Preserves legacy shape: { success, notes } with `notes` at root
    res.status(200).json({
      success: true,
      notes,
    });
  }
);

export const addNote = asyncHandler(async (req: Request, res: Response) => {
  const { chapterId } = req.params;
  const userId = requireUserId(req);
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    throw new AppError("Note content is required.", 400);
  }

  const note = await createNote({ content, chapterId, userId });

  // Preserves legacy shape: { success, note } with `note` at root
  res.status(201).json({
    success: true,
    note,
  });
});

export const editNote = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const userId = requireUserId(req);
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    throw new AppError("Note content is required.", 400);
  }

  const note = await getNoteById(noteId);
  if (!note) {
    throw new AppError("Note not found.", 404);
  }

  if (note.userId !== userId) {
    throw new AppError("You are not authorized to edit this note.", 403);
  }

  const updatedNote = await updateNoteById({ noteId, content });

  // Preserves legacy shape: { success, note } with `note` at root
  res.status(200).json({
    success: true,
    note: updatedNote,
  });
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const userId = requireUserId(req);

  const note = await getNoteById(noteId);
  if (!note) {
    throw new AppError("Note not found.", 404);
  }

  if (note.userId !== userId) {
    throw new AppError("You are not authorized to delete this note.", 403);
  }

  await deleteNoteById(noteId);

  sendSuccess(res, null, "Note deleted successfully.");
});

// ---------------------------------------- ATTACHMENTS -----------------------------

export const getAllCourseAttachments = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const attachments = await getAllAttachmentsForCourse(courseId);
    sendSuccess(res, attachments, "Course attachments fetched successfully");
  }
);

export const getAttachmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;
    const attachment = await getAttachmentService(attachmentId);
    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }
    sendSuccess(res, attachment, "Attachment fetched successfully");
  }
);

export const createAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, url, courseId } = req.body;
    try {
      const attachment = await createAttachmentService(
        name,
        url,
        courseId,
        (req as any).instructor.id
      );
      sendSuccess(res, attachment, "Attachment created successfully", 201);
    } catch (err: any) {
      const status = err?.message?.includes("Unauthorized") ? 403 : 404;
      throw new AppError(err.message, status);
    }
  }
);

export const updateAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;
    const { name, url } = req.body;
    try {
      const updatedAttachment = await updateAttachmentService(
        attachmentId,
        name,
        url,
        (req as any).instructor.id
      );
      sendSuccess(res, updatedAttachment, "Attachment updated successfully");
    } catch (err: any) {
      const status = err?.message?.includes("Unauthorized") ? 403 : 404;
      throw new AppError(err.message, status);
    }
  }
);

export const deleteAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;
    try {
      await deleteAttachmentService(attachmentId, (req as any).instructor.id);
      sendSuccess(res, null, "Attachment deleted successfully");
    } catch (err: any) {
      const status = err?.message?.includes("Unauthorized") ? 403 : 404;
      throw new AppError(err.message, status);
    }
  }
);

// -------------------------------------------- LEARNING DASHBOARD ------------------------------

export const getLearningDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);

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

    const dashboard = enrollments.map((enrollment) => {
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

    sendSuccess(res, dashboard);
  }
);
