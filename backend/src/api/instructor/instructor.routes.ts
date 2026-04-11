import { Router } from "express";
import {
  getMyInstructorProfile,
  getMyInstructorAnalytics,
  getMyInstructorCourses,
  getMyInstructorStudents,
  getMyInstructorStudentsList,
  getMyInstructorEarnings,
  getMyInstructorReviews,
  getMyCourseEnrollments,
  getPublicInstructorProfile,
  getPublicInstructorCourses,
  getPublicInstructorAnalytics,
} from "./instructor.controller";
import { verifyToken } from "../../core/middleware";
import { requireInstructor } from "../../core/middleware/roleCheck";

const router: Router = Router();

// ------------------------
// AUTHENTICATED INSTRUCTOR ROUTES (my routes)
// ------------------------

// Apply authentication and instructor role check to all /me routes
router.use("/me", verifyToken, requireInstructor);

// Get logged-in instructor profile
router.get("/me/profile", getMyInstructorProfile);

// Get logged-in instructor analytics
router.get("/me/analytics", getMyInstructorAnalytics);

// Get logged-in instructor courses
router.get("/me/courses", getMyInstructorCourses);

// Get logged-in instructor students count
router.get("/me/students", getMyInstructorStudents);

// Get logged-in instructor students list (detailed)
router.get("/me/students/list", getMyInstructorStudentsList);

// Get logged-in instructor earnings (detailed)
router.get("/me/earnings", getMyInstructorEarnings);

// Get all reviews across instructor's courses
router.get("/me/reviews", getMyInstructorReviews);

// Get enrollments for a specific course
router.get("/me/courses/:courseId/enrollments", getMyCourseEnrollments);

// ------------------------
// PUBLIC INSTRUCTOR ROUTES
// ------------------------

// Get public instructor profile by ID
router.get("/:instructorId/profile", getPublicInstructorProfile);

// Get public instructor courses
router.get("/:instructorId/courses", getPublicInstructorCourses);

// Get public instructor analytics
router.get("/:instructorId/analytics", getPublicInstructorAnalytics);

export default router;
