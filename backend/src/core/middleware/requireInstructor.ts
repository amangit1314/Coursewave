import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

/**
 * Lightweight instructor role check — reads req.user.roles (populated by
 * verifyToken) so it's zero-query. Used by sessions.routes where we only
 * need to confirm the caller is an instructor without loading their profile.
 *
 * For a version that also attaches req.instructor (the full profile),
 * import { requireInstructor } from "./roleCheck" instead.
 */
export const requireInstructor = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user?.id) {
    throw new AppError("Authentication required", 401);
  }

  if (!req.user.roles?.includes("INSTRUCTOR")) {
    throw new AppError("Only instructors can access this resource", 403);
  }

  next();
};
