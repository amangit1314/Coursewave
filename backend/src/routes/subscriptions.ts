import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all subscription plans (public)
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error: any) {
    console.log('ERROR in fetching subscription plans: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's subscriptions
router.get('/user', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const subscriptions = await prisma.userSubscription.findMany({
      where: {
        userId
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error: any) {
    console.log('ERROR in fetching user subscriptions: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get instructor's subscriptions
router.get('/instructor', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can access this resource'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    const subscriptions = await prisma.instructorSubscription.findMany({
      where: {
        instructorId: instructor.id
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error: any) {
    console.log('ERROR in fetching instructor subscriptions: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Subscribe to a plan (user)
router.post('/user/subscribe', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId, stripeCustomerId, stripeSubscriptionId, stripePriceId } = req.body;
    
    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId
      }
    });
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }
    
    // Check if plan is for users
    if (plan.type !== 'USER') {
      return res.status(400).json({
        success: false,
        message: 'This plan is not for users'
      });
    }
    
    // Check if user already has an active subscription
    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      }
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription'
      });
    }
    
    // Create subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      include: {
        plan: true
      }
    });
    
    return res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error: any) {
    console.log('ERROR in subscribing to plan: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Subscribe to a plan (instructor)
router.post('/instructor/subscribe', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId, stripeAccountId, stripeSubscriptionId, stripePriceId } = req.body;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can subscribe to instructor plans'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId
      }
    });
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }
    
    // Check if plan is for instructors
    if (plan.type !== 'INSTRUCTOR') {
      return res.status(400).json({
        success: false,
        message: 'This plan is not for instructors'
      });
    }
    
    // Check if instructor already has an active subscription
    const existingSubscription = await prisma.instructorSubscription.findFirst({
      where: {
        instructorId: instructor.id,
        status: 'ACTIVE'
      }
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription'
      });
    }
    
    // Create subscription
    const subscription = await prisma.instructorSubscription.create({
      data: {
        instructorId: instructor.id,
        planId,
        stripeAccountId,
        stripeSubscriptionId,
        stripePriceId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      include: {
        plan: true
      }
    });
    
    return res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error: any) {
    console.log('ERROR in subscribing to plan: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel subscription (user)
router.post('/user/cancel', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Find active subscription
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Update subscription
    await prisma.userSubscription.update({
      where: {
        id: subscription.id
      },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (error: any) {
    console.log('ERROR in canceling subscription: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel subscription (instructor)
router.post('/instructor/cancel', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId
      }
    });
    
    const isInstructor = userRoles.some((role: { role: string }) => role.role === 'INSTRUCTOR');
    
    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can access this resource'
      });
    }
    
    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId
      }
    });
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }
    
    // Find active subscription
    const subscription = await prisma.instructorSubscription.findFirst({
      where: {
        instructorId: instructor.id,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Update subscription
    await prisma.instructorSubscription.update({
      where: {
        id: subscription.id
      },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (error: any) {
    console.log('ERROR in canceling subscription: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 