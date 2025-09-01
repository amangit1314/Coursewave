import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

export const isCommunityModerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { communityId } = req.params;
    const userId = req.user?.id;

    if (!communityId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Community ID or user ID is missing.",
      });
    }

    const member = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "You are not a member of this community.",
      });
    }

    // Check if the user's role is either ADMIN or MODERATOR
    if (member.role !== "ADMIN" && member.role !== "MODERATOR") {
      return res.status(403).json({
        success: false,
        error: "Access denied. You must be a moderator or admin to perform this action.",
      });
    }

    // User has the required role, proceed
    next();
  } catch (error: any) {
    console.error("ERROR in isCommunityModerator middleware: ", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};