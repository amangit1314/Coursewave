import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function courseSectionExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sectionId = req.body.sectionId || req.params.sectionId;
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId is required",
      });
    }

    const section = await prisma.courseSection.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Attach section to request if needed
    (req as any).section = section;

    next();
  } catch (error: any) {
    console.error("Error in courseSectionExists middleware:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}