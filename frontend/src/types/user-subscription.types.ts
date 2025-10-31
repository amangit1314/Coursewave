import { SubscriptionPlan } from "./subscription.types";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELED"
  | "TRIAL"
  | "PAST_DUE"
  | "UNPAID"
  | "INCOMPLETE";

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  stripeSubscriptionId: string; // Stripe sub id
  stripeCustomerId: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
  isSubscribed?: boolean; // computed for frontend convenience
}
