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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {
              // plans
              //   .filter(
              //     (plan) =>
              //       plan.stripePriceId !==
              //       (subscription?.stripePriceId ||
              //         subscriptionPlan?.stripePriceId)
              //   )

              actualPlans.map((plan: SubscriptionPlan) => {
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

                // Supply a valid Stripe Subscription ID as needed (from backend/user state)
                const stripeSubscriptionId =
                  subscription?.stripeSubscriptionId || "";

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950",
                      isSelected && "ring ring-blue-500"
                    )}
                    onClick={() => {}}
                  >
                    <h3
                      className={`${dmSans.className} mb-2 text-lg font-medium text-zinc-900 dark:text-white`}
                    >
                      {plan.name}
                    </h3>
                    <p className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
                      ${plan.price}{" "}
                      <span
                        className={`${dmSans.className} text-zinc-500 text-xl dark:text-zinc-400 font-normal`}
                      >
                        /{plan.interval?.toLowerCase() || "month"}
                      </span>
                    </p>
                    <ul className="space-y-3">
                      {(plan.whatIncludes || []).map((feature: any) => (
                        <li key={feature} className="flex items-start">
                          <TiTick className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                          <span className="ml-2 text-zinc-700 dark:text-zinc-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <ManageUserSubscriptionButton
                        isCurrentPlan={isSelected}
                        isSubscribed={isSubscribed}
                        isDummyFreePlan={isDummyFreePlan}
                        isOnlyFreePlan={isOnlyFreePlan}
                        canUpgrade={canUpgrade}
                        canCancel={canCancel}
                        onSubscribe={() =>
                          subscribeToPlan({
                            planId: plan.id,
                            stripeSubscriptionId,
                          })
                        }
                        onUpgrade={() =>
                          subscribeToPlan({
                            planId: plan.id,
                            stripeSubscriptionId,
                          })
                        }
                        onCancel={cancelSubscription}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionContent;
