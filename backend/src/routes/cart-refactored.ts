import express, { Request, Response } from 'express';
import { Router } from 'express';
import { prisma } from '../config/prisma';
import { 
  verifyToken, 
  validateUUID,
  asyncHandler,
  sendSuccess,
  sendNotFound,
  sendError,
  invalidateCacheAfter
} from '../core/middleware';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

// Get user's cart
router.get('/', 
  verifyToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    
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
                        profileImageUrl: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { 
          id: uuidv4(),
          userId,
          updatedAt: new Date()
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
                          profileImageUrl: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    }
    
    sendSuccess(res, cart, 'Cart fetched successfully');
  })
);

// Add item to cart
router.post('/items', 
  verifyToken,
  validateUUID('courseId'),
  invalidateCacheAfter('users', (req) => req.user.id),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { courseId } = req.body;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }
    
    // Get or create user's cart
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { 
          id: uuidv4(),
          userId,
          updatedAt: new Date()
        }
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId
        }
      }
    });
    
    if (existingItem) {
      return sendError(res, 'Course is already in your cart', 400);
    }
    
    // Add new item to cart
    const newItem = await prisma.cartItem.create({
      data: {
        id: uuidv4(),
        cartId: cart.id,
        courseId,
        updatedAt: new Date()
      },
      include: {
        Course: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    sendSuccess(res, newItem, 'Course added to cart', 201);
  })
);

// Remove item from cart
router.delete('/items/:courseId', 
  verifyToken,
  validateUUID('courseId'),
  invalidateCacheAfter('users', (req) => req.user.id),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { courseId } = req.params;
    
    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });
    
    if (!cart) {
      return sendNotFound(res, 'Cart not found');
    }
    
    // Check if item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId
        }
      }
    });
    
    if (!cartItem) {
      return sendNotFound(res, 'Item not found in cart');
    }
    
    // Remove item
    await prisma.cartItem.delete({
      where: {
        cartId_courseId: {
          cartId: cart.id,
          courseId
        }
      }
    });
    
    sendSuccess(res, null, 'Item removed from cart');
  })
);

// Clear cart
router.delete('/', 
  verifyToken,
  invalidateCacheAfter('users', (req) => req.user.id),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
    
    sendSuccess(res, null, 'Cart cleared successfully');
  })
);

export default router; 