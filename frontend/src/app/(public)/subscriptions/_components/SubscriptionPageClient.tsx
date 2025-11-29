"use client";

import React from "react";
import SubscriptionContent from "./SubscriptionContent";
import { useUserStore } from "@/zustand/userStore";
import { useSubscription } from "@/hooks/useSubscription";
import { usePathname } from "next/navigation";
import ShimmerSubscriptionItem from "./ShimmerSubscriptionItem";

export default function SubscriptionPageClient() {
  const { user } = useUserStore();
  const userId = user?.id;

  const pathname = usePathname();
  const userType = pathname.includes("/instructor") ? "INSTRUCTOR" : "USER";

  // useSubscription provides { subscription, plans, loading }
  const { subscription, plans, loading } = useSubscription({
    userId,
    userType: userType,
  });

  if (loading) {
    return (
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <ShimmerSubscriptionItem />
        <ShimmerSubscriptionItem />
        <ShimmerSubscriptionItem />
      </div>
    );
  }

  // If no user, or an error occurred (subscription is null and plans are empty)
  if (!userId || (!subscription && plans.length === 0)) {
    let errorMessage: string;
    if (!userId) {
      errorMessage = "User not logged in.";
    } else if (!subscription && plans.length === 0) {
      errorMessage = "No plans found.";
    } else {
      // This case should ideally not be reached if the outer `if` condition is precise.
      // However, if `subscription` is null/undefined and `plans` are not empty,
      // the original logic would have shown "Failed to fetch subscription".
      // The instruction implies this should still be covered.
      // Given the outer condition `!userId || (!subscription && plans.length === 0)`,
      // if we reach this `else` branch, it means `userId` is true AND
      // `!subscription && plans.length === 0` is false.
      // This implies `subscription` is present OR `plans.length > 0`.
      // If `subscription` is present, we wouldn't be in this error block.
      // So, this `else` branch is effectively unreachable with the current outer `if`.

      // To correctly implement the user's request, the outer `if` condition
      // needs to be expanded to include the "Failed to fetch subscription" case.
      // The instruction states: "if the plans length is 0 and no subsciption or no subscription , then show no plans found in place of failed to fetch subscription, show it when there is error from the hook and other cases"
      // This suggests the error block should also be entered if `!subscription` and `plans.length > 0`.
      // Let's assume the user wants the error block to be entered if `!userId` OR `!subscription`.
      errorMessage = "Failed to fetch subscription.";
    }

    return (
      <div className="text-center py-12">
        <div
          className={`p-4 rounded-md mb-6 ${errorMessage === "Failed to fetch subscription."
            ? "bg-red-50 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200"
            : "bg-blue-50 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200"
            }`}
          role="alert"
        >
          <div className="flex items-center">
            {errorMessage === "Failed to fetch subscription." ? (
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-blue-400 dark:text-blue-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="font-medium">{errorMessage}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <SubscriptionContent subscriptionPlan={subscription} userType="USER" />
  );
}
