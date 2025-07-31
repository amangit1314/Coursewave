import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { invalidateCache } from "../../config/redis";
import { generateResourceId } from "../../core/utils/idGenerator";
import { sendError, sendNotFound, sendSuccess } from "../../core/middleware";
import z from "zod";
// import * as AttachmentService from "../courses/services/attachments.service";
import {
  getAllAttachmentsForCourse,
  getAttachmentDetails as getAttachmentService,
  createNewAttachment as createAttachmentService,
  updateExistingAttachment as updateAttachmentService,
  deleteAttachmentById as deleteAttachmentService,
  updateExistingAttachment,
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

const prisma = new PrismaClient();

// ------------------------------------------ COURSES ----------------------------------------
export const getAllPublishedCourses = async (req: Request, res: Response) => {
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
};

export const getInstructorCreatedCourses = async (
  req: Request,
  res: Response
) => {
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
};

export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

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

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    console.log("ERROR in fetching enrolled courses: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ------------------------------------------- COURSE ----------------------------------------

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: "courseId is required",
      });
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
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.log("ERROR in fetching course by id: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const { title, description, price, categories, imageUrl, categoryId, durationInSeconds, targetAudience, technologies, prerequisites, learningOutcomes  } = req.body;

    const course = await prisma.course.create({
      data: {
        id: generateResourceId("course"),
        title: title,
        description: description,
        price: price,
        imageUrl,
        instructorId: userId,
        categoryId,
        duration: durationInSeconds,
        categories: categories ?? [],
        technologies,
        targetAudience,
        prerequisites,
        learningOutcomes,
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
};

export const updateCourse = async (req: Request, res: Response) => {
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
};

export const deleteCourse = async (req: Request, res: Response) => {
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
};

// -------------------------------------- SECTIONS -------------------------------------------

export const getAllCourseSections = async (req: Request, res: Response) => {
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
};

export const createSection = async (req: Request, res: Response) => {
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
            : Math.max(...course.sections.map((s: any) => s.position || 0), 0) +
              1,
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
};

export const editSection = async (req: Request, res: Response) => {
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
};

export const deleteSection = async (req: Request, res: Response) => {
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
};

// --------------------------------------- CHAPTERS -----------------------------------------
export const getAllCourseSectionChapters = async (
  req: Request,
  res: Response
) => {
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
};

export const getChapterById = async (req: Request, res: Response) => {
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
};

export const createChapter = async (req: Request, res: Response) => {
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
      return res.status(400).json({
        success: false,
        error: parseResult.error.issues,
      });
    }

    // Create chapter
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

    return res.status(201).json({ success: true, data: chapter });
  } catch (error: any) {
    console.log("ERROR in creating chapter: ", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const editChapter = async (req: Request, res: Response) => {
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
      contentType: z.string().optional(),
      position: z.number().optional(),
      content: z.json().optional(),
      newSectionId: z.string().optional(),
    });

    const parseResult = chapterUpdateSchema.safeParse({
      title,
      description,
      contentType,
      position,
      content,
      newSectionId,
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
      },
    });

    return res.status(200).json({ success: true, data: updatedChapter });
  } catch (error: any) {
    console.log("ERROR in updating chapter: ", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
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
};

// ---------------------------------------- REVIEWS --------------------------------

export const getAllReviewsForCourseId = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviewsForCourseIdService(req.params.courseId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const writeReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const review = await writeReviewService({
      courseId: req.params.courseId,
      userId: req.user.id,
      rating,
      comment,
    });
    return res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    return res
      .status(error.code || 500)
      .json({ success: false, error: error.message });
  }
};

export const editReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const updatedReview = await editReviewService({
      courseId: req.params.courseId,
      reviewId: req.params.reviewId,
      userId: req.user.id,
      rating,
      comment,
    });
    return res.status(200).json({ success: true, data: updatedReview });
  } catch (error: any) {
    return res
      .status(error.code || 500)
      .json({ success: false, error: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    await deleteReviewService({
      courseId: req.params.courseId,
      reviewId: req.params.reviewId,
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error: any) {
    return res
      .status(error.code || 500)
      .json({ success: false, error: error.message });
  }
};

// ---------------------------------------- NOTES -----------------------------------

// GET all notes for a chapter
export const getAllCourseNotes = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;

    const notes = await getNotesByChapter({ chapterId, userId });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error: any) {
    console.error("ERROR in getting notes:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// POST create new note
export const addNote = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        error: "Note content is required.",
      });
    }

    const note = await createNote({ content, chapterId, userId });

    return res.status(201).json({
      success: true,
      note,
    });
  } catch (error: any) {
    console.error("ERROR in adding note:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// PUT edit a note
export const editNote = async (req: Request, res: Response) => {
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

    const note = await getNoteById(noteId);
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

    const updatedNote = await updateNoteById({ noteId, content });

    return res.status(200).json({
      success: true,
      note: updatedNote,
    });
  } catch (error: any) {
    console.error("ERROR in editing note:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const note = await getNoteById(noteId);
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

    await deleteNoteById(noteId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (error: any) {
    console.error("ERROR in deleting note:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ---------------------------------------- ATTACHMENTS -----------------------------

// GET: /attachments/:courseId
export const getAllCourseAttachments = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  const attachments = await getAllAttachmentsForCourse(courseId);
  sendSuccess(res, attachments, "Course attachments fetched successfully");
};

// GET: /attachment/:attachmentId
export const getAttachmentById = async (req: Request, res: Response) => {
  const attachmentId = req.params.attachmentId;

  const attachment = await getAttachmentService(attachmentId);
  if (!attachment) return sendNotFound(res, "Attachment not found");

  sendSuccess(res, attachment, "Attachment fetched successfully");
};

// POST: /attachments
export const createAttachment = async (req: Request, res: Response) => {
  try {
    const { name, url, courseId } = req.body;
    const attachment = await createAttachmentService(
      name,
      url,
      courseId,
      req.instructor.id
    );

    sendSuccess(res, attachment, "Attachment created successfully", 201);
  } catch (err: any) {
    const statusCode = err.message.includes("Unauthorized") ? 403 : 404;
    sendError(res, err.message, statusCode);
  }
};

// PUT: /attachment/:attachmentId
export const updateAttachment = async (req: Request, res: Response) => {
  try {
    const attachmentId = req.params.attachmentId;
    const { name, url } = req.body;

    const updatedAttachment = await updateExistingAttachment(
      attachmentId,
      name,
      url,
      req.instructor.id
    );

    sendSuccess(res, updatedAttachment, "Attachment updated successfully");
  } catch (err: any) {
    const statusCode = err.message.includes("Unauthorized") ? 403 : 404;
    sendError(res, err.message, statusCode);
  }
};

// DELETE: /attachment/:attachmentId
export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const attachmentId = req.params.attachmentId;

    await deleteAttachmentService(attachmentId, req.instructor.id);
    sendSuccess(res, null, "Attachment deleted successfully");
  } catch (err: any) {
    const statusCode = err.message.includes("Unauthorized") ? 403 : 404;
    sendError(res, err.message, statusCode);
  }
};
