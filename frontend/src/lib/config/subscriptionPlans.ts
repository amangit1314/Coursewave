export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  whatIncludes: string[];
  stripePriceId: string;
  price: number;
  type: 'USER' | 'INSTRUCTOR';
  features: {
    maxCourses?: number;
    maxStorageGB?: number;
    canPublish?: boolean;
    analytics?: boolean;
    support?: 'BASIC' | 'PRIORITY' | '24x7';
    sessionsPerDay?: number;
    canPromote?: boolean;
  };
};

export const userSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "user_plan_free",
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
  {
    id: "user_plan_basic",
    name: "Basic",
    description: "Great for serious learners",
    whatIncludes: [
      "Access to unlimited courses",
      "All course content unlocked",
      "Priority support",
      "Unlimited session booking",
      "Advanced progress analytics",
      "Course certificates"
    ],
    stripePriceId: process.env.STRIPE_USER_BASIC_PRICE_ID || "price_user_basic",
    price: 15,
    type: 'USER',
    features: {
      maxCourses: -1, // unlimited
      maxStorageGB: 5,
      canPublish: false,
      analytics: true,
      support: 'PRIORITY',
      sessionsPerDay: -1, // unlimited
      canPromote: false
    }
  },
  {
    id: "user_plan_pro",
    name: "Pro",
    description: "Ultimate learning experience with premium features",
    whatIncludes: [
      "Everything in Basic",
      "24/7 premium support",
      "Exclusive premium courses",
      "1-on-1 mentoring sessions",
      "Advanced career guidance",
      "Early access to new features",
      "Custom learning paths"
    ],
    stripePriceId: process.env.STRIPE_USER_PRO_PRICE_ID || "price_user_pro",
    price: 29,
    type: 'USER',
    features: {
      maxCourses: -1,
      maxStorageGB: 10,
      canPublish: false,
      analytics: true,
      support: '24x7',
      sessionsPerDay: -1,
      canPromote: false
    }
  }
];

export const instructorSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "instructor_plan_free",
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
  {
    id: "instructor_plan_basic",
    name: "Basic",
    description: "Grow your teaching business",
    whatIncludes: [
      "Create unlimited courses",
      "Advanced analytics & insights",
      "Priority support",
      "Faster payout schedule",
      "Course promotion tools",
      "Student engagement analytics"
    ],
    stripePriceId: process.env.STRIPE_INSTRUCTOR_BASIC_PRICE_ID || "price_instructor_basic",
    price: 25,
    type: 'INSTRUCTOR',
    features: {
      maxCourses: -1,
      maxStorageGB: 20,
      canPublish: true,
      analytics: true,
      support: 'PRIORITY',
      sessionsPerDay: -1,
      canPromote: true
    }
  },
  {
    id: "instructor_plan_pro",
    name: "Pro",
    description: "Scale your teaching empire",
    whatIncludes: [
      "Everything in Basic",
      "24/7 premium support",
      "Advanced marketing tools",
      "Custom branding",
      "API access",
      "White-label solutions",
      "Dedicated success manager"
    ],
    stripePriceId: process.env.STRIPE_INSTRUCTOR_PRO_PRICE_ID || "price_instructor_pro",
    price: 49,
    type: 'INSTRUCTOR',
    features: {
      maxCourses: -1,
      maxStorageGB: 100,
      canPublish: true,
      analytics: true,
      support: '24x7',
      sessionsPerDay: -1,
      canPromote: true
    }
  }
];

// Legacy export for backward compatibility
export const storeSubscriptionPlans: SubscriptionPlan[] = [
  ...userSubscriptionPlans,
  ...instructorSubscriptionPlans
];
