import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";


/**
 * Middleware to check if the logged-in user is enrolled in
 * the course where the specified project was created.
 * Assumes projectId (or projectSlug) is passed via req.params or req.body,
 * and req.user.id contains the logged-in user's id.
 */
export const isEnrolledInProjectCourse = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Get userId of the logged-in user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Get projectId from params/body/query
    const { projectId, projectSlug } = req.params || req.body || req.query;
    if (!projectId && !projectSlug) {
      return res.status(400).json({ error: "Project ID or slug required" });
    }

    // 3. Fetch the project to get courseId
    let project;
    if (projectId) {
      project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { courseId: true },
      });
    } else {
      project = await prisma.project.findUnique({
        where: { slug: projectSlug },
        select: { courseId: true },
      });
    }

    if (!project || !project.courseId) {
      return res
        .status(404)
        .json({ error: "Project or associated course not found" });
    }

    const { courseId } = project;

    // 4. Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== "ACTIVE") {
      return res.status(403).json({ error: "Not enrolled in this course" });
    }

    // 5. Proceed to next middleware/controller
    next();
  } catch (err) {
    console.error("Error in isEnrolledInProjectCourse middleware:", err);
    res.status(500).json({ error: "Server error" });
  }
};
