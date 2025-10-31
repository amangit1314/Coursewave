// src/hooks/useSubscription.ts
import { useState, useEffect } from "react";
import {
  fetchInstructorSubscription,
  fetchSubscriptionPlans,
  fetchUserSubscription,
  requestSubscribeToPlan,
  requestCancelSubscription,
} from "@/lib/api/services/subscriptionService";
import { UserSubscription, SubscriptionPlan } from "@/types/subscription.types";

type UseSubscriptionArgs = {
  userId?: string;
  instructorId?: string;
  userType?: "USER" | "INSTRUCTOR";
};

export function useSubscription({
  userId,
  instructorId,
  userType = "USER",
}: UseSubscriptionArgs) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load subscription state and plans
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let subs: UserSubscription | null = null;
        if (userType === "USER" && userId) {
          subs = await fetchUserSubscription(userId);
        }
        if (userType === "INSTRUCTOR" && instructorId) {
          subs = await fetchInstructorSubscription(instructorId);
        }
        setSubscription(subs);
        setPlans(await fetchSubscriptionPlans());
      } catch (err) {
        setSubscription(null);
        setPlans([]);
        setError("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, instructorId, userType]);

  // SUBSCRIBE or UPGRADE to a plan
  async function subscribeToPlan({
    planId,
    stripeSubscriptionId,
  }: {
    planId: string;
    stripeSubscriptionId: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      await requestSubscribeToPlan(planId, stripeSubscriptionId, userType);
      // Refresh the current subscription info after subscribing
      if (userType === "USER" && userId) {
        setSubscription(await fetchUserSubscription(userId));
      }
      if (userType === "INSTRUCTOR" && instructorId) {
        setSubscription(await fetchInstructorSubscription(instructorId));
      }
    } catch (err) {
      setError("Subscription/upgrade failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // CANCEL the current subscription
  async function cancelSubscription() {
    setLoading(true);
    setError(null);
    try {
      await requestCancelSubscription(userType);
      // Refresh current state after cancellation
      if (userType === "USER" && userId) {
        setSubscription(await fetchUserSubscription(userId));
      }
      if (userType === "INSTRUCTOR" && instructorId) {
        setSubscription(await fetchInstructorSubscription(instructorId));
      }
    } catch (err) {
      setError("Cancellation failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    subscription,
    plans,
    loading,
    error,
    subscribeToPlan,
    cancelSubscription,
  };
}
