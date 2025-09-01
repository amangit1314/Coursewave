import express, { Request, Response } from "express";
import { Router } from "express";
import { prisma } from '../config/prisma';

import { invalidateCache } from "../config/redis";
import { generateResourceId } from "../core/utils/idGenerator";
import { uuidv4, z } from "zod";

/// =================== MIDDLEWARES =====================================
import { verifyToken } from "../api/auth/auth.middleware";
import {
  asyncHandler,
  requireInstructor,
  resourceSchema,
  sendError,
  sendNotFound,
  sendSuccess,
  validate,
  validateUUID,
} from "../core/middleware";
import { ownsCourse } from "../api/courses/middlewares/courseOwnership.middleware";
import { courseExists } from "../api/courses/middlewares/courseExists.middleware";
import { courseSectionExists } from "../api/courses/middlewares/courseSectionExists.middleware";
import { chapterExists } from "../api/courses/middlewares/chapterExists.middleware";
import { extractPublicId } from "../core/utils/utils";

const router: Router = express.Router();

/// ? ================================= COURSES ==================================
// Get all published courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
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
        Category: true,
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
    console.log("ERROR in fetching courses: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor's courses
router.get(
  "/instructor/courses",
  verifyToken,
  requireInstructor,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      // Get instructor profile
      const instructor = await prisma.instructor.findUnique({
        where: {
          userId,
        },
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor profile not found",
        });
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
  }
);

// Get enrolled courses
// router.get(
//   "/enrolled/courses",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     try {
//       const userId = req.user.id;

//       const enrollments = await prisma.enrollment.findMany({
//         where: {
//           userId,
//           status: "ACTIVE",
//         },
//         include: {
//           course: {
//             include: {
//               instructor: {
//                 include: {
//                   user: {
//                     select: {
//                       id: true,
//                       name: true,
//                       email: true,
//                     },
//                   },
//                 },
//               },
//               Category: true,
//               sections: {
//                 include: {
//                   Chapter: true,
//                 },
//               },
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       const courses = enrollments.map((enrollment: any) => enrollment.course);

//       return res.status(200).json({
//         success: true,
//         data: courses,
//       });
//     } catch (error: any) {
//       console.log("ERROR in fetching enrolled courses: ", error.message);
//       return res.status(500).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   }
// );

/// * ================================= Course =====================================

