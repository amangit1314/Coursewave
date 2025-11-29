import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import {
    deleteNotification,
    getUserNotifications,
    markAllAsRead,
    markAsRead,
} from "./notifications.controller";

const router: Router = Router();

// Get all notifications
router.get("/", verifyToken, getUserNotifications);

// Mark all as read
router.put("/read-all", verifyToken, markAllAsRead);

// Mark specific notification as read
router.put("/:id/read", verifyToken, markAsRead);

// Delete notification
router.delete("/:id", verifyToken, deleteNotification);

export default router;
