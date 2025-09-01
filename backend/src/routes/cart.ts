import express, { Request, Response } from 'express';
import { Router } from 'express';

import { verifyToken } from '../api/auth/auth.middleware';
import { invalidateCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/prisma';

const router: Router = express.Router();


// Get user's cart
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as string;
    
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
    
    return res.status(200).json({
      success: true,
      data: cart,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add item to cart
router.post('/items', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as string;
    const { courseId } = req.body;
    
    // Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
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
      return res.status(400).json({
        success: false,
        message: 'Course is already in your cart'
      });
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
    
    // Invalidate cache
    await invalidateCache.users(userId);
    
    return res.status(201).json({
      success: true,
      message: 'Course added to cart',
      data: newItem
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Remove item from cart
router.delete('/items/:courseId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    
    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
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
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
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
    
    // Invalidate cache
    await invalidateCache.users(userId);
    
    return res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clear cart
router.delete('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
    
    // Invalidate cache
    await invalidateCache.users(userId);
    
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 