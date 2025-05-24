import express, { Request, Response } from "express";
import { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyToken } from "../middleware/auth";
import { generateResourceId } from "../utils/idGenerator";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all published courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    console.log("ERROR in fetching courses: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get course by ID
router.get("/:courseId", async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
                shortSummary: true,
                about: true,
              },
            },
          },
        },
        categories: true,
        attachments: true,
        sections: {
          include: {
            chapters: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.log("ERROR in fetching course: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create course
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor profile not found",
      });
    }

    const { title, description, price, categories } = req.body;

    const course = await prisma.course.create({
      data: {
        courseId: generateResourceId("course"),
        courseTitle: title,
        courseDescription: description,
        coursePrice: price,
        instructorId: instructor.id,
        categories: {
          connect: categories.map((id: string) => ({ id })),
        },
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        categories: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.log("ERROR in creating course: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update course
router.put("/:courseId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: "Only instructors can update courses",
      });
    }

    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor profile not found",
      });
    }

    // Check if course exists and belongs to instructor
    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructorId !== instructor.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    const { title, description, price, categories, isPublished } = req.body;

    const updatedCourse = await prisma.course.update({
      where: {
        courseId: courseId,
      },
      data: {
        courseTitle: title,
        courseDescription: description,
        coursePrice: price,
        isPublished,
        categories: {
          set: categories.map((id: string) => ({ id })),
        },
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        categories: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error: any) {
    console.log("ERROR in updating course: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete course
router.delete(
  "/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      // Check if user is an instructor
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
        },
      });

      const isInstructor = userRoles.some(
        (role: { role: string }) => role.role === "INSTRUCTOR"
      );

      if (!isInstructor) {
        return res.status(403).json({
          success: false,
          message: "Only instructors can delete courses",
        });
      }

      // Get instructor profile
      const instructor = await prisma.instructor.findUnique({
        where: {
          userId,
        },
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor profile not found",
        });
      }

      // Check if course exists and belongs to instructor
      const course = await prisma.course.findUnique({
        where: {
          courseId: courseId,
        },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      if (course.instructorId !== instructor.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this course",
        });
      }

      await prisma.course.delete({
        where: {
          courseId: courseId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      console.log("ERROR in deleting course: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get instructor's courses
router.get(
  "/instructor/courses",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      // Check if user is an instructor
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
        },
      });

      const isInstructor = userRoles.some(
        (role: { role: string }) => role.role === "INSTRUCTOR"
      );

      if (!isInstructor) {
        return res.status(403).json({
          success: false,
          message: "Only instructors can access this resource",
        });
      }

      // Get instructor profile
      const instructor = await prisma.instructor.findUnique({
        where: {
          userId,
        },
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor profile not found",
        });
      }

      const courses = await prisma.course.findMany({
        where: {
          instructorId: instructor.id,
        },
        include: {
          categories: true,
          sections: {
            include: {
              chapters: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error: any) {
      console.log("ERROR in fetching instructor courses: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get enrolled courses
router.get(
  "/enrolled/courses",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          course: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
              categories: true,
              sections: {
                include: {
                  chapters: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const courses = enrollments.map(
        (enrollment: { course: any }) => enrollment.course
      );

      return res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error: any) {
      console.log("ERROR in fetching enrolled courses: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
