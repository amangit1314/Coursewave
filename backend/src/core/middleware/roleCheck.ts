import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError, asyncHandler } from "./errorHandler";

// Extend Request interface to include instructor
declare global {
  namespace Express {
    interface Request {
      instructor?: any;
    }
  }
}

/**
 * Middleware to check if the authenticated user has a specific role.
 * Reads roles from req.user (populated by verifyToken) — no DB query.
 */
export const requireRole = (requiredRole: Role) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const roles = req.user?.roles;
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }
    if (!roles?.includes(requiredRole)) {
      throw new AppError(`Access denied. ${requiredRole} role required.`, 403);
    }
    next();
  });

/**
 * Middleware to check if user is an instructor AND attach their instructor
 * profile to req.instructor for downstream handlers. The role check is
 * zero-query (reads req.user.roles); only the profile lookup hits the DB.
 */
export const requireInstructor = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    if (!req.user?.roles?.includes(Role.INSTRUCTOR)) {
      throw new AppError("Only instructors can perform this action", 403);
    }

    const instructor = await prisma.instructor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!instructor) {
      throw new AppError("Instructor profile not found", 404);
    }

    req.instructor = instructor;
    next();
  }
);

/**
 * Lightweight instructor check that only attaches req.instructor if present.
 * Used on routes where we want the instructor profile but already know the
 * user is an instructor (e.g. after requireInstructor has already run).
 */
export const isInstructor = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new AppError("Instructor access required", 403);
    }

    req.instructor = instructor;
    next();
  }
);

export const requireAdmin = requireRole(Role.ADMIN);
export const requireModerator = requireRole(Role.MODERATOR);
export const requireSupport = requireRole(Role.USER);
