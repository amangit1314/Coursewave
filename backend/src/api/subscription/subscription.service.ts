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
import { AppError } from "../../core/middleware/errorHandler";

const requireInstructorProfile = async (userId: string) => {
  const userRoles = await prisma.userRole.findMany({ where: { userId } });
  const isInstructor = userRoles.some(
    (role: { role: string }) => role.role === "INSTRUCTOR"
  );
  if (!isInstructor) {
    throw new AppError("Only instructors can access this resource", 403);
  }

  const instructor = await prisma.instructor.findUnique({ where: { userId } });
  if (!instructor) {
    throw new AppError("Instructor profile not found", 404);
  }

  return instructor;
};

export const getSubscriptionPlans = async () => {
  return prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
};

export const getUserSubscriptions = async (userId: string) => {
  return prisma.userSubscription.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getInstructorSubscriptions = async (userId: string) => {
  const instructor = await requireInstructorProfile(userId);

  return prisma.instructorSubscription.findMany({
    where: { instructorId: instructor.userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });
};

export const subscribeUser = async (userId: string, data: any) => {
  const { planId, stripeSubscriptionId, stripeCustomerId } = data;
  if (!planId || !stripeCustomerId) {
    throw new AppError("Missing required planId or stripeCustomerId", 400);
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });
  if (!plan) {
    throw new AppError("Subscription plan not found", 404);
  }

  const existingSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });
  if (existingSubscription) {
    throw new AppError("You already have an active subscription", 409);
  }

  // ENSURE StripeCustomer exists for the user/stripeCustomerId
  let stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: { stripeCustomerId },
  });

  if (!stripeCustomer) {
    stripeCustomer = await prisma.stripeCustomer.create({
      data: {
        stripeCustomerId,
        userId,
      },
    });
  }

  const now = new Date();
  const periodEnd = new Date(now);
  if (plan.interval === "MONTHLY") {
    periodEnd.setMonth(now.getMonth() + 1);
  } else if (plan.interval === "YEARLY") {
    periodEnd.setFullYear(now.getFullYear() + 1);
  }

  return prisma.userSubscription.create({
    data: {
      userId,
      planId,
      slug: `subscription-${userId}-${plan.slug}-${Date.now()}`,
      stripeCustomerId: stripeCustomer.stripeCustomerId,
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
};

export interface SubscribeUserInput {
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  periodStart: Date;
  periodEnd: Date;
  status: SubscriptionStatus;
}

// Create user subscription checkout link
export const subscribeUserCheckoutLink = async (
  userId: string,
  input: SubscribeUserInput
): Promise<UserSubscription & { plan: SubscriptionPlan }> => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: input.planId },
  });

  if (!plan) throw new AppError("Subscription plan not found", 404);

  const existing = await prisma.userSubscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (existing) throw new AppError("Already has active subscription", 409);

  return prisma.userSubscription.create({
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

    if (!plan) throw new AppError("Subscription plan not found", 404);

    const existing = await prisma.instructorSubscription.findFirst({
      where: { instructorId, status: "ACTIVE" },
    });

    if (existing) throw new AppError("Already has active subscription", 409);

    return await prisma.instructorSubscription.create({
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
  } catch (err) {
    // Load-bearing Prisma-specific catch — preserved from original code
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", err.code);
      console.error("Prisma error message:", err.message);
      throw new AppError(`Database error: ${err.message}`, 500);
    }
    throw err;
  }
};

export const getSubscriptionCheckoutUrl = async (
  userId: string,
  planId: string
): Promise<string> => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || !plan.stripePriceId) {
    throw new AppError("Plan not found or Stripe Price missing", 404);
  }

  const stripeCustomerId = await ensureStripeCustomerForUser(userId);

  const APP_URL = process.env.APP_URL!;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${APP_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/subscriptions/cancel`,
  });

  if (!session.url) {
    throw new AppError(
      "Stripe session URL missing. Checkout session was not created correctly.",
      500
    );
  }

  return session.url;
};

// Map Stripe's status to Prisma enum
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
      const record = await prisma.userSubscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (!record) return;
      await prisma.userSubscription.update({
        where: { id: record.id },
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
      // todo: Implement PAST_DUE logic
      break;
    default:
      break;
  }
};

// Stripe billing portal remains unchanged
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

export const subscribeInstructor = async (userId: string, data: any) => {
  const { planId, stripeSubscriptionId } = data;

  const instructor = await requireInstructorProfile(userId);

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new AppError("Subscription plan not found", 404);
  }

  const existingSubscription = await prisma.instructorSubscription.findFirst({
    where: {
      instructorId: instructor.userId,
      status: "ACTIVE",
    },
  });

  if (existingSubscription) {
    throw new AppError("You already have an active subscription", 409);
  }

  return prisma.instructorSubscription.create({
    data: {
      instructorId: instructor.userId,
      planId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    include: {
      plan: true,
    },
  });
};

export const cancelUserSubscription = async (userId: string) => {
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });

  if (!subscription) {
    throw new AppError("No active subscription found", 404);
  }

  await prisma.userSubscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELED" },
  });

  return null;
};

export const cancelInstructorSubscription = async (userId: string) => {
  const instructor = await requireInstructorProfile(userId);

  const subscription = await prisma.instructorSubscription.findFirst({
    where: {
      instructorId: instructor.userId,
      status: "ACTIVE",
    },
  });

  if (!subscription) {
    throw new AppError("No active subscription found", 404);
  }

  await prisma.instructorSubscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELED" },
  });

  return null;
};

// Utility functions
export const getUserActiveSubscription = async (userId: string) => {
  return prisma.userSubscription.findFirst({
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
  return prisma.instructorSubscription.findFirst({
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
    return prisma.userSubscription.update({
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
    return prisma.instructorSubscription.update({
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

export const handleSubscriptionCheckoutSessionComplted = async (
  event: Stripe.Event
) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const stripeSubscriptionId = session.subscription as string;
  const stripeCustomerId = session.customer as string;

  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const priceId = stripeSub.items.data[0]?.price.id || "";
  const plan = await prisma.subscriptionPlan.findFirst({
    where: { stripePriceId: priceId },
  });

  const input: SubscribeUserInput = {
    planId: plan?.id ?? "",
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
};

// Webhook handler for subscription update
export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const record = await prisma.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!record) return;
  await prisma.userSubscription.update({
    where: { id: record.id },
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
