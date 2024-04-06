"use client";

import { storeSubscriptionPlans } from "@/lib/subscriptions";
import React, { startTransition, useEffect } from "react";
import { createStripeUrl } from "../../../../actions/create-stripe-checkout-url";
import toast from "react-hot-toast";
import useUserInfo from "@/hooks/use-user-info";
import SubscriptionPlanCard from "./_components/subscription-plan-card";
import { absoluteUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

function Subscription() {
  const user = useUserInfo();
  const userId = user?.user?.id!;

  // by default free plan
  const [selectedPlan, setSelectedPlan] = React.useState<string | null | any>(
    null
  );
   const [checkBool, setCheckBool] = React.useState(false);

  const getUserSubscriptionData = async () => {
    const response = await fetch(
      `/api/profile/${userId}/getUserSubscription`
    );

    setCheckBool(true);

    if (!response.ok) {
      console.log('Error in fetching user subscription ...');
      throw new Error("Error in fetching user subscription 🚧❌ ...");
      setCheckBool(false);
    }

     setCheckBool(true);
    return await response.json();

  };

  const { data: subscriptionPlan, isLoading, error } = useQuery({
    queryKey: ["userSubscription"],
    queryFn: getUserSubscriptionData,
    staleTime: 4,
  })

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

  console.log('Check bool value: ', checkBool);

  return (
    <div className="mt-16 md:mt-0">
      {/* <ThemeModeToggle /> */}
      <section className="bg-white dark:bg-zinc-900 py-8">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto space-y-6 max-w-screen-md text-center mb-8 lg:mb-12">
            <p className=" text-[42px] tracking-tight font-bold text-gray-900 dark:text-white">
              Choose a plan for <span className="text-blue-600">yourself!</span>{" "}
            </p>

            <p className="font-light text-base text-gray-500 sm:text-xl dark:text-gray-400">
              Here at Courewave we are building a platform where technology,
              innovation, and capital can unlock long-term value and drive
              economic growth.
            </p>
          </div>

          <div className="space-y-8 lg:grid lg:grid-cols-2 gap-6 md:mx-[4rem]  lg:space-y-0 mx-[1rem]">
            {storeSubscriptionPlans.map((subscription) => {
              const isSelected = subscription.id === selectedPlan;
              const isCurrentPlan = !!(subscription.name === "Free");

              return (
                <SubscriptionPlanCard
                  key={subscription.id}
                  name={subscription.name}
                  description={subscription.description}
                  whatIncludes={subscription.whatIncludes}
                  price={subscription.price}
                  isSelected={isSelected}
                  onSelect={() => setSelectedPlan(subscription.id)}
                  onSubscribe={handleSubscribe}
                  isCurrentPlan={subscriptionPlan?.data?.stripePriceId! as string === subscription.stripePriceId}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Subscription;
