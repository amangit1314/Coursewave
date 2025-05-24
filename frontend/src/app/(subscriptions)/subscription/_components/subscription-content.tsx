"use client";

// import React, { startTransition } from "react";
// import { storeSubscriptionPlans } from "@/lib/subscriptions";
// import { createStripeUrl } from "../../../../../actions/create-stripe-checkout-url";
// import toast from "react-hot-toast";
// import {useUserInfo} from "@/hooks/use-user-info";
// import SubscriptionPlanCard from "./subscription-plan-card";

// type SubscriptionPlan = {
//   id: string | undefined | any;
//   name: string | any;
//   description: string | any;
//   whatIncludes: string[] | any;
//   stripePriceId: string | any;
//   price: number | undefined | any;
// };

// type Subscription = {
//   // subscription: SubscriptionPlan | any;
//   // id: string | undefined | any;
//   // name: string | any;
//   // description: string | any;
//   // whatIncludes: string[] | any;
//   // stripePriceId: string | any;
//   // price: number | undefined | any;
//   // stripeSubscriptionId: string | any;
//   // stripeCurrentPeriodEnd: number | any;
//   // stripeCustomerId: string | any;
//   // isSubscribed: boolean | any;
//   // isCanceled: boolean | any;

//   stripeSubscriptionId: string | null;
//   stripeCurrentPeriodEnd: number | undefined;
//   stripeCustomerId: string;
//   isSubscribed: boolean;
//   isCanceled: boolean;
//   id?: string | undefined;
//   name?: string | undefined;
//   description?: string | undefined;
//   whatIncludes?: string[] | undefined;
//   stripePriceId?: string | undefined;
//   price?: number | undefined;
// };

// type SubcriptionContentProps = {
//   subscriptionPlan: Subscription;
// };

// const SubscriptionContent = ({ subscriptionPlan }: SubcriptionContentProps) => {
//   const user = useUserInfo();
//   const userId = user?.user?.id!;
//   const userEmail = user?.user?.email!;

//   const [selectedPlan, setSelectedPlan] = React.useState<string | null>(() => {
//     const freePlan = storeSubscriptionPlans.find(
//       (plan) => plan.name === "Free"
//     );
//     return freePlan?.id || null;
//   });

//   return (
//     <div className="space-y-8 lg:grid lg:grid-cols-2 gap-6 md:mx-[4rem]  lg:space-y-0 mx-[1rem]">
//       {storeSubscriptionPlans.map((subscription) => {
//         const isCurrentPlan =
//         (subscriptionPlan?.stripePriceId! as string) ===
//         subscription.stripePriceId;
//         const isSelected =  isCurrentPlan ?? subscription.id === selectedPlan ;

//         return (
//           <SubscriptionPlanCard
//             key={subscription.id}
//             email={userEmail}
//             name={subscription.name}
//             userId={userId}
//             description={subscription.description}
//             whatIncludes={subscription.whatIncludes}
//             price={subscription.price}
//             isSelected={isSelected}
//             onSelect={() => setSelectedPlan(subscription.id)}
//             stripePriceId={subscription.stripePriceId}
//             stripeCustomerId={subscriptionPlan?.stripeCustomerId}
//             isSubscribed={!!subscriptionPlan?.isSubscribed ?? false}
//             isCurrentPlan={
//               (subscriptionPlan?.stripePriceId! as string) ===
//               subscription.stripePriceId
//             }
//           />
//         );
//       })}
//     </div>
//   );
// };

// New try

import React, { useState, useEffect } from "react";
import { storeSubscriptionPlans } from "@/lib/subscriptionPlans";
import { createStripeUrl } from "../../../../../actions/create-stripe-checkout-url";
import toast from "react-hot-toast";
import { useUserInfo } from "@/hooks/useUserInfo";
import SubscriptionPlanCard from "./subscription-plan-card";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  whatIncludes: string[];
  stripePriceId: string;
  price: number;
};

type Subscription = {
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: number | undefined;
  stripeCustomerId: string;
  isSubscribed: boolean;
  isCanceled: boolean;
  id?: string;
  name?: string;
  description?: string;
  whatIncludes?: string[];
  stripePriceId?: string;
  price?: number;
};

type SubscriptionContentProps = {
  subscriptionPlan: Subscription;
};

const SubscriptionContent = ({
  subscriptionPlan,
}: SubscriptionContentProps) => {
  const user = useUserInfo();
  const userId = user?.user?.id!;
  const userEmail = user?.user?.email!;

  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    const currentPlan = storeSubscriptionPlans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId,
    );
    const freePlan = storeSubscriptionPlans.find(
      (plan) => plan.name === "Free",
    );
    return currentPlan?.id || freePlan?.id || null;
  });

  useEffect(() => {
    const currentPlan = storeSubscriptionPlans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId,
    );
    const freePlan = storeSubscriptionPlans.find(
      (plan) => plan.name === "Free",
    );
    setSelectedPlan(currentPlan?.id || freePlan?.id || null);
  }, [subscriptionPlan]);

  return (
    <div className="mx-[1rem] gap-6 space-y-8 md:mx-[4rem] lg:grid lg:grid-cols-2 lg:space-y-0">
      {storeSubscriptionPlans.map((subscription) => {
        const isCurrentPlan =
          subscriptionPlan?.stripePriceId === subscription.stripePriceId;
        const isSelected = isCurrentPlan || subscription.id === selectedPlan;

        return (
          <SubscriptionPlanCard
            key={subscription.id}
            email={userEmail}
            name={subscription.name}
            userId={userId}
            description={subscription.description}
            whatIncludes={subscription.whatIncludes}
            price={subscription.price}
            isSelected={isSelected}
            onSelect={() => setSelectedPlan(subscription.id)}
            stripePriceId={subscription.stripePriceId}
            stripeCustomerId={subscriptionPlan?.stripeCustomerId}
            isSubscribed={!!subscriptionPlan?.isSubscribed}
            isCurrentPlan={isCurrentPlan}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionContent;
