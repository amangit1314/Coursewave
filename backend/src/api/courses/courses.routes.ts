import express, { Request, Response } from "express";
import { Router } from "express";

import {
  addNote,
  createAttachment,
  createChapter,
  createCheckout,
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
  getChapterProgress,
  getCourseProgress,
  getEnrolledCourses,
  getEnrollmentStatus,
  getInstructorCreatedCourses,
  getLearningDashboard,
  updateAttachment,
  updateChapterProgress,
  updateCourse,
  writeReview,
} from "./courses.controller";
import {
  isInstructor,
  requireInstructor,
  resourceSchema,
  validate,
  validateUUID,
  validateUUIDOrCourseId,
  verifyToken,
} from "../../core/middleware";
import { courseExists } from "../../api/courses/middlewares/courseExists.middleware";
import { ownsCourse } from "../../api/courses/middlewares/courseOwnership.middleware";
import { courseSectionExists } from "../../api/courses/middlewares/courseSectionExists.middleware";
import { chapterExists } from "../../api/courses/middlewares/chapterExists.middleware";
import { debugMiddleware } from "../../core/middleware/debugMiddleware";

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
// router.get("/enrolled/courses", verifyToken, getEnrolledCourses);

/// * ================================= Course =====================================

// Get course by ID. Preserves legacy response shape: { success, data, studentCount }
// with studentCount at the root (frontend reads response.data.studentCount).
router.get("/:courseId", courseExists, (req: Request, res: Response) => {
  const course = (req as any).course;
  res.status(200).json({
    success: true,
    data: course,
    studentCount: course.studentCount || 0,
  });
});

// Create course
router.post("/", verifyToken, requireInstructor, createCourse);

// Update course
router.put(
  "/:courseId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  updateCourse
);

// Delete course
router.delete(
  "/:courseId",
  verifyToken,
  requireInstructor,
  ownsCourse,
  deleteCourse
);

// ADD CHECKOUT ROUTE RIGHT HERE - Perfect location!
router.post("/:courseId/checkout", verifyToken, courseExists, createCheckout);

// Also add enrollment status check route
router.get(
  "/:courseId/enrollment-status",
  verifyToken,
  courseExists,
  getEnrollmentStatus
);

///? --------------------------------- SECTIONS --------------------------------------

// Get all sections of a course
router.get(
  "/:courseId/sections",
  verifyToken,
  courseExists,
  getAllCourseSections
);

// Create a section of a course
router.post(
  "/:courseId/sections/",
  verifyToken,
  requireInstructor,
  courseExists,
  ownsCourse,
  createSection
);

// Edit a section of a course
router.put(
  "/:courseId/sections/:sectionId",
  debugMiddleware,
  verifyToken,
  requireInstructor,
  courseExists,
  ownsCourse,
  courseSectionExists,
  editSection
);

// Delete a section of a course
router.delete(
  "/:courseId/sections/:sectionId",
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
  verifyToken,
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
  "/:courseId/course-attachments",
  validateUUIDOrCourseId("courseId"),
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

// Get course progress for authenticated user
router.get("/:courseId/progress", verifyToken, getCourseProgress);

// Update chapter progress and sync course progress
router.put("/chapters/:chapterId/progress", verifyToken, updateChapterProgress);

// Get user's learning dashboard (all enrolled courses progress)
router.get("/learning-dashboard", verifyToken, getLearningDashboard);

// Get specific chapter progress
router.get("/chapters/:chapterId/progress", verifyToken, getChapterProgress);

export default router;
