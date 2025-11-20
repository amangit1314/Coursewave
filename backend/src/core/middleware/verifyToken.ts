import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { sendUnauthorized, sendNotFound, sendError } from "./errorHandler";
import { env } from "../../config/config";
import { logger } from "../utils/logger";
import { UserPayload } from "../../types";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return sendUnauthorized(res, "Access token is required");
    }

    let decoded: { userId: string } | null = null;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    } catch (err) {
      logger.warn("verifyToken: jwt.verify failed", { requestId: req.requestId, error: (err as Error)?.message });
      return sendUnauthorized(res, "Invalid or expired token");
    }

    if (!decoded?.userId) {
      return sendUnauthorized(res, "Invalid token payload");
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { roles: true },
      });
    } catch (err) {
      logger.error("verifyToken: prisma.user.findUnique error", { requestId: req.requestId, error: (err as Error)?.message, userId: decoded.userId });
      return sendError(res, "Error fetching user from database", 500);
    }

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles?.map((r: any) => r.role) || [],
    };
    req.user = payload;

    next();
  } catch (error: any) {
    logger.error("verifyToken: unexpected error", { requestId: req.requestId, error: error?.message });
    return sendUnauthorized(res, "Invalid or expired token");
  }
};
