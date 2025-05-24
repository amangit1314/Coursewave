import express, { Request, Response } from "express";
import { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyToken } from "../middleware/auth";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get user's purchases
router.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const purchases = await prisma.coursePurchase.findMany({
      where: {
        userId,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error: any) {
    console.log("ERROR in fetching user purchases: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor's sales
router.get("/instructor", verifyToken, async (req: Request, res: Response) => {
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

    const sales = await prisma.coursePurchase.findMany({
      where: {
        course: {
          instructorId: instructor.id,
        },
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor sales: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a course purchase
router.post(
  "/course/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;
      const { stripePaymentIntentId, amount } = req.body;

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: {
          courseId: courseId,
        },
        include: {
          instructor: true,
        },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check if course is published
      if (!course.isPublished) {
        return res.status(400).json({
          success: false,
          message: "This course is not available for purchase",
        });
      }

      // Check if user already purchased the course
      const existingPurchase = await prisma.coursePurchase.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (existingPurchase) {
        return res.status(400).json({
          success: false,
          message: "You have already purchased this course",
        });
      }

      // Create purchase
      const purchase = await prisma.coursePurchase.create({
        data: {
          userId,
          courseId,
          amount,
          stripePaymentId: stripePaymentIntentId,
          paymentMethod: "STRIPE", // Add the required paymentMethod property
          status: "COMPLETED",
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
            },
          },
        },
      });

      // Create enrollment
      // await prisma.courseEnrollment.create({
      //   data: {
      //     userId,
      //     courseId,
      //     status: 'ACTIVE'
      //   }
      // });

      return res.status(201).json({
        success: true,
        data: purchase,
      });
    } catch (error: any) {
      console.log("ERROR in creating course purchase: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get purchase by ID
router.get("/:purchaseId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const purchaseId = req.params.purchaseId;

    const purchase = await prisma.coursePurchase.findUnique({
      where: {
        id: purchaseId,
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
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if user is authorized to view this purchase
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isAdmin = userRoles.some(
      (role: { role: string }) => role.role === "ADMIN"
    );
    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isAdmin && !isInstructor && purchase.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this purchase",
      });
    }

    return res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error: any) {
    console.log("ERROR in fetching purchase: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get purchase analytics for instructor
router.get(
  "/analytics/instructor",
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

      // Get total sales
      const totalSales = await prisma.coursePurchase.aggregate({
        where: {
          course: {
            instructorId: instructor.id,
          },
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
        _count: true,
      });

      // Get sales by course
      const salesByCourse = await prisma.coursePurchase.groupBy({
        by: ["courseId"],
        where: {
          course: {
            instructorId: instructor.id,
          },
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
        _count: true,
      });

      // Get course details for sales breakdown
      // const courseDetails = await prisma.course.findMany({
      //   where: {
      //     courseId: {
      //       in: salesByCourse.map((sale: { courseId: string }) => sale.courseId)
      //     }
      //   },
      //   select: {
      //     id: true,
      //     title: true
      //   }
      // });

      interface SaleBreakdown {
        courseId: string;
        _sum: { amount: number };
        _count: number;
      }

      interface CourseDetail {
        id: string;
        title: string;
      }

      // const salesBreakdown = salesByCourse.map((sale: SaleBreakdown) => ({
      //   courseId: sale.courseId,
      //   courseTitle: courseDetails.find((course: { id: string; title: string }) => course.id === sale.courseId)?.title || 'Unknown',
      //   totalAmount: sale._sum.amount ?? 0,
      //   totalSales: sale._count
      // }));

      return res.status(200).json({
        success: true,
        data: {
          totalSales: totalSales._count,
          totalRevenue: totalSales._sum.amount,
          // salesBreakdown
        },
      });
    } catch (error: any) {
      console.log("ERROR in fetching purchase analytics: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
