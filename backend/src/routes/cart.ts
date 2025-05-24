import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
// import { redisClient } from '../config/redis';
import { generateResourceId, generateCartItemId } from '../utils/idGenerator';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get user's cart
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as string;
    
    // Try to get cart from Redis cache first
    // const cachedCart = await redisClient.get(`cart:${userId}`);
    
    // if (cachedCart) {
    //   return res.status(200).json({
    //     success: true,
    //     data: JSON.parse(cachedCart),
    //     source: 'cache'
    //   });
    // }
    
    // If not in cache, get from database
    const cart = await prisma.cart.findUnique({
      where: { id: userId as string },
      include: {
        cartItems: true
      }
    });
    
    if (!cart) {
      // Create a new cart if it doesn't exist
      const cartId = generateResourceId('cart');
      const newCart = await prisma.cart.create({
        data: { 
          id: cartId,
          userId 
        },
        include: {
          cartItems: true
        }
      });
      
      // Cache the new cart
      // await redisClient.setEx(`cart:${userId}`, 3600, JSON.stringify(newCart)); // Cache for 1 hour
      
      return res.status(201).json({
        success: true,
        data: newCart,
        source: 'database'
      });
    }
    
    // Cache the cart
    // await redisClient.setEx(`cart:${userId}`, 3600, JSON.stringify(cart)); // Cache for 1 hour
    
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
    const { courseId, quantity = 1 } = req.body;
    
    // Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { courseId: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { id: userId },
      include: {
        cartItems: true
      }
    });
    
    if (!cart) {
      const cartId = generateResourceId('cart');
      cart = await prisma.cart.create({
        data: { 
          id: cartId,
          userId 
        },
        include: {
          cartItems: true
        }
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cart.id,
        courseId
      }
    });
    
    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      
      // Invalidate cart cache
      // await redisClient.del(`cart:${userId}`);
      
      return res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: updatedItem
      });
    }
    
    // Generate cart item ID
    const cartItemId = generateCartItemId(userId, courseId);
    
    // Add new item to cart
    const newItem = await prisma.cartItem.create({
      data: {
        id: cartItemId,
        userId: userId as string,
        // cartId: cart.id,
        courseId,
        quantity,
        courseName: course.courseTitle,
        courseInstructorName: course.instructorName || 'Unknown Instructor',
        courseImageUrl: course.courseImage || null,
        coursePrice: course.coursePrice || '0'
      }
    });
    
    // Invalidate cart cache
    // await redisClient.del(`cart:${userId}`);
    
    return res.status(201).json({
      success: true,
      message: 'Item added to cart',
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

// Update cart item
router.put('/items/:itemId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    // Validate input
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }
    
    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    // Check if cart belongs to user
    if (cartItem.cart?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this cart item'
      });
    }
    
    // Update cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    
    // Invalidate cart cache
    // await redisClient.del(`cart:${userId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Remove item from cart
router.delete('/items/:itemId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    // Check if cart belongs to user
    if (cartItem.cart?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to remove this cart item'
      });
    }
    
    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
    
    // Invalidate cart cache
    // await redisClient.del(`cart:${userId}`);
    
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
    const userId = req.user.id as string;
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { id: userId as string }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cart: cart }
    });
    
    // Invalidate cart cache
    // await redisClient.del(`cart:${userId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Cart cleared'
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