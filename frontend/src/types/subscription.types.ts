export type SubscriptionSupportType = "BASIC" | "PRIORITY" | "24x7";

export type SubscriptionPlanType = "USER" | "INSTRUCTOR";

export type SubscriptionPlanInterval = "MONTHLY" | "YEARLY" | "WEEKLY";

export type SubscriptionPlan = {
  id: string;
  slug?: string; // Optional static, backend always present
  name: string;
  description: string;
  whatIncludes: string[];
  stripePriceId: string;
  price: number;
  type: SubscriptionPlanType;
  features: {
    maxCourses?: number;
    maxStorageGB?: number;
    canPublish?: boolean;
    analytics?: boolean;
    support?: SubscriptionSupportType;
    sessionsPerDay?: number;
    canPromote?: boolean;
  };
  interval?: SubscriptionPlanInterval;
  currency?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/// todo: check whether below is correct or not
export type UserSubscription = {
  id?: string;
  name?: string;
  description?: string;
  whatIncludes?: string[];
  stripePriceId?: string;
  price?: number;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: number | undefined;
  stripeCustomerId: string | null;
  isSubscribed: boolean;
  isCanceled: boolean;
  type?: "USER" | "INSTRUCTOR";
  status?: "ACTIVE" | "CANCELED" | "EXPIRED";
  currentPeriodStart?: number;
  cancelAtPeriodEnd?: boolean;
};
