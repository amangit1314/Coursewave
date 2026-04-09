import { Request, Response } from "express";
import * as profileService from "./profile.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await profileService.getAllUsers();
    sendSuccess(res, users, "Users fetched successfully");
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await profileService.getUserById(userId);
    sendSuccess(res, user, "User fetched successfully");
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updated = await profileService.updateUser(userId, req.body);
  sendSuccess(res, updated, "User updated successfully");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await profileService.deleteUser(userId);
  sendSuccess(res, null, "User deleted successfully");
});

export const changeUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    const result = await profileService.changeUserRole(userId, role);
    sendSuccess(res, result, `User role changed to ${result.role} successfully`);
  }
);

export const getUserStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await profileService.getUserStats();
    sendSuccess(res, stats, "User statistics fetched successfully");
  }
);

export const contactSupport = asyncHandler(
  async (req: Request, res: Response) => {
    await profileService.contactSupport(req.body);
    sendSuccess(
      res,
      null,
      "Support request submitted successfully. We'll get back to you soon!"
    );
  }
);

export const becomeInstructor = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const instructor = await profileService.becomeInstructor(userId, req.body);
    sendSuccess(res, instructor, "Successfully registered as an instructor", 201);
  }
);
