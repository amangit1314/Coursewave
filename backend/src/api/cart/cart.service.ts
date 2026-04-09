import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

const cartInclude = {
  CartItem: {
    include: {
      Course: {
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const getCart = async (userId: string) => {
  const existing = await prisma.cart.findFirst({
    where: { userId },
    include: cartInclude,
  });

  if (existing) return existing;

  return prisma.cart.create({
    data: {
      id: uuidv4(),
      userId,
      updatedAt: new Date(),
    },
    include: cartInclude,
  });
};

export const addToCart = async (userId: string, courseId: string) => {
  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        id: uuidv4(),
        userId,
        updatedAt: new Date(),
      },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_courseId: {
        cartId: cart.id,
        courseId,
      },
    },
  });

  if (existingItem) {
    throw new AppError("Course is already in your cart", 409);
  }

  return prisma.cartItem.create({
    data: {
      id: uuidv4(),
      cartId: cart.id,
      courseId,
      updatedAt: new Date(),
    },
    include: {
      Course: {
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const removeFromCart = async (userId: string, courseId: string) => {
  const cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_courseId: {
        cartId: cart.id,
        courseId,
      },
    },
  });

  if (!cartItem) {
    throw new AppError("Item not found in cart", 404);
  }

  await prisma.cartItem.delete({
    where: {
      cartId_courseId: {
        cartId: cart.id,
        courseId,
      },
    },
  });

  return null;
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  return null;
};

// Internal helpers — swallow errors by design
export const getCartItemCount = async (userId: string): Promise<number> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        _count: {
          select: { CartItem: true },
        },
      },
    });

    return cart?._count.CartItem ?? 0;
  } catch (error) {
    console.error("Error getting cart item count:", error);
    return 0;
  }
};

export const isCourseInCart = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) return false;

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId,
        },
      },
    });

    return !!cartItem;
  } catch (error) {
    console.error("Error checking if course is in cart:", error);
    return false;
  }
};
