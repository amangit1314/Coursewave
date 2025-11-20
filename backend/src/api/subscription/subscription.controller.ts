import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";
import { prisma } from "../../config/prisma";
import { ensureStripeCustomerForUser } from "../../core/middleware/ensureStripeCustomerForUser";
import Stripe from "stripe";
import { mapStripeStatus, SubscribeUserInput } from "./subscription.service";
import { stripe } from "../../config/stripe";

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.getSubscriptionPlans();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.getUserSubscriptions(
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    console.log("SERVER ERROR ON USER SUBSCRIPTION: ", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getInstructorSubscriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await subscriptionService.getInstructorSubscriptions(
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    console.log("SERVER ERROR ON INSTRUCTOR SUBSCRIPTION: ", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Helper to map Stripe Subscription to your SubscribeUserInput
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
    status: mapStripeStatus(sub.status), // use the mapping function you wrote earlier
  };
}

export const createSubscriptionCheckoutLink = async (
  req: Request,
  res: Response
) => {
  try {
    const { planId } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan || !plan.stripePriceId) {
      return res.status(400).json({
        success: false,
        message: "Plan not found or Stripe Price missing",
      });
    }

    // Ensure StripeCustomer for the user (recommended, OR pass customer_email below)
    const stripeCustomerId = await ensureStripeCustomerForUser(
      req.user?.id || "",
      req.user?.email
    );

    const APP_URL = process.env.APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId, // ensures ties to user
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

    // Send Checkout Session URL (frontend should redirect)
    res.json({ url: session.url, success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const url = await subscriptionService.getSubscriptionCheckoutUrl(
      req.user?.id || "",
      planId
    );
    // res.json({ success: true, url });
    res.json({ success: true, data: { url } });
  } catch (error: any) {
    console.log(
      "SERVER ERROR ON CREATE CHECKOUT SESSION: ",
      JSON.stringify(error)
    );
    res.status(500).json({ success: false, error: error.message });
  }
};

// In your controller:
export const subscribeUser = async (req: Request, res: Response) => {
  try {
    const { planId, stripeSubscriptionId } = req.body;

    if (!stripeSubscriptionId || typeof stripeSubscriptionId !== "string") {
      console.log(
        "stripeSubscriptionId is NOT ACCEPTABLE, [VALUE]: ",
        stripeSubscriptionId
      );
      return res.status(400).json({
        success: false,
        error: "Missing or invalid Stripe subscription ID.",
      });
    }

    // Load the active Stripe Subscription object (from Checkout/session/webhook/Stripe API)
    const stripeSub: Stripe.Subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    // Build input for your service
    const input: SubscribeUserInput = getInputFromStripe(stripeSub, planId);

    // Call service method
    const result = await subscriptionService.subscribeUserCheckoutLink(
      req.user?.id || "",
      input
    );

    res.status(201).json({
      success: true,
      data: result,
      message: "Subscription created successfully",
    });
  } catch (error: any) {
    console.log("SERVER ERROR ON SUBSCRIBE: ", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const subscribeInstructor = async (req: Request, res: Response) => {
  try {
    const { planId, stripeSubscriptionId } = req.body;

    // Always ensure StripeCustomer exists for the user (and created on Stripe if missing)
    const stripeCustomerId = await ensureStripeCustomerForUser(
      req.user?.id || "",
      req.user?.email
    );

    const result = await subscriptionService.subscribeInstructor(
      req.user?.id || "",
      {
        planId,
        stripeSubscriptionId,
        stripeCustomerId,
      }
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const cancelUserSubscription = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.cancelUserSubscription(
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const cancelInstructorSubscription = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await subscriptionService.cancelInstructorSubscription(
      req.user?.id || ""
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
