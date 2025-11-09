import { Request, Response } from "express";
import * as projectsService from "./projects.service";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const result = await projectsService.getAllProjects();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const submitProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { submissionUrl } = req.body;

    const result = await projectsService.submitProject(
      projectId,
      userId,
      submissionUrl
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    console.log("Internal server error on project submission: ", JSON.stringify(error));
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getProjectSubmissions = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const result = await projectsService.getProjectSubmissions(
      projectId,
      userId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getSubmissionFeedback = async (req: Request, res: Response) => {
  try {
    const { projectId, submissionId } = req.params;
    const userId = req.user.id;

    const result = await projectsService.getSubmissionFeedback(
      projectId,
      submissionId,
      userId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const giveSubmissionFeedback = async (req: Request, res: Response) => {
  try {
    const { projectId, submissionId } = req.params;
    const userId = req.user.id;

    const result = await projectsService.giveSubmissionFeedback(
      projectId,
      submissionId,
      userId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await projectsService.getProjectById(projectId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const projectData = req.body;

    const result = await projectsService.createProject(userId, projectData);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const projectData = req.body;

    const result = await projectsService.updateProject(
      projectId,
      userId,
      projectData
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const result = await projectsService.deleteProject(projectId, userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};
