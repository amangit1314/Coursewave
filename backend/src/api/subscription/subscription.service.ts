import { prisma } from "../../config/prisma";

interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getSubscriptionPlans = async (): Promise<ServiceResponse> => {
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

    return {
      success: true,
      data: plans,
      message: "Subscription plans fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in fetching subscription plans: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch subscription plans",
      status: 500,
    };
  }
};

export const getUserSubscriptions = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
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

    return {
      success: true,
      data: subscriptions,
      message: "User subscriptions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in fetching user subscriptions: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user subscriptions",
      status: 500,
    };
  }
};

export const getInstructorSubscriptions = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return {
        success: false,
        message: "Only instructors can access this resource",
        status: 403,
      };
    }

    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor profile not found",
        status: 404,
      };
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

    return {
      success: true,
      data: subscriptions,
      message: "Instructor subscriptions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in fetching instructor subscriptions: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor subscriptions",
      status: 500,
    };
  }
};

/// DONE, TESTED
export const subscribeUser = async (
  userId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const { planId, stripeSubscriptionId, stripeCustomerId } = data;
    if (!planId || !stripeCustomerId) {
      return {
        success: false,
        message: "Missing required planId or stripeCustomerId",
        status: 400,
      };
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return {
        success: false,
        message: "Subscription plan not found",
        status: 404,
      };
    }

    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      return {
        success: false,
        message: "You already have an active subscription",
        status: 400,
      };
    }

    const now = new Date();
    let periodEnd = new Date(now);
    if (plan.interval === "MONTHLY") {
      periodEnd.setMonth(now.getMonth() + 1);
    } else if (plan.interval === "YEARLY") {
      periodEnd.setFullYear(now.getFullYear() + 1);
    }

    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        slug: plan.slug,
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: stripeSubscriptionId || null,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        endedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        plan: true,
      },
    });

    return {
      success: true,
      data: subscription,
      message: "Subscription created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in subscribing to plan: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to subscribe to plan",
      status: 500,
    };
  }
};

export const subscribeInstructor = async (
  userId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const { planId, stripeAccountId, stripeSubscriptionId } = data;

    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return {
        success: false,
        message: "Only instructors can subscribe to instructor plans",
        status: 403,
      };
    }

    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor profile not found",
        status: 404,
      };
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return {
        success: false,
        message: "Subscription plan not found",
        status: 404,
      };
    }

    const existingSubscription = await prisma.instructorSubscription.findFirst({
      where: {
        instructorId: instructor.userId,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      return {
        success: false,
        message: "You already have an active subscription",
        status: 400,
      };
    }

    const subscription = await prisma.instructorSubscription.create({
      data: {
        instructorId: instructor.userId,
        planId,
        stripeAccountId,
        stripeSubscriptionId,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      include: {
        plan: true,
      },
    });

    return {
      success: true,
      data: subscription,
      message: "Instructor subscription created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in subscribing to plan: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to subscribe to instructor plan",
      status: 500,
    };
  }
};

export const cancelUserSubscription = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return {
        success: false,
        message: "No active subscription found",
        status: 404,
      };
    }

    await prisma.userSubscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "CANCELED",
      },
    });

    return {
      success: true,
      message: "Subscription cancelled successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in canceling subscription: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to cancel subscription",
      status: 500,
    };
  }
};

export const cancelInstructorSubscription = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });

    const isInstructor = userRoles.some(
      (role: { role: string }) => role.role === "INSTRUCTOR"
    );

    if (!isInstructor) {
      return {
        success: false,
        message: "Only instructors can access this resource",
        status: 403,
      };
    }

    const instructor = await prisma.instructor.findUnique({
      where: {
        userId,
      },
    });

    if (!instructor) {
      return {
        success: false,
        message: "Instructor profile not found",
        status: 404,
      };
    }

    const subscription = await prisma.instructorSubscription.findFirst({
      where: {
        instructorId: instructor.userId,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return {
        success: false,
        message: "No active subscription found",
        status: 404,
      };
    }

    await prisma.instructorSubscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "CANCELED",
      },
    });

    return {
      success: true,
      message: "Subscription cancelled successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in canceling subscription: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to cancel instructor subscription",
      status: 500,
    };
  }
};

// Utility functions
export const getUserActiveSubscription = async (userId: string) => {
  return await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
  });
};

export const getInstructorActiveSubscription = async (instructorId: string) => {
  return await prisma.instructorSubscription.findFirst({
    where: {
      instructorId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
  });
};

export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: "ACTIVE" | "CANCELED" | "EXPIRED" | "PAST_DUE",
  type: "user" | "instructor"
) => {
  if (type === "user") {
    return await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: status as
          | "ACTIVE"
          | "CANCELED"
          | "PAST_DUE"
          | "UNPAID"
          | "TRIAL"
          | "INCOMPLETE",
      },
    });
  } else {
    return await prisma.instructorSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: status as
          | "ACTIVE"
          | "CANCELED"
          | "PAST_DUE"
          | "UNPAID"
          | "TRIAL"
          | "INCOMPLETE",
      },
    });
  }
};
