import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function chapterExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const chapterId = req.body.chapterId || req.params.chapterId;
    const sectionId = req.body.sectionId || req.params.sectionId;

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "chapterId is required",
      });
    }
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId is required",
      });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    if (chapter.sectionId !== sectionId) {
      return res.status(404).json({
        success: false,
        message: "Chapter does not belong to the specified section",
      });
    }

    (req as any).chapter = chapter;
    next();
  } catch (error: any) {
    console.error("Error in chapterExists middleware:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
