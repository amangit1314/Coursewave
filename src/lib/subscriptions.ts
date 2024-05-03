type SubscriptionPlan = {
  id: string
  name: string
  description: string
  whatIncludes: string[]
  stripePriceId: string
  price: number
}

export const storeSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'subscription_plan_STARTER',
    name: 'Free',
    description: 'Default starter plan and Best option for personal use & for your next project.',
    whatIncludes: [
      'Limited Analytics of Sessions, Courses',
      'Limited Sessions per day',
      // 'Best for individual use & small teams',
      'Assited Support & Query Resolution',
      'Only Basic features available'
    ],
    stripePriceId: 'stripe_subscription_FREE',
    price: 0
  },
  // {
  //   id: 'subscription_plan_TEAM',
  //   name: 'Team',
  //   description: ' Best for team uses for team upto 6 peoples and extended redistribution rights.',
  //   whatIncludes: ['Complete Analytics of Sessions, Courses', 'Sessions Every Day', 'Team size: 6 developers', '24x7 Support with Premium', 'All features unlocked'],
  //   stripePriceId: '',
  //   price: 15
  // },
  {
    id: 'subscription_plan_PRO',
    name: 'PRO',
    description: ' Pro subscription Includes everything and with this all features will get unlocked',
    whatIncludes: [
      'Complete Analytics of Sessions, Courses',
      'Unlimited Sessions Every Day',
      // 'Team size: 6 peoples',
      '24x7 Support with Premium',
      'All features unlocked'
    ],
    stripePriceId: process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID!,
    price: 25
  },
  // {
  //   id: 'subscription_plan_ENTERPRISE',
  //   name: 'Enterprise',
  //   description: ' Best for large scale uses and extended redistribution rights.',
  //   whatIncludes: [
  //     "Enterprise use",
  //     "No Limitation on Sessions",
  //     "Dedicated Analytics for Articles, Sessions and Courses",
  //     "24x7 Support with Premium",
  //     "All Updates and features unlocked",
  //   ],
  //   stripePriceId: '',
  //   price: 25
  // }
]