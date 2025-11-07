/// ======================================================================================

import Stripe from "stripe";
import { prisma } from "../../config/prisma";
import { stripe } from "../../config/stripe";
import {
  SubscriptionPlan,
  SubscriptionStatus,
  UserSubscription,
  InstructorSubscription,
  Prisma,
} from "@prisma/client";
import { ensureStripeCustomerForUser } from "../../core/middleware/ensureStripeCustomerForUser";

// Standardized service response
interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
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
      where: { id: planId },
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

    // ENSURE StripeCustomer exists for the user/stripeCustomerId
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId }, // this will match on 'cus_TMnH8wmVKXBfGx'
    });
    console.log("stripeCustomer found?", stripeCustomer);

    if (!stripeCustomer) {
      // If you expect to always have one, this signals a logic/data issue.
      // In a webhook, you might not know userId, so fallback to finding via email/metadata if needed
      // But in non-webhook context, you likely always have userId.
      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          stripeCustomerId,
          userId,
        },
      });
      console.log("stripeCustomer created:", stripeCustomer);
    }

    const now = new Date();
    let periodEnd = new Date(now);
    if (plan.interval === "MONTHLY") {
      periodEnd.setMonth(now.getMonth() + 1);
    } else if (plan.interval === "YEARLY") {
      periodEnd.setFullYear(now.getFullYear() + 1);
    }

    console.log("About to create UserSubscription for:", {
      userId,
      planId,
      stripeCustomerIdBeingUsed: stripeCustomer.stripeCustomerId,
      actualStripeCustomerRecord: stripeCustomer,
    });

    if (!stripeCustomer)
      throw new Error("StripeCustomer does NOT exist for this id!");

    // Now, create UserSubscription referencing properly the existing StripeCustomer
    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        slug: `subscription-${userId}-${plan.slug}-${Date.now()}`,
        stripeCustomerId: stripeCustomer.stripeCustomerId, // always use Stripe's ID!
        stripeSubscriptionId: stripeSubscriptionId || null,
        status: "ACTIVE",
        currentPeriodStart: now,
        stripePriceId: plan.stripePriceId,
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

export interface SubscribeUserInput {
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  periodStart: Date; // Ensure you are passing a JS Date object, not a timestamp
  periodEnd: Date; // Ensure you are passing a JS Date object, not a timestamp
  status: SubscriptionStatus; // Enum type from your schema (e.g., 'ACTIVE', 'PAST_DUE')
}

// Create user subscription checkout link 
export const subscribeUserCheckoutLink = async (
  userId: string,
  input: SubscribeUserInput
): Promise<UserSubscription & { plan: SubscriptionPlan }> => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: input.planId },
  });

  if (!plan) throw new Error("Subscription plan not found");

  const existing = await prisma.userSubscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (existing) throw new Error("Already has active subscription");

  const subscription = await prisma.userSubscription.create({
    data: {
      userId,
      planId: input.planId,
      slug: `subscription-${userId}-${plan.slug}-${Date.now()}`,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId,
      status: input.status,
      currentPeriodStart: input.periodStart,
      currentPeriodEnd: input.periodEnd,
      endedAt: null,
      canceledAt: null,
      updatedAt: new Date(),
    },
    include: { plan: true },
  });

  return subscription;
};

// Create instructor subscription checkout link 
export const subscribeInstructorCheckoutLink = async (
  instructorId: string,
  input: SubscribeUserInput
): Promise<InstructorSubscription & { plan: SubscriptionPlan }> => {
  try {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: input.planId },
    });

    if (!plan) throw new Error("Subscription plan not found");

    const existing = await prisma.instructorSubscription.findFirst({
      where: { instructorId, status: "ACTIVE" },
    });

    if (existing) throw new Error("Already has active subscription");

    // if (!input.stripeAccountId) {
    //   throw new Error("stripeAccountId is required");
    // }

    const subscription = await prisma.instructorSubscription.create({
      data: {
        instructorId,
        planId: input.planId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeCustomerId: input.stripeCustomerId,
        stripePriceId: input.stripePriceId,
        slug: `subscription-${instructorId}-${plan.slug}-${Date.now()}`,
        status: input.status,
        currentPeriodStart: input.periodStart,
        currentPeriodEnd: input.periodEnd,
        endedAt: null,
        canceledAt: null,
        updatedAt: new Date(),
      },
      include: { plan: true },
    });

    return subscription;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', err.code);
      console.error('Prisma error message:', err.message);
      throw new Error(`Database error: ${err.message}`);
    }
    throw err;
  }
};


