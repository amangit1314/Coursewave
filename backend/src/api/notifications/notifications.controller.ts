import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";
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

export const getUserNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const read =
      req.query.read === "true"
        ? true
        : req.query.read === "false"
          ? false
          : undefined;
    const type = req.query.type as string | undefined;

    const result = await NotificationsService.getUserNotifications(
      userId,
      page,
      limit,
      { read, type }
    );

    sendSuccess(res, result);
  }
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = requireUserId(req);

  const notification = await NotificationsService.markAsRead(id, userId);

  sendSuccess(res, notification, "Notification marked as read");
});

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireUserId(req);
    await NotificationsService.markAllAsRead(userId);
    sendSuccess(res, null, "All notifications marked as read");
  }
);

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = requireUserId(req);
    await NotificationsService.deleteNotification(id, userId);
    sendSuccess(res, null, "Notification deleted successfully");
  }
);
