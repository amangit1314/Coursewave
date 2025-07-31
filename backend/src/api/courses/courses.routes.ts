import express, { Request, Response } from "express";
import { Router } from "express";

import {
  addNote,
  createAttachment,
  createChapter,
  createCourse,
  createSection,
  deleteAttachment,
  deleteChapter,
  deleteCourse,
  deleteNote,
  deleteReview,
  deleteSection,
  editChapter,
  editNote,
  editReview,
  editSection,
  getAllCourseAttachments,
  getAllCourseNotes,
  getAllCourseSectionChapters,
  getAllCourseSections,
  getAllPublishedCourses,
  getAllReviewsForCourseId,
  getAttachmentById,
  getChapterById,
  getEnrolledCourses,
  getInstructorCreatedCourses,
  updateAttachment,
  updateCourse,
  writeReview,
} from "./courses.controller";
import {
  requireInstructor,
  resourceSchema,
  validate,
  validateUUID,
  verifyToken,
} from "../../core/middleware";
import { courseExists } from "../../api/courses/middlewares/courseExists.middleware";
import { ownsCourse } from "../../api/courses/middlewares/courseOwnership.middleware";
import { courseSectionExists } from "../../api/courses/middlewares/courseSectionExists.middleware";
import { chapterExists } from "../../api/courses/middlewares/chapterExists.middleware";

const router: Router = express.Router();

/// ? ================================= COURSES ==================================
// Get all published courses
router.get("/", getAllPublishedCourses);

// Get instructor's courses
router.get(
  "/instructor/courses",
  verifyToken,
  requireInstructor,
  getInstructorCreatedCourses
);

// Get enrolled courses
router.get("/enrolled/courses", verifyToken, getEnrolledCourses);

/// * ================================= Course =====================================

// Get course by ID
router.get("/:courseId", courseExists, async (req: Request, res: Response) => {
  try {
    const course = (req as any).course;

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
router.post("/", verifyToken, requireInstructor, createCourse);

// Update course
router.put("/:courseId", verifyToken, requireInstructor, ownsCourse, updateCourse);

// Delete course
router.delete(
  "/:courseId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  deleteCourse
);

///? --------------------------------- SECTIONS --------------------------------------

// Get all sections of a course
router.get("/:courseId/sections", verifyToken, courseExists, getAllCourseSections);

// Create a section of a course
router.post(
  "/:courseId/sections/",
  requireInstructor,
  courseExists,
  ownsCourse,
  createSection
);

// Edit a section of a course
router.put(
  "/:courseId/sections/",
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  editSection
);

// Delete a section of a course
router.delete(
  "/:courseId/sections/",
  verifyToken,
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  deleteSection
);

///* -------------------------------- Chapters ----------------------------------------

// Get all chapters of a section of a course by sectionId
router.get(
  "/:courseId/sections/:sectionId/chapters",
  courseExists,
  courseSectionExists,
  getAllCourseSectionChapters
);

// Get chapter by id
router.get(
  "/:courseId/sections/:sectionId/chapters/:chapterId",
  verifyToken,
  courseExists,
  courseSectionExists,
  chapterExists,
  getChapterById
);

// Create chapter in the section
router.post(
  "/:courseId/sections/:sectionId/chapters/",
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  createChapter
);

// Edit chapter (video / title / description)
router.put(
  "/:courseId/sections/:sectionId/chapters/:chapterId",
  verifyToken,
  courseExists,
  requireInstructor,
  ownsCourse,
  courseSectionExists,
  chapterExists,
  editChapter
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
  deleteChapter
);

//! ------------------------------------------ Reviews -------------------------------------------

// Get all reviews of a course paginated
router.get("/:courseId/reviews", courseExists, getAllReviewsForCourseId);

// Write a review for a course
router.post("/:courseId/reviews", verifyToken, courseExists, writeReview);

// Edit review
router.put("/:courseId/reviews/:reviewId", verifyToken, editReview);

// Delete review
router.delete("/:courseId/reviews/:reviewId", verifyToken, deleteReview);

//? ----------------------------------- Chapter Notes Routes ----------------------------------------

/// Get all notes for the chapter (logged in user can see only own created notes)
router.get(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes",
  verifyToken,
  getAllCourseNotes
);

// Add note to chapter
router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes",
  verifyToken,
  addNote
);

// Edit note in chapter
router.put(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes/:noteId",
  verifyToken,
  editNote
);

// Delete note from chapter
router.delete(
  "/:courseId/sections/:sectionId/chapters/:chapterId/notes/:noteId",
  verifyToken,
  deleteNote
);

//* --------------------------------- Course Attachments Routes --------------------------------------

// Get all attachments for a course
router.get(
  "/:courseId/course-attachements",
  validateUUID("courseId"),
  getAllCourseAttachments
);

// Get attachment by ID
router.get(
  "/:courseId/course-attachments/:attachmentId",
  validateUUID("attachmentId"),
  getAttachmentById
);

// Create attachment for a course
router.post(
  "/:courseId/course-attachments",
  verifyToken,
  requireInstructor,
  validate(resourceSchema),
  ownsCourse,
  createAttachment
);

// Update attachment
router.put(
  "/:courseId/course-attachments/:attachmentId",
  verifyToken,
  requireInstructor,
  validateUUID("attachmentId"),
  validate(resourceSchema.partial()),
  updateAttachment
);

// Delete attachment
router.delete(
  "/:courseId/course-attachments/:attachmentId",
  verifyToken,
  requireInstructor,
  validateUUID("attachmentId"),
  deleteAttachment
);

export default router;