export const getSubscriptionCheckoutUrl = async (
  userId: string,
  planId: string
): Promise<string> => {
  // Get plan from DB
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  const prices = await stripe.prices.list({ limit: 100 });
  console.log(prices.data.map((p) => p.id));

  if (!plan || !plan.stripePriceId) {
    throw new Error("Plan not found or Stripe Price missing");
  }

  // Ensure Stripe customer for the user (implement this according to your logic)
  const stripeCustomerId = await ensureStripeCustomerForUser(userId); // or pass email

  // Generate Stripe Checkout session
  const APP_URL = process.env.APP_URL!;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${APP_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/subscriptions/cancel`,
  });

  console.log("Session info after creation: ", JSON.stringify(session));

  if (!session.url) {
    throw new Error(
      "Stripe session URL missing. Checkout session was not created correctly."
    );
  }

  return session.url;
};

// Map Stripe's status to Prisma enum (add all you need as in your schema)
export function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIAL";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "unpaid":
      return "UNPAID";
    default:
      throw new Error("Unhandled Stripe status: " + status);
  }
}

// Webhook handler (resolves by unique stripeSubscriptionId)
export const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case "customer.subscription.created":
    case "checkout.session.completed":
      await handleSubscriptionCheckoutSessionComplted(event);
      break;
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      // PRISMA V5: if not unique in schema, .findUnique() will fail, so always check first
      const record = await prisma.userSubscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (!record) return;
      await prisma.userSubscription.update({
        where: { id: record.id }, // always unique!
        data: {
          status: mapStripeStatus(subscription.status),
          currentPeriodStart: subscription.start_date
            ? new Date(subscription.start_date * 1000)
            : undefined,
          currentPeriodEnd: subscription.ended_at
            ? new Date(subscription.ended_at * 1000)
            : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
          endedAt: subscription.ended_at
            ? new Date(subscription.ended_at * 1000)
            : null,
          stripePriceId: subscription.items.data[0]?.price.id,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const deleted = event.data.object as Stripe.Subscription;
      const record = await prisma.userSubscription.findUnique({
        where: { stripeSubscriptionId: deleted.id },
      });
      if (!record) return;
      await prisma.userSubscription.update({
        where: { id: record.id },
        data: {
          status: "CANCELED",
          endedAt: deleted.ended_at ? new Date(deleted.ended_at * 1000) : null,
        },
      });
      break;
    }
    case "invoice.payment_failed":
      // todo: ...Implement PAST_DUE logic as needed
      break;
    default:
      break;
  }
};

// Stripe billing portal remains unchanged.
export const getStripeBillingPortal = async (
  stripeCustomerId: string,
  returnUrl: string
) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
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
        // stripeAccountId,
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

/// ============================================================================================
export const handleSubscriptionCheckoutSessionComplted = async (
  event: Stripe.Event
) => {
  {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    // Retrieve full Stripe subscription for all needed fields
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    // Find the matching SubscriptionPlan using price ID
    const priceId = stripeSub.items.data[0]?.price.id || "";
    const plan = await prisma.subscriptionPlan.findFirst({
      where: { stripePriceId: priceId },
    });

    // Prepare model input for creation/provision
    const input: SubscribeUserInput = {
      planId: plan?.id ?? "", // fallback
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId: priceId,
      periodStart: stripeSub.start_date
        ? new Date(stripeSub.start_date * 1000)
        : new Date(),
      periodEnd: stripeSub.ended_at
        ? new Date(stripeSub.ended_at * 1000)
        : new Date(),
      status: mapStripeStatus(stripeSub.status),
    };

    // Provision subscription for user: find user by email metadata or session.customer_email if not passed as ID
    // For brevity assume customer metadata was set, otherwise query User by email
    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId },
    });
    if (!stripeCustomer) return null;
    const user = await prisma.user.findUnique({
      where: { id: stripeCustomer.userId },
    });

    if (user) {
      await subscribeUser(user.id, input);
    }
  }
};

// Webhook handler for subscription update
export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  // PRISMA V5: if not unique in schema, .findUnique() will fail, so always check first
  const record = await prisma.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!record) return;
  await prisma.userSubscription.update({
    where: { id: record.id }, // always unique!
    data: {
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: subscription.start_date
        ? new Date(subscription.start_date * 1000)
        : undefined,
      currentPeriodEnd: subscription.ended_at
        ? new Date(subscription.ended_at * 1000)
        : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      endedAt: subscription.ended_at
        ? new Date(subscription.ended_at * 1000)
        : null,
      stripePriceId: subscription.items.data[0]?.price.id,
    },
  });
};

// Webhook handler for subscription delete
export const handleSubscriptionDeleted = async (event: Stripe.Event) => {
  const deleted = event.data.object as Stripe.Subscription;
  const record = await prisma.userSubscription.findUnique({
    where: { stripeSubscriptionId: deleted.id },
  });
  if (!record) return;
  await prisma.userSubscription.update({
    where: { id: record.id },
    data: {
      status: "CANCELED",
      endedAt: deleted.ended_at ? new Date(deleted.ended_at * 1000) : null,
    },
  });
};
