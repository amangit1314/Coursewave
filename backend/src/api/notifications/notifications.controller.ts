import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";

export const getUserNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const read = req.query.read === "true" ? true : req.query.read === "false" ? false : undefined;
        const type = req.query.type as string | undefined;

        const result = await NotificationsService.getUserNotifications(
            userId,
            page,
            limit,
            { read, type }
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch notifications",
        });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || "";

        const notification = await NotificationsService.markAsRead(id, userId);

        res.status(200).json({
            success: true,
            data: notification,
            message: "Notification marked as read",
        });
    } catch (error: any) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to mark notification as read",
        });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || "";

        await NotificationsService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error: any) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to mark all notifications as read",
        });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || "";

        await NotificationsService.deleteNotification(id, userId);

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to delete notification",
        });
    }
};
