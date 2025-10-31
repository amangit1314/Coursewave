"use client";

import React from "react";
import SubscriptionContent from "./SubscriptionContent";
import { useUserStore } from "@/zustand/userStore";
import { useSubscription } from "@/hooks/useSubscription";

export default function SubscriptionPageClient() {
  const { user } = useUserStore();
  const userId = user?.id;

  // useSubscription provides { subscription, plans, loading }
  const { subscription, plans, loading } = useSubscription({
    userId,
    userType: "USER",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user, or an error occurred (subscription is null and plans are empty)
  if (!userId || (!subscription && plans.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {userId ? "Failed to fetch subscription" : "User not logged in."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
