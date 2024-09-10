import { storeSubscriptionPlans } from "./subscriptionPlans";
import { stripe } from "../config/stripe";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { decrypt } from "@/helpers/jwt-helper";

export const getUserSubscriptionPlan = async () => {
  const token = cookies().get("token")?.value;

  if (!token) {
    console.log(`Token is missing ⚠, Login first ....`);
    throw new Error(`Token is missing ⚠, Login first ....`);
  }

  const decryptedToken = await decrypt(token);
  const userId = decryptedToken.id;

  if (!userId) {
    console.log("No userId is provided ...");
    throw new Error(`TOKEN: ${token}, ERROR: user id not found 🤦‍♂️⚠...`);
  }

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found ...");
  }

  console.log("user in subscription.ts: ", user);

  const stripeCustomer = await db.stripeCustomer.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!stripeCustomer) {
    throw new Error("No customer found with this id ...");
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId: stripeCustomer.userId,
    },
  });

  if (!subscription) return null;

  const isPro =
    stripeCustomer?.stripePriceId! &&
    stripeCustomer?.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 >
      Date.now();

  const plan = isPro
    ? storeSubscriptionPlans.find(
        (p) => p.stripePriceId === stripeCustomer.stripePriceId
      )
    : null;

  let isCanceled = false;
  if (isPro && stripeCustomer.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      stripeCustomer.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  console.log("Is user on pro plan: ", isPro);
  console.log("user subscription data: ", subscription);

  return {
    ...plan,
    stripeSubscriptionId: stripeCustomer.stripeSubscriptionId,
    stripeCurrentPeriodEnd: stripeCustomer?.stripeCurrentPeriodEnd?.getTime(),
    stripeCustomerId: stripeCustomer.stripeCustomerId,
    isSubscribed: !!isPro!,
    isCanceled: isCanceled,
  };
};
