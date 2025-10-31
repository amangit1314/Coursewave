import {
  instructorSubscriptionPlans,
  userSubscriptionPlans,
} from "@/lib/config/subscriptionPlans";
import { apiManager, ApiResponse, ApiError } from "@/lib/api/api-manager";
import { SubscriptionPlan, UserSubscription } from "@/types/subscription.types";

// Fetch User Subscription
export async function fetchUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  try {
    const res: ApiResponse<any> = await apiManager.get("/subscriptions/user");
    if (!res.success || !res.data) return null;
    const subscription = res.data[0];
    if (!subscription) return null;
    return {
      id: subscription.id,
      name: subscription.plan?.name,
      description: subscription.plan?.description,
      stripePriceId: subscription.plan?.stripePriceId,
      price: subscription.plan?.price,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCurrentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).getTime() : undefined,
      stripeCustomerId: subscription.stripeCustomerId,
      isSubscribed: subscription.status === "ACTIVE",
      isCanceled: subscription.status === "CANCELED",
      type: "USER",
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart
        ? new Date(subscription.currentPeriodStart).getTime() : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error(`API error: ${error.status} - ${error.message}`);
    } else {
      console.error("Error fetching user subscription:", error);
    }
    return null;
  }
}

// Fetch Instructor Subscription
export async function fetchInstructorSubscription(
  instructorId: string
): Promise<UserSubscription | null> {
  try {
    const res: ApiResponse<any> = await apiManager.get("/subscriptions/instructor");
    if (!res.success || !res.data) return null;
    const subscription = res.data[0];
    if (!subscription) return null;
    return {
      id: subscription.id,
      name: subscription.plan?.name,
      description: subscription.plan?.description,
      stripePriceId: subscription.plan?.stripePriceId,
      price: subscription.plan?.price,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCurrentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).getTime() : undefined,
      stripeCustomerId: subscription.stripeCustomerId,
      isSubscribed: subscription.status === "ACTIVE",
      isCanceled: subscription.status === "CANCELED",
      type: "INSTRUCTOR",
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart
        ? new Date(subscription.currentPeriodStart).getTime() : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error(`API error: ${error.status} - ${error.message}`);
    } else {
      console.error("Error fetching instructor subscription:", error);
    }
    return null;
  }
}

// Fetch Subscription Plans
export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const res: ApiResponse<any[]> = await apiManager.get("/subscriptions/plans");
    if (!res.success || !res.data) return [];
    return res.data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error(`API error: ${error.status} - ${error.message}`);
    } else {
      console.error("Error fetching subscription plans:", error);
    }
    return [];
  }
}

// Subscribe to a plan
export async function requestSubscribeToPlan(
  planId: string,
  stripeSubscriptionId: string,
  userType: "USER" | "INSTRUCTOR" = "USER"
): Promise<any> {
  try {
    const endpoint =
      userType === "USER" ? "/subscriptions/user/subscribe" : "/subscriptions/instructor/subscribe";
    const res: ApiResponse<any> = await apiManager.post(endpoint, {
      planId,
      stripeSubscriptionId,
      ...(userType === "INSTRUCTOR" && {
        stripeAccountId: stripeSubscriptionId,
      }),
    });
    if (!res.success) throw new ApiError(res.message || "Subscription failed", 400);
    return res.data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error(`API error: ${error.status} - ${error.message}`);
    } else {
      console.error("Error subscribing to plan:", error);
    }
    throw error;
  }
}

// Cancel subscription
export async function requestCancelSubscription(
  userType: "USER" | "INSTRUCTOR" = "USER"
): Promise<any> {
  try {
    const endpoint =
      userType === "USER" ? "/subscriptions/user/cancel" : "/subscriptions/instructor/cancel";
    const res: ApiResponse<any> = await apiManager.post(endpoint);
    if (!res.success) throw new ApiError(res.message || "Cancellation failed", 400);
    return res;
  } catch (error: any) {
    if (error instanceof ApiError) {
      console.error(`API error: ${error.status} - ${error.message}`);
    } else {
      console.error("Error canceling subscription:", error);
    }
    throw error;
  }
}

// --- Utilities remain the same ---
export const checkSubscriptionAccess = (
  userSubscription: UserSubscription | null,
  requiredFeature: "courses" | "sessions" | "analytics" | "publish" | "promote"
): boolean => {
  if (!userSubscription || !userSubscription.isSubscribed) return false;
  const allPlans = [...userSubscriptionPlans, ...instructorSubscriptionPlans];
  const currentPlan = allPlans.find(
    (plan) => plan.stripePriceId === userSubscription.stripePriceId
  );
  if (!currentPlan) return false;
  if (
    userSubscription.stripeCurrentPeriodEnd &&
    userSubscription.stripeCurrentPeriodEnd < Date.now()
  ) {
    return false;
  }
  switch (requiredFeature) {
    case "courses":
      return (
        currentPlan.features.maxCourses === -1 ||
        (currentPlan.features.maxCourses ?? 0) > 0
      );
    case "sessions":
      return (
        currentPlan.features.sessionsPerDay === -1 ||
        (currentPlan.features.sessionsPerDay ?? 0) > 0
      );
    case "analytics":
      return currentPlan.features.analytics || false;
    case "publish":
      return currentPlan.features.canPublish || false;
    case "promote":
      return currentPlan.features.canPromote || false;
    default:
      return false;
  }
};

export const getSubscriptionPlansByType = (
  type: "USER" | "INSTRUCTOR"
): SubscriptionPlan[] => {
  return type === "USER" ? userSubscriptionPlans : instructorSubscriptionPlans;
};
