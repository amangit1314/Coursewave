import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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