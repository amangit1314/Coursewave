import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

export async function isInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { userId: req.user?.id }
    });

    if (!instructor) {
      return res.status(403).json({ 
        success: false,
        message: "Instructor access required"
      });
    }

    req.instructor = instructor;
    next();
  } catch (error) {
    next(error);
  }
}