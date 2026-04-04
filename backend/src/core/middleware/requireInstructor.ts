import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

export const requireInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add type to req to fix missing 'user' property error
  const userId = req.user?.id;
  const userRoles = await prisma.userRole.findMany({ where: { userId } });

  const isInstructor = userRoles.some((role) => role.role === "INSTRUCTOR");

  if (!isInstructor) {
    return res.status(403).json({
      success: false,
      message: "Only instructors can access this resource",
    });
  }

  next();
};
