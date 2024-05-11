"use server";

import { db } from "@/lib/db";
import { stripe } from "@/config/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/utils/utils";

const returnUrl = absoluteUrl("/subscription");

export const createStripeUrl = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId!
    }
  })

  if (!userId || !user) {
    throw new Error('Unauthorized');
  }

  const userSubscriptionPlan = await getUserSubscriptionPlan();

  if (userSubscriptionPlan && userSubscriptionPlan.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscriptionPlan.stripeCustomerId,
      return_url: returnUrl
    });

    return { data: stripeSession.url };
  }

  const stripeSessionUrl = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: "Coursewave Pro Subscription",
          description: "Unlimited access to all services ..."
        },
        unit_amount: 2500,
        recurring: {
          interval: "month",
        }
      }
    }],
    metadata: {
      userId
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSessionUrl.url };
}