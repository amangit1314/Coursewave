"use client";

import React, { useEffect, useState } from "react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { getUserSubscriptionPlan, UserSubscription } from "@/lib/subscription";
import SubscriptionContent from "./subscription-content";

export default function SubscriptionPageClient() {
  const user = useUserInfo();
  const [subscriptionPlan, setSubscriptionPlan] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserSubscriptionPlan(user.user.id);
        setSubscriptionPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
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
    <SubscriptionContent 
      subscriptionPlan={subscriptionPlan} 
      userType="USER" 
    />
  );
} 