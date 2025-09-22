import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../config/prisma";

interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getCart = async (userId: string): Promise<ServiceResponse> => {
  try {
    // Get or create user's cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
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
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id: uuidv4(),
          userId,
          updatedAt: new Date(),
        },
        include: {
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
        },
      });
    }

    return {
      success: true,
      data: cart,
      message: "Cart fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error in getCart service:", error);
    return {
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
      status: 500,
    };
  }
};

export const addToCart = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    // Validate input
    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required",
        status: 400,
      };
    }

    // Check if course exists
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

    // Get or create user's cart
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

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId,
        },
      },
    });

    if (existingItem) {
      return {
        success: false,
        message: "Course is already in your cart",
        status: 400,
      };
    }

    // Add new item to cart
    const newItem = await prisma.cartItem.create({
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

    return {
      success: true,
      data: newItem,
      message: "Course added to cart",
      status: 201,
    };
  } catch (error: any) {
    console.error("Error in addToCart service:", error);
    return {
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
      status: 500,
    };
  }
};

export const removeFromCart = async (
  userId: string,
  courseId: string
): Promise<ServiceResponse> => {
  try {
    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return {
        success: false,
        message: "Cart not found",
        status: 404,
      };
    }

    // Check if item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId,
        },
      },
    });

    if (!cartItem) {
      return {
        success: false,
        message: "Item not found in cart",
        status: 404,
      };
    }

    // Remove item
    await prisma.cartItem.delete({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId,
        },
      },
    });

    return {
      success: true,
      message: "Item removed from cart",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error in removeFromCart service:", error);
    return {
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
      status: 500,
    };
  }
};

export const clearCart = async (userId: string): Promise<ServiceResponse> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return {
      success: true,
      message: "Cart cleared successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error in clearCart service:", error);
    return {
      success: false,
      message: "Failed to clear cart",
      error: error.message,
      status: 500,
    };
  }
};

// Utility functions
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

    return cart?._count.CartItem || 0;
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
