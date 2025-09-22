import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";

// Middleware to verify JWT token for protected routes
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("[verifyToken] Checking Authorization header:", authHeader);
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      console.log("[verifyToken] No token found in header");
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { userId: string };
      console.log("[verifyToken] Token decoded:", decoded);
    } catch (err) {
      console.log("[verifyToken] Error verifying token:", err);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!decoded.userId) {
      console.log("[verifyToken] Decoded token missing userId:", decoded);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Get user from database
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: true,
        },
      });
      console.log("[verifyToken] User fetched from DB:", user ? user.id : null);
    } catch (err) {
      console.log("[verifyToken] Error fetching user from DB:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching user from database",
      });
    }

    if (!user) {
      console.log("[verifyToken] User not found for userId:", decoded.userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles?.map((role: { role: string }) => role.role) || [],
    };
    console.log("[verifyToken] User attached to request:", req.user);

    next();
  } catch (error: any) {
    console.error("[verifyToken] Unexpected error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
