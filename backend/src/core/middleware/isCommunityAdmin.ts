// Assuming this is the path to your new middleware file, e.g., src/core/middleware/communityAuth.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

// Extend the Request type to ensure 'user' is available
declare global {
  namespace Express {
    interface Request {
    //   user?: {
    //     id: string;
    //     email?: string;
    //     name?: string;
    //   };
    }
  }
}

export const isCommunityAdmin = async (
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

    if (member.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied. You must be an admin to perform this action.",
      });
    }

    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    console.error("ERROR in isCommunityAdmin middleware: ", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};