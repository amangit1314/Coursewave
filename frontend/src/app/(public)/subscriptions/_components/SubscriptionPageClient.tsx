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
