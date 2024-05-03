"use client";

import React, { startTransition } from "react";
import { storeSubscriptionPlans } from "@/lib/subscriptions";
import { createStripeUrl } from "../../../../../actions/create-stripe-checkout-url";
import toast from "react-hot-toast";
import useUserInfo from "@/hooks/use-user-info";
import SubscriptionPlanCard from "./subscription-plan-card";

type SubscriptionPlan = {
  id: string | undefined | any;
  name: string | any;
  description: string | any;
  whatIncludes: string[] | any;
  stripePriceId: string | any;
  price: number | undefined | any;
};

type Subscription = {
  // subscription: SubscriptionPlan | any;
  // id: string | undefined | any;
  // name: string | any;
  // description: string | any;
  // whatIncludes: string[] | any;
  // stripePriceId: string | any;
  // price: number | undefined | any;
  // stripeSubscriptionId: string | any;
  // stripeCurrentPeriodEnd: number | any;
  // stripeCustomerId: string | any;
  // isSubscribed: boolean | any;
  // isCanceled: boolean | any;

  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: number | undefined;
  stripeCustomerId: string;
  isSubscribed: boolean;
  isCanceled: boolean;
  id?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  whatIncludes?: string[] | undefined;
  stripePriceId?: string | undefined;
  price?: number | undefined;
};

type SubcriptionContentProps = {
  subscriptionPlan: Subscription;
};

const SubscriptionContent = ({ subscriptionPlan }: SubcriptionContentProps) => {
  const user = useUserInfo();
  const userId = user?.user?.id!;
  const userEmail = user?.user?.email;

  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(
    () => {
      const freePlan = storeSubscriptionPlans.find(
        (plan) => plan.name === "Free"
      );
      return freePlan?.id || null;
    }
  );
  const [checkBool, setCheckBool] = React.useState(false);

  const getUserSubscriptionData = async () => {
    const response = await fetch(`/api/profile/${userId}/getUserSubscription`);

    setCheckBool(true);

    if (!response.ok) {
      console.log("Error in fetching user subscription ...");
      throw new Error("Error in fetching user subscription 🚧❌ ...");
      setCheckBool(false);
    }

    setCheckBool(true);
    return await response.json();
  };

  // const {
  //   data: subscriptionPlan,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["userSubscription"],
  //   queryFn: getUserSubscriptionData,
  //   staleTime: 4,
  // });

  const handleSubscribe = () => {
    startTransition(() => {
      createStripeUrl(userId)
        .then((response) => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch((error: any) => {
          console.log("ERROR: ", error);
          toast.error("Something went wrong ...");
        });
    });
  };

  // console.log("Check bool value: ", checkBool);

  return (
    <div className="space-y-8 lg:grid lg:grid-cols-2 gap-6 md:mx-[4rem]  lg:space-y-0 mx-[1rem]">
      {storeSubscriptionPlans.map((subscription) => {
        // const isSelected = subscription.id === selectedPlan;
        // const isCurrentPlan = !!(subscription.name === "Free");
        const isSelected = subscription.id === selectedPlan;
        const isCurrentPlan =
          subscriptionPlan?.stripePriceId === subscription.stripePriceId; // Use optional chaining

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
            isSubscribed={!!subscriptionPlan?.isSubscribed ?? false}
            isCurrentPlan={
              (subscriptionPlan?.stripePriceId! as string) ===
              subscription.stripePriceId
            }
          />
        );
      })}
    </div>
  );
};

export default SubscriptionContent;
