import { prisma } from "../../config/prisma";
import { generateResourceId } from "../../core/utils/idGenerator";

interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getWishlist = async (userId: string): Promise<ServiceResponse> => {
  try {
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

    return {
      success: true,
      data: wishlist?.Course || [],
      message: "Wishlist fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return {
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
      status: 500,
    };
  }
};

export const addToWishlist = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required",
        status: 400,
      };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return {
        success: false,
        message: "Course not found",
        status: 404,
      };
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          id: generateResourceId("wishlist"),
          userId,
          updatedAt: new Date(),
        },
      });
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    if (existingWishlist?.Course && existingWishlist.Course.length > 0) {
      return {
        success: false,
        message: "Course already in wishlist",
        status: 400,
      };
    }

    await prisma.wishlist.update({
      where: { userId },
      data: {
        Course: {
          connect: { id: courseId },
        },
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Course added to wishlist",
      status: 201,
    };
  } catch (error: any) {
    console.error("Error adding course to wishlist:", error);
    return {
      success: false,
      message: "Failed to add course to wishlist",
      error: error.message,
      status: 500,
    };
  }
};

export const removeFromWishlist = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    if (!wishlist || wishlist.Course.length === 0) {
      return {
        success: false,
        message: "Course not found in wishlist",
        status: 404,
      };
    }

    await prisma.wishlist.update({
      where: { userId },
      data: {
        Course: {
          disconnect: { id: courseId },
        },
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Course removed from wishlist",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error removing course from wishlist:", error);
    return {
      success: false,
      message: "Failed to remove course from wishlist",
      error: error.message,
      status: 500,
    };
  }
};

export const checkWishlistStatus = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    return {
      success: true,
      data: {
        isWishlisted: wishlist?.Course && wishlist.Course.length > 0,
      },
      message: "Wishlist status checked successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error checking wishlist status:", error);
    return {
      success: false,
      message: "Failed to check wishlist status",
      error: error.message,
      status: 500,
    };
  }
};

export const getWishlistCount = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
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

    return {
      success: true,
      data: {
        count: wishlist?._count.Course || 0,
      },
      message: "Wishlist count fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error fetching wishlist count:", error);
    return {
      success: false,
      message: "Failed to fetch wishlist count",
      error: error.message,
      status: 500,
    };
  }
};

export const clearWishlist = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return {
        success: false,
        message: "Wishlist not found",
        status: 404,
      };
    }

    await prisma.wishlist.update({
      where: { userId },
      data: {
        Course: {
          set: [],
        },
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Wishlist cleared successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error clearing wishlist:", error);
    return {
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
      status: 500,
    };
  }
};

// Helper function to check if course is wishlisted
export const isCourseWishlisted = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        Course: {
          where: { id: courseId },
        },
      },
    });

    return (wishlist?.Course && wishlist.Course.length > 0) || false;
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
};