// Get course by ID
router.get("/:courseId", courseExists, async (req: Request, res: Response) => {
  try {
    const course = (req as any).course;

    console.log("Course fetched: ", course.id);
    console.log("Course: ", JSON.stringify(course, null, 2));

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.log("ERROR in fetching course: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create course
router.post(
  "/",
  verifyToken,
  requireInstructor,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const { title, description, price, categories, categoryId } = req.body;

      const course = await prisma.course.create({
        data: {
          id: generateResourceId("course"),
          title: title,
          description: description,
          price: price,
          // instructorId: instructor.userId,
          instructorId: userId,
          categoryId,
          categories: categories || [],
          // slug: slugify(title),
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

      // Invalidate course cache after creation
      await invalidateCache.courses();

      return res.status(201).json({
        success: true,
        data: course,
      });
    } catch (error: any) {
      console.log("ERROR in creating course: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Update course
router.put(
  "/:courseId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      const { title, description, price, categories, categoryId, isPublished } =
        req.body;

      // Only update fields if they are provided in req.body
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (categories !== undefined) updateData.categories = categories;

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

      // Invalidate course cache after update
      await invalidateCache.courses(courseId);

      return res.status(200).json({
        success: true,
        data: updatedCourse,
      });
    } catch (error: any) {
      console.log("ERROR in updating course: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete course
router.delete(
  "/:courseId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId;

      await prisma.course.delete({
        where: {
          id: courseId,
        },
      });

      // Invalidate course cache after deletion
      await invalidateCache.courses(courseId);

      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      console.log("ERROR in deleting course: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

///? --------------------------------- SECTIONS --------------------------------------

// Get all sections of a course
router.get(
  "/:courseId/sections",
  courseExists,
  async (req: Request, res: Response) => {
    try {
      const course = (req as any).course;

      return res.status(200).json({
        success: true,
        data: course.sections,
      });
    } catch (error: any) {
      console.log("ERROR in fetching course sections: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Create a section of a course
router.post(
  "/:courseId/sections/",
  requireInstructor,
  courseExists,
  ownsCourse,
  async (req: Request, res: Response) => {
    try {
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

      return res.status(200).json({
        success: true,
        data: createdSection,
      });
    } catch (error: any) {
      console.log("ERROR in fetching course sections: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Edit a section of a course
router.put(
  "/:courseId/sections/",
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  async (req: Request, res: Response) => {
    try {
      // Update an existing course section
      const {
        sectionId,
        title: newTitle,
        description: newDescription,
      } = req.body;

      if (!sectionId) {
        return res.status(400).json({
          success: false,
          message: "sectionId is required to update a section",
        });
      }

      const updatedSection = await prisma.courseSection.update({
        where: { id: sectionId },
        data: {
          title: newTitle,
          description: newDescription,
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedSection,
      });
    } catch (error: any) {
      console.log("ERROR in fetching course sections: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete a section of a course
router.delete(
  "/:courseId/sections/",
  verifyToken,
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  async (req: Request, res: Response) => {
    try {
      const { sectionId } = req.body;

      if (!sectionId) {
        return res.status(400).json({
          success: false,
          message: "sectionId is required to delete a section",
        });
      }

      await prisma.courseSection.delete({
        where: { id: sectionId },
      });

      return res.status(200).json({
        success: true,
        message: "Section deleted successfully",
      });
    } catch (error: any) {
      console.log("ERROR in deleting course section: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

///* -------------------------------- Chapters ----------------------------------------

// Get all chapters of a section of a course by sectionId
router.get(
  "/:courseId/sections/:sectionId/chapters",
  courseExists,
  courseSectionExists,
  async (req: Request, res: Response) => {
    try {
      const { courseId, sectionId } = req.params;

      // Get all chapters of the section
      const chapters = await prisma.chapter.findMany({
        where: { sectionId },
        orderBy: { position: "asc" },
      });

      return res.status(200).json({
        success: true,
        data: chapters,
      });
    } catch (error: any) {
      console.log("ERROR in fetching chapters: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get chapter by id
router.get(
  "/:courseId/sections/:sectionId/chapters/:chapterId",
  verifyToken,
  courseExists,
  courseSectionExists,
  chapterExists,
  async (req: Request, res: Response) => {
    try {
      const chapter = (req as any).chapter;

      return res.status(200).json({
        success: true,
        data: chapter,
      });
    } catch (error: any) {
      console.log("ERROR in fetching chapter: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

router.post(
  "/:courseId/sections/:sectionId/chapters/",
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        videoUrl,
        position,
        content,
        contentType,
        courseId,
        sectionId,
      } = req.body;

      const chapterSchema = z.object({
        title: z.string().min(10).max(150),
        description: z.string().min(50).max(500),
        contentType: z.enum([
          "VIDEO",
          "TEXT",
          "QUIZ",
          "ASSIGNMENT",
          "RESOURCE",
          "LIVE",
        ]),
        position: z.number().optional(),
        content: z.any().optional(),
        courseId: z.string().optional(),
        sectionId: z.string().optional(),
        videoUrl: z.string().url().optional(),
      });

      const parseResult = chapterSchema.safeParse({
        title,
        description,
        contentType,
        position,
        content,
        courseId,
        sectionId,
        videoUrl,
      });

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error.issues,
        });
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

      if (contentType === "VIDEO" && videoUrl) {
        await prisma.videoAsset.create({
          data: {
            chapterId: chapter.id,
            provider: "CLOUDINARY", // or SUPABASE — determine dynamically if needed
            publicId: extractPublicId(videoUrl) ?? "",
            secureUrl: videoUrl,
            format: "mp4", // or pass from frontend
            duration: 300, // or pass from frontend
            width: 1280,
            height: 720,
            bytes: 12345678,
          },
        });
      }

      return res.status(201).json({ success: true, data: chapter });
    } catch (error: any) {
      console.log("ERROR in creating chapter: ", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.put(
  "/:courseId/sections/:sectionId/chapters/:chapterId",
  verifyToken,
  courseExists,
  requireInstructor,
  ownsCourse,
  courseSectionExists,
  chapterExists,
  async (req: Request, res: Response) => {
    try {
      const { courseId, sectionId, chapterId } = req.params;
      const {
        title,
        description,
        videoUrl,
        position,
        content,
        contentType,
        newSectionId,
      } = req.body;

      const chapterUpdateSchema = z.object({
        title: z.string().min(10).max(150).optional(),
        description: z.string().min(50).max(500).optional(),
        contentType: z
          .enum(["VIDEO", "TEXT", "QUIZ", "ASSIGNMENT", "RESOURCE", "LIVE"])
          .optional(),
        position: z.number().optional(),
        content: z.any().optional(),
        newSectionId: z.string().optional(),
        videoUrl: z.string().url().optional(),
      });

      const parseResult = chapterUpdateSchema.safeParse({
        title,
        description,
        contentType,
        position,
        content,
        newSectionId,
        videoUrl,
      });

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error.issues,
        });
      }

      const updatedChapter = await prisma.chapter.update({
        where: { id: chapterId },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(position !== undefined && { position }),
          ...(content !== undefined && { content }),
          ...(contentType !== undefined && { contentType }),
          ...(newSectionId !== undefined && { sectionId: newSectionId }),
          updatedAt: new Date(),
        },
      });

      if (contentType === "VIDEO" && videoUrl) {
        const existingVideo = await prisma.videoAsset.findUnique({
          where: { chapterId },
        });

        if (existingVideo) {
          await prisma.videoAsset.update({
            where: { chapterId },
            data: {
              secureUrl: videoUrl,
              publicId: extractPublicId(videoUrl) ?? "",
              updatedAt: new Date(),
              // update other metadata if needed
            },
          });
        } else {
          await prisma.videoAsset.create({
            data: {
              chapterId,
              provider: "CLOUDINARY",
              publicId: extractPublicId(videoUrl) ?? "",
              secureUrl: videoUrl,
              format: "mp4",
              duration: 300,
              width: 1280,
              height: 720,
              bytes: 12345678,
            },
          });
        }
      }

      return res.status(200).json({ success: true, data: updatedChapter });
    } catch (error: any) {
      console.log("ERROR in updating chapter: ", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Delete chapter
router.delete(
  "/:courseId/sections/:sectionId/chapters/:chapterId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  courseExists,
  courseSectionExists,
  chapterExists,
  async (req: Request, res: Response) => {
    try {
      const { courseId, sectionId, chapterId } = req.params;

      await prisma.chapter.delete({ where: { id: chapterId } });

      return res.status(200).json({
        success: true,
        message: "Chapter deleted successfully",
      });
    } catch (error: any) {
      console.log("ERROR in deleting chapter: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

//! ------------------------------------------ Reviews -------------------------------------------

// Get all reviews of a course paginated
router.get(
  "/:courseId/reviews",
  courseExists,
  async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId;

      const reviews = await prisma.review.findMany({
        where: { courseId },
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
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      console.log("ERROR in fetching course reviews: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Write a review for a course
router.post(
  "/:courseId/reviews",
  verifyToken,
  courseExists,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const reviewSchema = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().min(10).max(1000),
      });

      const parseResult = reviewSchema.safeParse({ rating, comment });

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error.issues,
        });
      }

      // Prevent duplicate review by same user
      const existingReview = await prisma.review.findFirst({
        where: { courseId, userId },
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          error: "You have already reviewed this course.",
        });
      }

      const review = await prisma.review.create({
        data: {
          id: generateResourceId("review"),
          courseId,
          userId,
          rating,
          comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
      });

      return res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error: any) {
      console.log("ERROR in creating course review: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Edit review
router.put(
  "/:courseId/reviews/:reviewId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { courseId, reviewId } = req.params;
      const userId = req.user.id;

      // Only allow the user who wrote the review to edit it
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review || review.courseId !== courseId) {
        return res.status(404).json({
          success: false,
          error: "Review not found.",
        });
      }

      if (review.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to edit this review.",
        });
      }

      // Use Zod for validation
      const { z } = require("zod");
      const reviewSchema = z.object({
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().max(1000).optional(),
      });
      const parseResult = reviewSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error.errors,
        });
      }

      const { rating, comment } = parseResult.data;

      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          rating: rating !== undefined ? rating : review.rating,
          comment: comment !== undefined ? comment : review.comment,
          updatedAt: new Date(),
        },
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
      });

      return res.status(200).json({
        success: true,
        data: updatedReview,
      });
    } catch (error: any) {
      console.log("ERROR in editing course review: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete review
router.delete(
  "/:courseId/reviews/:reviewId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { courseId, reviewId } = req.params;
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review || review.courseId !== courseId) {
        return res.status(404).json({
          success: false,
          error: "Review not found.",
        });
      }

      if (review.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to delete this review.",
        });
      }

      await prisma.review.delete({
        where: { id: reviewId },
      });

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (error: any) {
      console.log("ERROR in deleting course review: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

//? ----------------------------------- Chapter Notes Routes ----------------------------------------

/// Get all notes for the chapter (logged in user can see only own created notes)
router.get(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { courseId, sectionId, chapterId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({
          success: false,
          error: "Note content is required.",
        });
      }

      const note = await prisma.chapterNote.findMany({
        where: {
          userId,
          chapterId,
        },
      });

      return res.status(201).json({
        success: true,
        note,
      });
    } catch (error: any) {
      console.log("ERROR in adding chapter note: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Add note to chapter
router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { courseId, chapterId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({
          success: false,
          error: "Note content is required.",
        });
      }

      // Optionally: check if chapter exists and belongs to course

      const note = await prisma.chapterNote.create({
        data: {
          id: generateResourceId("chapterNote"),
          content,
          chapterId,
          userId,
          updatedAt: new Date(),
        },
      });

      return res.status(201).json({
        success: true,
        note,
      });
    } catch (error: any) {
      console.log("ERROR in adding chapter note: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Edit note in chapter
router.put(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes/:noteId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({
          success: false,
          error: "Note content is required.",
        });
      }

      const note = await prisma.chapterNote.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return res.status(404).json({
          success: false,
          error: "Note not found.",
        });
      }

      if (note.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to edit this note.",
        });
      }

      const updatedNote = await prisma.chapterNote.update({
        where: { id: noteId },
        data: {
          content,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        note: updatedNote,
      });
    } catch (error: any) {
      console.log("ERROR in editing chapter note: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete note from chapter
router.delete(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes/:noteId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;

      const note = await prisma.chapterNote.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return res.status(404).json({
          success: false,
          error: "Note not found.",
        });
      }

      if (note.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to delete this note.",
        });
      }

      await prisma.chapterNote.delete({
        where: { id: noteId },
      });

      return res.status(200).json({
        success: true,
        message: "Note deleted successfully.",
      });
    } catch (error: any) {
      console.log("ERROR in deleting chapter note: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

//* --------------------------------- Course Attachments Routes --------------------------------------

// Get all attachments for a course
router.get(
  "/:courseId/course-attachements",
  validateUUID("courseId"),
  asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId;

    const attachments = await prisma.courseAttachment.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, attachments, "Course attachments fetched successfully");
  })
);

// Get attachment by ID
router.get(
  "/:courseId/course-attachments/:attachmentId",
  validateUUID("attachmentId"),
  asyncHandler(async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;

    const attachment = await prisma.courseAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        Course: true,
        Instructor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!attachment) {
      return sendNotFound(res, "Attachment not found");
    }

    sendSuccess(res, attachment, "Attachment fetched successfully");
  })
);

// Create attachment for a course
router.post(
  "/:courseId/course-attachments",
  verifyToken,
  requireInstructor,
  validate(resourceSchema),
  ownsCourse,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, url, courseId } = req.body;

    // Verify the course belongs to instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return sendNotFound(res, "Course not found");
    }

    if (course.instructorId !== req.instructor.id) {
      return sendError(
        res,
        "You are not authorized to add attachments to this course",
        403
      );
    }

    const attachment = await prisma.courseAttachment.create({
      data: {
        id: generateResourceId("courseAttachment"),
        name,
        url,
        courseId,
        instructorId: req.instructor.id,
        updatedAt: new Date(),
      },
      include: {
        Course: true,
        Instructor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Invalidate cache for the course
    await invalidateCache.courses(courseId);

    sendSuccess(res, attachment, "Attachment created successfully", 201);
  })
);

// Update attachment
router.put(
  "/:courseId/course-attachments/:attachmentId",
  verifyToken,
  requireInstructor,
  validateUUID("attachmentId"),
  validate(resourceSchema.partial()),
  asyncHandler(async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;
    const { name, url } = req.body;

    // Check if attachment exists and belongs to instructor's course
    const attachment = await prisma.courseAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        Course: true,
      },
    });

    if (!attachment) {
      return sendNotFound(res, "Attachment not found");
    }

    // Verify ownership through the course
    if (attachment.Course?.instructorId !== req.instructor.id) {
      return sendError(
        res,
        "You are not authorized to update this attachment",
        403
      );
    }

    const updatedAttachment = await prisma.courseAttachment.update({
      where: { id: attachmentId },
      data: { name, url },
    });

    // Invalidate cache for the course
    await invalidateCache.courses(attachment.courseId);

    sendSuccess(res, updatedAttachment, "Attachment updated successfully");
  })
);

// Delete attachment
router.delete(
  "/:courseId/course-attachments/:attachmentId",
  verifyToken,
  requireInstructor,
  validateUUID("attachmentId"),
  asyncHandler(async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;

    // Check if attachment exists and belongs to instructor's course
    const attachment = await prisma.courseAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        Course: true,
      },
    });

    if (!attachment) {
      return sendNotFound(res, "Attachment not found");
    }

    // Verify ownership through the course
    if (attachment.Course?.instructorId !== req.instructor.id) {
      return sendError(
        res,
        "You are not authorized to delete this attachment",
        403
      );
    }

    await prisma.courseAttachment.delete({
      where: { id: attachmentId },
    });

    // Invalidate cache for the course
    await invalidateCache.courses(attachment.courseId);

    sendSuccess(res, null, "Attachment deleted successfully");
  })
);

export default router;
