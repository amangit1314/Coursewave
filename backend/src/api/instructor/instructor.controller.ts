import { Request, Response } from "express";
import * as instructorsService from "./instructor.service";

export const getMyInstructorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await instructorsService.getInstructorProfile(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getMyInstructorAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await instructorsService.getInstructorAnalytics(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getMyInstructorCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await instructorsService.getInstructorCourses(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getMyInstructorStudents = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await instructorsService.getInstructorStudents(userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getPublicInstructorProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const instructorId = req.params.instructorId;
    const result = await instructorsService.getInstructorProfile(instructorId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getPublicInstructorCourses = async (
  req: Request,
  res: Response
) => {
  try {
    const instructorId = req.params.instructorId;
    const result = await instructorsService.getPublicInstructorCourses(
      instructorId
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

export const getPublicInstructorAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const instructorId = req.params.instructorId;
    const result = await instructorsService.getPublicInstructorAnalytics(
      instructorId
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
