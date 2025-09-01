import express, { Request, Response } from "express";
import { Router } from "express";
import { verifyToken } from "../api/auth/auth.middleware";

import { prisma } from '../config/prisma';

const router: Router = express.Router();


// Get all subscription plans (public)
router.get("/plans", async (req: Request, res: Response) => {
  try {
    console.log("Fetching subscription plans...");

    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    console.log(`Found ${plans.length} subscription plans`);

    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    console.log("ERROR in fetching subscription plans: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user's subscriptions
router.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const subscriptions = await prisma.userSubscription.findMany({
      where: {
        userId,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    console.log("ERROR in fetching user subscriptions: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get instructor's subscriptions
router.get("/instructor", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Check if user is an instructor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access this resource",
      });
    }

    // Get instructor profile
    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor profile not found",
      });
    }

    const subscriptions = await prisma.instructorSubscription.findMany({
      where: {
        instructorId: instructor.userId,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    console.log("ERROR in fetching instructor subscriptions: ", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Subscribe to a plan (user)
router.post(
  "/user/subscribe",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { planId, stripeSubscriptionId, stripeCustomerId } = req.body;

      // Check if plan exists
      const plan = await prisma.subscriptionPlan.findUnique({
        where: {
          id: planId,
        },
      });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Subscription plan not found",
        });
      }

      // Check if user already has an active subscription
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          message: "You already have an active subscription",
        });
      }

      // Create subscription
      const subscription = await prisma.userSubscription.create({
        data: {
          userId,
          planId,
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          updatedAt: new Date(),
        },
        include: {
          plan: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: subscription,
      });
    } catch (error: any) {
      console.log("ERROR in subscribing to plan: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Subscribe to a plan (instructor)
router.post(
  "/instructor/subscribe",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { planId, stripeAccountId, stripeSubscriptionId } = req.body;

      // Check if user is an instructor
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
        },
      });

      const isInstructor = userRoles.some(
        (role: { role: string }) => role.role === "INSTRUCTOR"
      );

      if (!isInstructor) {
        return res.status(403).json({
          success: false,
          message: "Only instructors can subscribe to instructor plans",
        });
      }

      // Get instructor profile
      const instructor = await prisma.instructor.findUnique({
        where: {
          userId,
        },
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor profile not found",
        });
      }

      // Check if plan exists
      const plan = await prisma.subscriptionPlan.findUnique({
        where: {
          id: planId,
        },
      });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Subscription plan not found",
        });
      }

      // Check if instructor already has an active subscription
      const existingSubscription =
        await prisma.instructorSubscription.findFirst({
          where: {
            instructorId: instructor.userId,
            status: "ACTIVE",
          },
        });

      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          message: "You already have an active subscription",
        });
      }

      // Create subscription
      const subscription = await prisma.instructorSubscription.create({
        data: {
          instructorId: instructor.userId,
          planId,
          stripeAccountId,
          stripeSubscriptionId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          updatedAt: new Date(),
        },
        include: {
          plan: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: subscription,
      });
    } catch (error: any) {
      console.log("ERROR in subscribing to plan: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Cancel subscription (user)
router.post(
  "/user/cancel",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      // Find active subscription
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription found",
        });
      }

      // Update subscription
      await prisma.userSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "CANCELED",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully",
      });
    } catch (error: any) {
      console.log("ERROR in canceling subscription: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Cancel subscription (instructor)
router.post(
  "/instructor/cancel",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      // Check if user is an instructor
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
        },
      });

      const isInstructor = userRoles.some(
        (role: { role: string }) => role.role === "INSTRUCTOR"
      );

      if (!isInstructor) {
        return res.status(403).json({
          success: false,
          message: "Only instructors can access this resource",
        });
      }

      // Get instructor profile
      const instructor = await prisma.instructor.findUnique({
        where: {
          userId,
        },
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor profile not found",
        });
      }

      // Find active subscription
      const subscription = await prisma.instructorSubscription.findFirst({
        where: {
          instructorId: instructor.userId,
          status: "ACTIVE",
        },
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription found",
        });
      }

      // Update subscription
      await prisma.instructorSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: "CANCELED",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully",
      });
    } catch (error: any) {
      console.log("ERROR in canceling subscription: ", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
