import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ownsCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    console.log("[ownsCourse] Checking course ownership for courseId:", req.params.courseId);

    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
    });

    console.log("[ownsCourse] Course lookup result:", course ? "Found" : "Not found");

    if (!course) {
      console.log("[ownsCourse] Course not found, sending 404");
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructorId !== req.instructor.id) {
      console.log("[ownsCourse] Instructor ID mismatch. User does not own this course. Sending 403");
      return res.status(403).json({
        success: false,
        message: "You don't own this course",
      });
    }

    console.log("[ownsCourse] Ownership verified, proceeding to next middleware");

    next();
  } catch (error) {
    next(error);
  }
}
