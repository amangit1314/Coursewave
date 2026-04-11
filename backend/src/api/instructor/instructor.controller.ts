import { Request, Response } from "express";
import * as instructorsService from "./instructor.service";
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

export const getMyInstructorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await instructorsService.getInstructorProfile(
      requireUserId(req)
    );
    sendSuccess(res, profile, "Instructor profile fetched successfully");
  }
);

export const getMyInstructorAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await instructorsService.getInstructorAnalytics(
      requireUserId(req)
    );
    sendSuccess(res, analytics, "Instructor analytics fetched successfully");
  }
);

export const getMyInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = await instructorsService.getInstructorCourses(
      requireUserId(req)
    );
    sendSuccess(res, courses, "Instructor courses fetched successfully");
  }
);

export const getMyInstructorStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await instructorsService.getInstructorStudents(
      requireUserId(req)
    );
    sendSuccess(res, count, "Instructor students count fetched successfully");
  }
);

export const getMyInstructorStudentsList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await instructorsService.getInstructorStudentsList(
      requireUserId(req)
    );
    sendSuccess(res, data, "Instructor students list fetched successfully");
  }
);

export const getMyInstructorEarnings = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await instructorsService.getInstructorEarnings(
      requireUserId(req)
    );
    sendSuccess(res, data, "Instructor earnings fetched successfully");
  }
);

export const getMyCourseEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }
    const data = await instructorsService.getCourseEnrollments(
      requireUserId(req),
      courseId
    );
    sendSuccess(res, data, "Course enrollments fetched successfully");
  }
);

export const getMyInstructorReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await instructorsService.getMyReviews(requireUserId(req));
    sendSuccess(res, data, "Instructor reviews fetched successfully");
  }
);

export const getPublicInstructorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.params.instructorid || "";
    const profile = await instructorsService.getInstructorProfile(instructorId);
    sendSuccess(res, profile, "Instructor profile fetched successfully");
  }
);

export const getPublicInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.params.instructorid || "";
    const courses =
      await instructorsService.getPublicInstructorCourses(instructorId);
    sendSuccess(res, courses, "Public instructor courses fetched successfully");
  }
);

export const getPublicInstructorAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.params.instructorid || "";
    const analytics =
      await instructorsService.getPublicInstructorAnalytics(instructorId);
    sendSuccess(res, analytics, "Public instructor analytics fetched successfully");
  }
);
