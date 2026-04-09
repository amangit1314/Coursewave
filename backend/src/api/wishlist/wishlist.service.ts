import { prisma } from "../../config/prisma";
import { generateResourceId } from "../../core/utils/idGenerator";
import { AppError } from "../../core/middleware/errorHandler";

export const getWishlist = async (userId: string) => {
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

  return wishlist?.Course ?? [];
};

export const addToWishlist = async (userId: string, courseId: string) => {
  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    create: {
      id: generateResourceId("wishlist"),
      userId,
      updatedAt: new Date(),
    },
    update: {},
    include: {
      Course: {
        where: { id: courseId },
        select: { id: true },
      },
    },
  });

  if (wishlist.Course.length > 0) {
    throw new AppError("Course already in wishlist", 409);
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

  return null;
};

export const removeFromWishlist = async (userId: string, courseId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      Course: {
        where: { id: courseId },
        select: { id: true },
      },
    },
  });

  if (!wishlist || wishlist.Course.length === 0) {
    throw new AppError("Course not found in wishlist", 404);
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

  return null;
};

export const checkWishlistStatus = async (userId: string, courseId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      Course: {
        where: { id: courseId },
        select: { id: true },
      },
    },
  });

  return {
    isWishlisted: (wishlist?.Course.length ?? 0) > 0,
  };
};

export const getWishlistCount = async (userId: string) => {
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
    count: wishlist?._count.Course ?? 0,
  };
};

export const clearWishlist = async (userId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    throw new AppError("Wishlist not found", 404);
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

  return null;
};

// Internal helper used by other services — returns boolean, swallows errors by design
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
          select: { id: true },
        },
      },
    });

    return (wishlist?.Course.length ?? 0) > 0;
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
};
