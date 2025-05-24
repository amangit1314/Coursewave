import express, { Request, Response } from "express";
import { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyToken } from "../middleware/auth";
// import { redisClient } from "../config/redis";
import { generateResourceId } from "../utils/idGenerator";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get user's wishList
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Try to get wishList from Redis cache first
    // const cachedwishList = await redisClient.get(`wishList:${userId}`);

    // if (cachedwishList) {
    //   return res.status(200).json({
    //     success: true,
    //     data: JSON.parse(cachedwishList),
    //     source: "cache",
    //   });
    // }

    // If not in cache, get from database
    const wishList = await prisma.wishList.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });

    if (!wishList) {
      // Create a new wishList if it doesn't exist
      const wishListId = generateResourceId("wishList");
      const newwishList = await prisma.wishList.create({
        data: {
          userId,
        },
        include: {
          courses: true,
        },
      });

      // Cache the new wishList
      // await redisClient.setEx(
      //   `wishList:${userId}`,
      //   3600,
      //   JSON.stringify(newwishList)
      // ); // Cache for 1 hour

      return res.status(201).json({
        success: true,
        data: newwishList,
        source: "database",
      });
    }

    // Cache the wishList
    // await redisClient.setEx(
    //   `wishList:${userId}`,
    //   3600,
    //   JSON.stringify(wishList)
    // ); // Cache for 1 hour

    return res.status(200).json({
      success: true,
      data: wishList,
      source: "database",
    });
  } catch (error) {
    console.error("Error fetching wishList:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishList",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Add course to wishList
router.post("/items", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get or create wishList
    let wishList = await prisma.wishList.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });

    if (!wishList) {
      const wishListId = generateResourceId("wishList");
      wishList = await prisma.wishList.create({
        data: {
          userId,
        },
        include: {
          courses: true,
        },
      });
    }

    // Check if course already exists in wishList
    const isAlreadyWishlisted = await prisma.wishList.findFirst({
      where: {
        userId,
        courses: {
          some: {
            courseId,
          },
        },
      },
    });

    if (isAlreadyWishlisted) {
      return res.status(400).json({
        success: false,
        message: "Course already in wishList",
      });
    }

    // Generate wishList item ID
    const wishListItemId = generateResourceId(userId);

    // Add course to wishList
    const newItem = await prisma.wishList.update({
      where: { userId },
      data: {
        courses: {
          connect: { courseId },
        },
      },
    });

    // Invalidate wishList cache
    // await redisClient.del(`wishList:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Course added to wishList",
      data: newItem,
    });
  } catch (error) {
    console.error("Error adding course to wishList:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add course to wishList",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Remove course from wishList
router.delete(
  "/courses/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      // Check if the wishList exists
      const wishList = await prisma.wishList.findUnique({
        where: {
          userId,
        },
        include: {
          courses: true,
        },
      });

      if (!wishList) {
        return res.status(404).json({
          success: false,
          message: "WishList not found",
        });
      }

      // Check if the course exists in the wishList
      const isCourseInWishList = wishList.courses.some(
        (course) => course.courseId === courseId
      );

      if (!isCourseInWishList) {
        return res.status(400).json({
          success: false,
          message: "Course is not in the wishList",
        });
      }

      // Remove the course from the wishList
      await prisma.wishList.update({
        where: {
          userId,
        },
        data: {
          courses: {
            disconnect: { courseId },
          },
        },
      });

      // Invalidate wishList cache
      // await redisClient.del(`wishList:${userId}`);

      return res.status(200).json({
        success: true,
        message: "Course removed from wishList",
      });
    } catch (error: any) {
      console.error("Error removing course from wishList:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to remove course from wishList",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Move course from wishList to cart
router.post(
  "/courses/:courseId/move-to-cart",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: {
          courseId,
        },
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
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

      // Get wishList
      const wishList = await prisma.wishList.findUnique({
        where: {
          userId,
        },
        include: {
          courses: true,
        },
      });

      if (!wishList || !wishList.courses.some((c) => c.courseId === courseId)) {
        return res.status(400).json({
          success: false,
          message: "Course is not in your wishList",
        });
      }

      // Check if course is already in cart
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          id: `item_${userId}_${courseId}`,
        },
      });

      if (existingCartItem) {
        return res.status(400).json({
          success: false,
          message: "Course is already in your cart",
        });
      }

      // Get or create cart
      let cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            id: `cart_${userId}`,
            userId,
          },
        });
      }

      // Add to cart
      await prisma.cartItem.create({
        data: {
          id: `item_${userId}_${courseId}`,
          userId,
          courseId,
          courseName: course.courseTitle,
          courseInstructorName:
            course.instructor?.user?.name || "Unknown Instructor",
          courseImageUrl: course.courseImage || null,
          coursePrice: course.coursePrice || "0",
        },
      });

      // Remove from wishList
      await prisma.wishList.update({
        where: {
          userId,
        },
        data: {
          courses: {
            disconnect: {
              courseId,
            },
          },
        },
      });

      // Invalidate both caches
      // await redisClient.del(`cart:${userId}`);
      // await redisClient.del(`wishList:${userId}`);

      return res.status(200).json({
        success: true,
        message: "Course moved from wishList to cart",
      });
    } catch (error: any) {
      console.error("Error moving course to cart:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to move course to cart",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
export default router;

export async function isCourseWishlisted(
  userId: string,
  courseId: string
): Promise<boolean> {
  const wishlistedCourse = await prisma.wishList.findFirst({
    where: {
      userId: userId,
      courses: {
        some: {
          courseId: courseId,
        },
      },
    },
  });

  return wishlistedCourse !== null;
}
