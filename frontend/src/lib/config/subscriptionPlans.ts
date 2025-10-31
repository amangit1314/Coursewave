import { SubscriptionPlan } from "@/types/subscription.types";

export const userSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "user_plan_free",
    slug: "user-free",
    name: "Free",
    description: "Perfect for getting started with learning",
    whatIncludes: [
      "Access to 5 courses per month",
      "Basic course content",
      "Community support",
      "Standard session booking (2 per day)",
      "Basic progress tracking"
    ],
    stripePriceId: "price_free",
    price: 0,
    type: 'USER',
    interval: "MONTHLY",
    currency: "USD",
    isActive: true,
    features: {
      maxCourses: 5,
      maxStorageGB: 1,
      canPublish: false,
      analytics: false,
      support: 'BASIC',
      sessionsPerDay: 2,
      canPromote: false
    }
  },
  // ... rest of the user plans, add interval, currency, isActive, slug fields
];

export const instructorSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "instructor_plan_free",
    slug: "instructor-free",
    name: "Free",
    description: "Start your teaching journey",
    whatIncludes: [
      "Create up to 3 courses",
      "Basic analytics",
      "Community support",
      "Standard payout schedule",
      "Basic course promotion"
    ],
    stripePriceId: "price_instructor_free",
    price: 0,
    type: 'INSTRUCTOR',
    interval: "MONTHLY",
    currency: "USD",
    isActive: true,
    features: {
      maxCourses: 3,
      maxStorageGB: 5,
      canPublish: true,
      analytics: false,
      support: 'BASIC',
      sessionsPerDay: 5,
      canPromote: false
    }
  },
  // ... rest of instructor plans
];

// Legacy store array
export const storeSubscriptionPlans: SubscriptionPlan[] = [
  ...userSubscriptionPlans,
  ...instructorSubscriptionPlans
];
