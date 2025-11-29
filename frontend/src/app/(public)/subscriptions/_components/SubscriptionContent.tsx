"use client";

import React from "react";
import { useUserStore } from "@/zustand/userStore";
import { TiTick } from "react-icons/ti";
import ManageUserSubscriptionButton from "./ManageUserSubscriptionButton";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";
import { SubscriptionPlan, UserSubscription } from "@/types/subscription.types";
import { useSubscription } from "@/hooks/useSubscription";
import {
  instructorSubscriptionPlans,
  userSubscriptionPlans,
} from "@/lib/config/subscriptionPlans";
import { useCurrencyStore } from "@/zustand/currencyStore";
import SubscriptionItem from "./SubscriptionItem";
import ShimmerSubscriptionItem from "./ShimmerSubscriptionItem";

type SubscriptionContentProps = {
  subscriptionPlan: UserSubscription | null;
  userType?: "USER" | "INSTRUCTOR";
};

const SubscriptionContent = ({
  subscriptionPlan,
  userType = "USER",
}: SubscriptionContentProps) => {
  const { user } = useUserStore();

  const userId = user?.id;
  const userEmail = user?.email;

  // Use the hook: no need for local plans/loading state
  const { subscription, plans, loading, subscribeToPlan, cancelSubscription } =
    useSubscription({
      userId,
      userType,
    }); // For instructor, pass instructorId and userType="INSTRUCTOR"

  const dummyFreePlan =
    userType == "USER"
      ? userSubscriptionPlans[0]
      : instructorSubscriptionPlans[0];

  console.log(
  "...............PLANS",
    plans,
    "SUBSCRIPTION",
    subscription,
    "SUBSCRIPTION PLAN PROP",
    subscriptionPlan
  );

// Build actual list: always with free at the front, but avoid duplicates if backend also returns a Free
const actualPlans = [
  dummyFreePlan,
  ...plans.filter(
    (plan) => plan.stripePriceId !== dummyFreePlan.stripePriceId
  ),
];

const selectedPlanId = React.useMemo(() => {
  // If user is subscribed, select matching plan
  if (subscription?.stripePriceId) {
    const currentPlan = actualPlans.find(
      (plan) => plan.stripePriceId === subscription.stripePriceId
    );
    if (currentPlan) return currentPlan.id;
  }
  // If not subscribed, select dummyFreePlan
  return dummyFreePlan.id;
}, [actualPlans, subscription, dummyFreePlan]);

if (!userId || !userEmail) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-zinc-600 dark:text-zinc-400">
        Please log in to view subscription plans.
      </p>
    </div>
  );
}

if (loading) {
  return (
    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      <ShimmerSubscriptionItem />
      <ShimmerSubscriptionItem />
      <ShimmerSubscriptionItem />
    </div>
  );
}

return (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    {/* Billing subscription header */}
    <div className="mb-8">
      <h1
        className={`${dmSans.className} text-2xl font-bold text-zinc-900 dark:text-white`}
      >
        Billing & Subscription
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Keep track of your subscription details, update your billing
        information, and control your account's payment
      </p>
    </div>

    {/* Main content area */}
    <div className="w-full">
      {/* Available Plans Section */}
      <div className="mb-8">
        <h2
          className={`${dmSans.className} mb-4 text-xl font-bold text-zinc-900 dark:text-white`}
        >
          Available Plans
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {actualPlans
            .filter((plan) => plan.type === "USER")
            .map((plan: SubscriptionPlan) => {
              const isSelected = plan.id === selectedPlanId;
              const isDummyFreePlan =
                plan.stripePriceId === dummyFreePlan.stripePriceId;
              const isOnlyFreePlan = actualPlans.length === 1;
              const isSubscribed =
                !!subscription && subscription.isSubscribed;
              const canUpgrade = actualPlans.some(
                (p) => p.price > plan.price
              );
              const canCancel =
                !!subscription &&
                subscription.isSubscribed &&
                !isDummyFreePlan;

              return (
                <SubscriptionItem
                  key={plan.id}
                  plan={plan}
                  isSelected={isSelected}
                  canUpgrade={canUpgrade}
                  isSubscribed={isSubscribed}
                  isDummyFreePlan={isDummyFreePlan}
                  isOnlyFreePlan={isOnlyFreePlan}
                  canCancel={canCancel}
                  subscribeToPlan={subscribeToPlan}
                  cancelSubscription={cancelSubscription}
                />
              );
            })}
        </div>
      </div>
    </div>
  </div>
);
};

export default SubscriptionContent;
