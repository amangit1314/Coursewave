type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  whatIncludes: string[];
  stripePriceId: string;
  price: number;
};

export const storeSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "subscription_plan_STARTER",
    name: "Free",
    description:
      "Default starter plan and Best option for personal use & for your next project.",
    whatIncludes: [
      "Limited Analytics of Sessions, Courses",
      "Limited Sessions per day",

      "Assited Support & Query Resolution",
      "Only Basic features available",
    ],
    stripePriceId: "stripe_subscription_FREE",
    price: 0,
  },
  {
    id: "subscription_plan_PRO",
    name: "PRO",
    description:
      " Pro subscription Includes everything and with this all features will get unlocked",
    whatIncludes: [
      "Complete Analytics of Sessions, Courses",
      "Unlimited Sessions Every Day",

      "24x7 Support with Premium",
      "All features unlocked",
    ],
    stripePriceId: process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID!,
    price: 25,
  },
];
