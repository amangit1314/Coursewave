import express, { Request, Response } from "express";
import { Router } from "express";
import { prisma } from "../config/prisma";
import { verifyToken } from "../core/middleware";
import { isCommunityModerator } from "../core/middleware/isCommunityModerator";

const router: Router = express.Router();

// Get all communities (public ones)
router.get("/", async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      where: { isPublic: true },
      include: {
        category: true,
        members: {
          select: {
            user: {
              select: { id: true, name: true, profileImageUrl: true },
            },
            role: true,
            joinedAt: true,
            isOnline: true, // Assuming you have a way to track online status
          },
        }
      },
      orderBy: { lastActiveAt: "desc" },
    });
    return res.status(200).json({ success: true, data: communities });
  } catch (error: any) {
    console.error("ERROR fetching communities:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

// Get a specific community by ID
router.get(
  "/:communityId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { communityId } = req.params;
      const community = await prisma.community.findUnique({
        where: { id: communityId },
        include: {
          category: true,
          members: {
            select: {
              user: {
                select: { id: true, name: true, profileImageUrl: true },
              },
              role: true,
              joinedAt: true,
            },
          },
        },
      });

      if (!community) {
        return res
          .status(404)
          .json({ success: false, error: "Community not found" });
      }

      // You can add logic here to check if the user is a member if the community is private
      // if (!community.isPublic && !isUserMember(req.user.id, community.members)) {
      //   return res.status(403).json({ success: false, error: "Access denied" });
      // }

      return res.status(200).json({ success: true, data: community });
    } catch (error: any) {
      console.error("ERROR fetching community:", error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
);

// Create a new community (requires authentication)
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, description, categoryId, isPublic, tags } = req.body;
    const userId = req.user!.id; // Assuming verifyToken adds `user` to the request

    const newCommunity = await prisma.community.create({
      data: {
        title,
        description,
        categoryId,
        isPublic,
        tags,
        members: {
          create: {
            userId,
            role: "ADMIN", // The creator is automatically an admin
          },
        },
      },
    });

    return res.status(201).json({ success: true, data: newCommunity });
  } catch (error: any) {
    console.error("ERROR creating community:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

// User joins a community
router.post(
  "/:communityId/join",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { communityId } = req.params;
      const userId = req.user!.id;

      const community = await prisma.community.findUnique({
        where: { id: communityId },
      });
      if (!community) {
        return res
          .status(404)
          .json({ success: false, error: "Community not found" });
      }

      const member = await prisma.communityMember.create({
        data: {
          userId,
          communityId,
          role: "MEMBER",
        },
      });

      return res.status(200).json({ success: true, data: member });
    } catch (error: any) {
      console.error("ERROR joining community:", error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
);

// Get messages for a community (requires membership)
router.get(
  "/:communityId/messages",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { communityId } = req.params;
      const userId = req.user!.id;

      // Check if user is a member of the community
      const isMember = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId } },
      });
      if (!isMember) {
        return res
          .status(403)
          .json({
            success: false,
            error: "Access denied. You are not a member of this community.",
          });
      }

      const messages = await prisma.message.findMany({
        where: { communityId },
        include: {
          sender: {
            select: { id: true, name: true, profileImageUrl: true },
          },
          reactions: true,
        },
        orderBy: { createdAt: "asc" },
        take: 50, // Limit to the last 50 messages for initial load
      });

      return res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      console.error("ERROR fetching messages:", error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
);

// Delete a message (requires admin/moderator role)
router.delete(
  "/:communityId/messages/:messageId",
  verifyToken,
  isCommunityModerator,
  async (req: Request, res: Response) => {
    try {
      const { communityId, messageId } = req.params;

      await prisma.message.delete({
        where: { id: messageId, communityId },
      });

      // Log the moderation action
      await prisma.moderationLog.create({
        data: {
          communityId,
          moderatorId: req.user!.id,
          action: "MESSAGE_DELETED",
          targetMessageId: messageId,
          reason: "Message deleted by moderator", // Can be more specific
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Message deleted successfully" });
    } catch (error: any) {
      console.error("ERROR deleting message:", error.message);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
);

export default router;
