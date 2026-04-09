import { Request, Response } from "express";
import * as userService from "./users.service";
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

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers(requireUserId(req));
  sendSuccess(res, users, "Users fetched successfully");
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId, requireUserId(req));
  sendSuccess(res, user, "User details successfully accessed");
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserProfile(requireUserId(req));
  sendSuccess(res, user, "User details successfully accessed");
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const updated = await userService.updateUserProfile(requireUserId(req), req.body);
  sendSuccess(res, updated, "Profile updated successfully");
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await userService.changePassword(requireUserId(req), req.body);
  sendSuccess(res, null, "Password changed successfully");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.userId, requireUserId(req));
  sendSuccess(res, null, "User deleted successfully");
});

export const deleteSelf = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteSelf(requireUserId(req));
  sendSuccess(res, null, "User deleted successfully");
});

export const getUserArticles = asyncHandler(async (req: Request, res: Response) => {
  const articles = await userService.getUserArticles(requireUserId(req));
  sendSuccess(res, articles, "User created articles fetched successfully");
});

export const getSavedArticles = asyncHandler(async (req: Request, res: Response) => {
  const articles = await userService.getSavedArticles(requireUserId(req));
  sendSuccess(res, articles, "Saved articles fetched successfully");
});

export const saveArticle = asyncHandler(async (req: Request, res: Response) => {
  const saved = await userService.saveArticle(requireUserId(req), req.params.articleId);
  sendSuccess(res, saved, "Article saved successfully", 201);
});

export const unsaveArticle = asyncHandler(async (req: Request, res: Response) => {
  await userService.unsaveArticle(requireUserId(req), req.params.articleId);
  sendSuccess(res, null, "Article unsaved successfully");
});

export const checkArticleSaved = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.checkArticleSaved(
    requireUserId(req),
    req.params.articleId
  );
  sendSuccess(
    res,
    result,
    result.isSaved ? "Article is saved" : "Article is not saved"
  );
});

export const getUserEnrollments = asyncHandler(async (req: Request, res: Response) => {
  const enrollments = await userService.getUserEnrollments(requireUserId(req));
  sendSuccess(res, enrollments, "Enrolled courses fetched successfully");
});

export const checkEnrollment = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.checkEnrollment(
    requireUserId(req),
    req.params.courseId
  );
  sendSuccess(res, result, "Enrollment status checked successfully");
});

export const reportUser = asyncHandler(async (req: Request, res: Response) => {
  const { reason, details } = req.body;
  const report = await userService.reportUser(
    requireUserId(req),
    req.params.userId,
    reason,
    details
  );
  sendSuccess(res, report, "User reported successfully", 201);
});
