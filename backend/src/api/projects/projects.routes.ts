import { Router } from "express";
import {
  getAllProjects,
  getProjectSubmissions,
  getSubmissionFeedback,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  submitProject,
  giveSubmissionFeedback,
} from "./projects.controller";
import { verifyToken } from "../../core/middleware";
import { requireInstructor } from "../../core/middleware/roleCheck";
import { ownsProject } from "../../core/middleware/ownsProject";
import { isEnrolledInProjectCourse } from "../../core/middleware/isEnrolledInProjectCourse";

const router: Router = Router();

// Get all projects (public)
router.get("/", getAllProjects);

// Get project by ID (public)
router.get("/:projectId", getProjectById);

// submit project (authenticated and enrolled users only)
router.post(
  "/:projectId/submissions",
  verifyToken,
  isEnrolledInProjectCourse,
  submitProject
);

// Get project submissions (authenticated users)
router.get("/:projectId/submissions", verifyToken, getProjectSubmissions);

// Get submission feedback (authenticated users)
router.get(
  "/:projectId/submissions/:submissionId/feedbacks",
  verifyToken,
  getSubmissionFeedback
);

// Give feedback on submission
router.post(
  "/",
  verifyToken,
  requireInstructor,
  ownsProject,
  giveSubmissionFeedback
);

// Create project (instructors only)
router.post("/", verifyToken, requireInstructor, createProject);

// Update project (instructors only + project ownership)
router.put(
  "/:projectId",
  verifyToken,
  requireInstructor,
  ownsProject,
  updateProject
);

// Delete project (instructors only + project ownership)
router.delete(
  "/:projectId",
  verifyToken,
  requireInstructor,
  ownsProject,
  deleteProject
);

export default router;
