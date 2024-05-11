import { absoluteUrl } from "@/utils/utils"
import { stripe } from "@/config/stripe";

type manageStripeSubscriptionActionProps = {
  isSubscribed: boolean;
  stripeCustomerId?: string | null;
  isCurrentPlan: boolean;
  email: string;
  stripePriceId: string;
  userId: string;
}

export const manageStripeSubscriptionAction = async ({ isSubscribed, stripeCustomerId, isCurrentPlan, stripePriceId, email, userId }: manageStripeSubscriptionActionProps) => {
  const billingUrl = absoluteUrl("/subscription");

  if (isSubscribed && stripeCustomerId && isCurrentPlan) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: billingUrl,
    })

    return {
      url: stripeSession.url,
    }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      }
    ],
    metadata: {
      userId: userId,
    }
  })

  return {
    url: stripeSession.url,
  }
}