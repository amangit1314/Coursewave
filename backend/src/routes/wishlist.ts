import express, { Request, Response } from 'express';
import { verifyToken } from '../api/auth/auth.middleware';
import { generateResourceId } from '../core/utils/idGenerator';
import { prisma } from '../config/prisma';

const router = express.Router();


// Get user's wishlist
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
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

    return res.status(200).json({
      success: true,
      data: wishlist?.Course || [],
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Add course to wishlist
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
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get or create wishlist for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          id: generateResourceId('wishlist'),
          userId,
          updatedAt: new Date(),
        },
      });
    }

    // Check if course already exists in wishlist
    const existingWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    if (existingWishlist?.Course && existingWishlist.Course.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Course already in wishlist",
      });
    }

    // Add course to wishlist
    await prisma.wishlist.update({
      where: { userId },
      data: {
        Course: {
          connect: { id: courseId },
        },
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course added to wishlist",
    });
  } catch (error) {
    console.error("Error adding course to wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add course to wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Remove course from wishlist
router.delete(
  "/courses/:courseId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      // Check if the wishlist exists
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        include: {
          Course: {
            where: { id: courseId },
          },
        },
      });

      if (!wishlist || wishlist.Course.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found in wishlist",
        });
      }

      // Remove course from wishlist
      await prisma.wishlist.update({
        where: { userId },
        data: {
          Course: {
            disconnect: { id: courseId },
          },
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: "Course removed from wishlist",
      });
    } catch (error) {
      console.error("Error removing course from wishlist:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to remove course from wishlist",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Check if course is in wishlist
router.get("/check/:courseId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        isWishlisted: wishlist?.Course && wishlist.Course.length > 0,
      },
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get wishlist count
router.get("/count", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            Course: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        count: wishlist?._count.Course || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist count",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Clear wishlist
router.delete("/clear", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Clear all courses from wishlist
    await prisma.wishlist.update({
      where: { userId },
      data: {
        Course: {
          set: [],
        },
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function to check if course is wishlisted
export async function isCourseWishlisted(
  userId: string,
  courseId: string
): Promise<boolean> {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    return wishlist?.Course && wishlist.Course.length > 0 || false;
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
}

export default router;
