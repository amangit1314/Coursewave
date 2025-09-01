import express, { Request, Response } from "express";
import { Router } from "express";
import { prisma } from "../config/prisma";

import { invalidateCache } from "../config/redis";
import { generateResourceId } from "../core/utils/idGenerator";
import { requireInstructor, verifyToken } from "../core/middleware";
import { ownsProject } from "../core/middleware/ownsProject";
import { tuple } from "zod";
// import { ownsProject } from "../core/middleware/ownsProject"; // Assuming this exists

const router: Router = express.Router();

/// ? ================================= PROJECTS ==================================
// Get all projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        // course: true,
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                about: true,
              },
            },
          },
        },
        submissions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    console.log("ERROR in fetching projects: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get submissions for a specific project (only for enrolled users)
router.get(
  "/:projectId/submissions",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if the user is enrolled in the course associated with the project
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: project.courseId,
          status: "ACTIVE",
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          error: "You are not enrolled in the course for this project",
        });
      }

      const submissions = await prisma.projectSubmission.findMany({
        where: {
          projectId,
          studentId: userId, // Only show the logged-in user's submissions
        },
        include: {
          feedback: true,
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        data: submissions,
      });
    } catch (error: any) {
      console.log("ERROR in fetching project submissions: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get specific project submission feedback
router.get(
  "/:projectId/submissions/:submissionId/feedbacks",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { projectId, submissionId } = req.params;
      const userId = req.user.id;

      // Check if the user is enrolled in the course
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: project.courseId,
          status: "ACTIVE",
        },
      });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          error: "You are not enrolled in the course for this project",
        });
      }

      // Find the specific submission and its feedback
      const feedback = await prisma.projectFeedback.findFirst({
        where: {
          submission: {
            id: submissionId,
            projectId: projectId,
            studentId: userId,
          },
        },
        include: {
          instructor: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });

      if (!feedback) {
        return res.status(404).json({
          success: false,
          error: "Feedback not found for this submission",
        });
      }

      return res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error: any) {
      console.log("ERROR in fetching project feedback: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get project by ID
router.get(
  "/:projectId",
  // projectExists, // Middleware to ensure the project exists and fetch it
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          course: true,
          instructor: true,
          submissions: true,
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.log("ERROR in fetching project: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Create project only for instructor
router.post(
  "/",
  verifyToken,
  requireInstructor,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const {
        title,
        description,
        courseId,
        thumbnailUrl,
        deadline,
        maxSubmissions,
        status,
        difficulty,
        isPublic,
        startDate,
        endDate,
        categories,
        tags,
        prerequisites,
        technologies,
        learningOutcomes,
        resources,
      } = req.body;

      const newProject = await prisma.project.create({
        data: {
          title,
          description,
          courseId,
          instructorId: userId,
          thumbnailUrl,
          deadline,
          maxSubmissions,
          status,
          difficulty,
          isPublic,
          startDate,
          endDate,
          categories,
          tags,
          prerequisites,
          technologies,
          learningOutcomes,
          resources,
        },
        include: {
          course: true,
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
        },
      });

      return res.status(201).json({
        success: true,
        data: newProject,
      });
    } catch (error: any) {
      console.log("ERROR in creating project: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Update project only for instructor
router.put(
  "/:projectId",
  verifyToken,
  requireInstructor,
  // Assuming 'ownsProject' middleware exists and verifies instructor ownership
  ownsProject,
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const {
        title,
        description,
        thumbnailUrl,
        deadline,
        maxSubmissions,
        status,
        difficulty,
        isPublic,
        startDate,
        endDate,
        categories,
        tags,
        prerequisites,
        technologies,
        learningOutcomes,
        resources,
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
      if (deadline !== undefined) updateData.deadline = deadline;
      if (maxSubmissions !== undefined)
        updateData.maxSubmissions = maxSubmissions;
      if (status !== undefined) updateData.status = status;
      if (difficulty !== undefined) updateData.difficulty = difficulty;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      if (startDate !== undefined) updateData.startDate = startDate;
      if (endDate !== undefined) updateData.endDate = endDate;
      if (categories !== undefined) updateData.categories = categories;
      if (tags !== undefined) updateData.tags = tags;
      if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
      if (technologies !== undefined) updateData.technologies = technologies;
      if (learningOutcomes !== undefined)
        updateData.learningOutcomes = learningOutcomes;
      if (resources !== undefined) updateData.resources = resources;

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
        include: {
          course: true,
          instructor: true,
        },
      });

      // Invalidate cache if needed
      await invalidateCache.courses(updatedProject.courseId);

      return res.status(200).json({
        success: true,
        data: updatedProject,
      });
    } catch (error: any) {
      console.log("ERROR in updating project: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete project only for instructor
router.delete(
  "/:projectId",
  verifyToken,
  requireInstructor,
  ownsProject, // Ensure the instructor owns the project
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      const project = await prisma.project.delete({
        where: { id: projectId },
      });

      // Invalidate cache if needed
      await invalidateCache.courses(project.courseId);

      return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      console.log("ERROR in deleting project: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
