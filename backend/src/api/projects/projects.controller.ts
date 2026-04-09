import { Request, Response } from "express";
import * as projectsService from "./projects.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getAllProjects = asyncHandler(
  async (_req: Request, res: Response) => {
    const projects = await projectsService.getAllProjects();
    sendSuccess(res, projects, "Projects fetched successfully");
  }
);

export const submitProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { submissionUrl } = req.body;
  const submission = await projectsService.submitProject(
    projectId,
    requireUserId(req),
    submissionUrl
  );
  sendSuccess(res, submission, "Project submitted successfully", 201);
});

export const getProjectSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const submissions = await projectsService.getProjectSubmissions(
      projectId,
      requireUserId(req)
    );
    sendSuccess(res, submissions, "Project submissions fetched successfully");
  }
);

export const getSubmissionFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId, submissionId } = req.params;
    const feedback = await projectsService.getSubmissionFeedback(
      projectId,
      submissionId,
      requireUserId(req)
    );
    sendSuccess(res, feedback, "Submission feedback fetched successfully");
  }
);

// NOTE: pre-existing bug fixed — old controller passed (projectId, submissionId, userId)
// but the service expected (instructorId, submissionId, feedbackText). The feedbackText
// is now correctly sourced from req.body.
export const giveSubmissionFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const { feedbackText } = req.body;
    const feedback = await projectsService.giveSubmissionFeedback(
      requireUserId(req),
      submissionId,
      feedbackText
    );
    sendSuccess(res, feedback, "Feedback submitted successfully", 201);
  }
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await projectsService.getProjectById(projectId);
    sendSuccess(res, project, "Project fetched successfully");
  }
);

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectsService.createProject(
    requireUserId(req),
    req.body
  );
  sendSuccess(res, project, "Project created successfully", 201);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = await projectsService.updateProject(
    projectId,
    requireUserId(req),
    req.body
  );
  sendSuccess(res, project, "Project updated successfully");
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  await projectsService.deleteProject(projectId, requireUserId(req));
  sendSuccess(res, null, "Project deleted successfully");
});
