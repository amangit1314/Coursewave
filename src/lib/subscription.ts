import { storeSubscriptionPlans } from "./subscriptions"
import { stripe } from "./stripe"
import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(userId: string) {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error("User not found ...")
  }

  const stripeCustomer = await db.stripeCustomer.findFirst({
    where: {
      userId: user.id,
    }
  })

  if (!stripeCustomer) {
    throw new Error("No customer found with this id ...")
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId: stripeCustomer.userId,
    }
  });

  if (!subscription) return null;

  // Check if user is on a pro plan.
  const isPro =
    stripeCustomer?.stripePriceId! &&
    stripeCustomer?.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()

  // -------------------
  const plan = isPro ? storeSubscriptionPlans.find((p) => p.stripePriceId === stripeCustomer.stripePriceId) : null;

  let isCanceled = false;
  if (isPro && stripeCustomer.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(stripeCustomer.stripeSubscriptionId);
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    ...subscription,
    stripeSubscriptionId: stripeCustomer.stripeSubscriptionId,
    stripeCurrentPeriodEnd: stripeCustomer?.stripeCurrentPeriodEnd?.getTime(),
    stripeCustomerId: stripeCustomer.stripeCustomerId,
    isPro: !!isPro,
    isSubscribed: !!isPro,
    isCanceled: isCanceled,
  }
}