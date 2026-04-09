import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";
import { prisma } from "../../config/prisma";
import { ensureStripeCustomerForUser } from "../../core/middleware/ensureStripeCustomerForUser";
import Stripe from "stripe";
import { mapStripeStatus, SubscribeUserInput } from "./subscription.service";
import { stripe } from "../../config/stripe";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getSubscriptionPlans = asyncHandler(
  async (_req: Request, res: Response) => {
    const plans = await subscriptionService.getSubscriptionPlans();
    sendSuccess(res, plans, "Subscription plans fetched successfully");
  }
);

export const getUserSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const subs = await subscriptionService.getUserSubscriptions(requireUserId(req));
    sendSuccess(res, subs, "User subscriptions fetched successfully");
  }
);

export const getInstructorSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const subs = await subscriptionService.getInstructorSubscriptions(
      requireUserId(req)
    );
    sendSuccess(res, subs, "Instructor subscriptions fetched successfully");
  }
);

// Helper to map Stripe Subscription to SubscribeUserInput
function getInputFromStripe(
  sub: Stripe.Subscription,
  planId: string
): SubscribeUserInput {
  return {
    planId,
    stripeCustomerId: sub.customer as string,
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id || "",
    periodStart: sub.start_date ? new Date(sub.start_date * 1000) : new Date(),
    periodEnd: sub.ended_at ? new Date(sub.ended_at * 1000) : new Date(),
    status: mapStripeStatus(sub.status),
  };
}

export const createSubscriptionCheckoutLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan || !plan.stripePriceId) {
      throw new AppError("Plan not found or Stripe Price missing", 400);
    }

    const stripeCustomerId = await ensureStripeCustomerForUser(
      requireUserId(req),
      req.user?.email
    );

    const APP_URL = process.env.APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/subscription/cancel`,
    });

    // NOTE: preserving original response shape — frontend reads `url` at top level
    res.json({ url: session.url, success: true });
  }
);

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId } = req.body;
    const url = await subscriptionService.getSubscriptionCheckoutUrl(
      requireUserId(req),
      planId
    );
    sendSuccess(res, { url });
  }
);

export const subscribeUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId, stripeSubscriptionId } = req.body;

    if (!stripeSubscriptionId || typeof stripeSubscriptionId !== "string") {
      throw new AppError("Missing or invalid Stripe subscription ID.", 400);
    }

    const stripeSub: Stripe.Subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    const input: SubscribeUserInput = getInputFromStripe(stripeSub, planId);

    const result = await subscriptionService.subscribeUserCheckoutLink(
      requireUserId(req),
      input
    );

    sendSuccess(res, result, "Subscription created successfully", 201);
  }
);

export const subscribeInstructor = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId, stripeSubscriptionId } = req.body;
    const userId = requireUserId(req);

    const stripeCustomerId = await ensureStripeCustomerForUser(
      userId,
      req.user?.email
    );

    const result = await subscriptionService.subscribeInstructor(userId, {
      planId,
      stripeSubscriptionId,
      stripeCustomerId,
    });
    sendSuccess(res, result, "Instructor subscription created successfully", 201);
  }
);

export const cancelUserSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    await subscriptionService.cancelUserSubscription(requireUserId(req));
    sendSuccess(res, null, "Subscription cancelled successfully");
  }
);

export const cancelInstructorSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    await subscriptionService.cancelInstructorSubscription(requireUserId(req));
    sendSuccess(res, null, "Subscription cancelled successfully");
  }
);
