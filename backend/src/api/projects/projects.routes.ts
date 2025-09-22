import { Router } from "express";
import {
  getAllProjects,
  getProjectSubmissions,
  getSubmissionFeedback,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "./projects.controller";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import { requireInstructor } from "../../core/middleware/roleCheck";
import { ownsProject } from "../../core/middleware/ownsProject";

const router: Router = Router();

// Get all projects (public)
router.get("/", getAllProjects);

// Get project by ID (public)
router.get("/:projectId", getProjectById);

// Get project submissions (authenticated users)
router.get("/:projectId/submissions", verifyToken, getProjectSubmissions);

// Get submission feedback (authenticated users)
router.get(
  "/:projectId/submissions/:submissionId/feedbacks",
  verifyToken,
  getSubmissionFeedback
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
