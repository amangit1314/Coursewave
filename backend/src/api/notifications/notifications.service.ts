import { PrismaClient } from "@prisma/client";
import { generateResourceId } from "../../core/utils/idGenerator";

const prisma = new PrismaClient();

export const NotificationsService = {
    /**
     * Get notifications for a user
     */
    getUserNotifications: async (
        userId: string,
        page: number = 1,
        limit: number = 20,
        filter?: { read?: boolean; type?: string }
    ) => {
        const skip = (page - 1) * limit;
        const where: any = { userId };

        if (filter?.read !== undefined) {
            where.read = filter.read;
        }
        if (filter?.type) {
            where.type = filter.type;
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { sentAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where }),
        ]);

        const unreadCount = await prisma.notification.count({
            where: { userId, read: false },
        });

        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            unreadCount,
        };
    },

    /**
     * Mark a notification as read
     */
    markAsRead: async (notificationId: string, userId: string) => {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new Error("Notification not found");
        }

        if (notification.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await prisma.notification.update({
            where: { id: notificationId },
            data: {
                read: true,
                viewedAt: new Date(),
            },
        });
    },

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: async (userId: string) => {
        return await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
                viewedAt: new Date(),
            },
        });
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (notificationId: string, userId: string) => {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new Error("Notification not found");
        }

        if (notification.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await prisma.notification.delete({
            where: { id: notificationId },
        });
    },

    /**
     * Create a notification (Internal use)
     */
    createNotification: async (data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        role?: string;
        link?: string;
        data?: any;
        channel?: string;
    }) => {
        return await prisma.notification.create({
            data: {
                id: generateResourceId("notif"),
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type,
                role: data.role || "user",
                link: data.link,
                data: data.data,
                channel: data.channel || "in-app",
                sentAt: new Date(),
            },
        });
    },
};
