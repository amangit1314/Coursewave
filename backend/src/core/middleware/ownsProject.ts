// src/core/middleware/ownsProject.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      ownedResource?: any;
    }
  }
}

/**
 * Middleware to check if the authenticated instructor owns the project.
 * Attaches the project to req.ownedResource if authorized.
 */
export const ownsProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const user = req.user; // Assuming req.user is set by your auth middleware

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        instructor: true
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.instructorId !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this project"
      });
    }

    // Attach project to request for downstream handlers
    req.ownedResource = project;
    next();
  } catch (error: any) {
    console.error("Project ownership check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking project ownership",
      error: error.message
    });
  }
};
