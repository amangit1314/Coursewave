"use client";

import { storeSubscriptionPlans } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { startTransition } from "react";
import { TiTick } from "react-icons/ti";
import { createStripeUrl } from "../../../../actions/create-stripe-checkout-url";
import toast from "react-hot-toast";
import useUserInfo from "@/lib/hooks/use-user-info";
import { ThemeModeToggle } from "@/components/themeModeToggle";

function Subscription() {
  const user = useUserInfo();
  const userId = user.user?.id;

  const [selectedPlan, setSelectedPlan] = React.useState<string | null | any>(null);

  const handleSubscribe = () => {
    startTransition(() => {
      createStripeUrl(userId).then((response) => {
        if (response.data) {
          window.location.href = response.data;
        }
      }).catch((error: any) => {
        console.log('ERROR: ', error)
        toast.error("Something went wrong ...");
      })
    });
  }

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
                const isCurrentPlan = !!(subscription.name === 'Free');

                return (
                  <SubscriptionCard
                    key={subscription.id}
                    name={subscription.name}
                    description={subscription.description}
                    whatIncludes={subscription.whatIncludes}
                    price={subscription.price}
                    isSelected={isSelected}
                    onSelect={() => setSelectedPlan(subscription.id)}
                    onSubscribe={handleSubscribe}
                    isCurrentPlan={isCurrentPlan}
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

// ------------------------------------------------------------------------------------
type SubscriptionProps = {
  name: string;
  description: string;
  whatIncludes: string[];
  price: number;
  isSelected?: boolean;
  onSelect?: any;
  onSubscribe?: any;
  isCurrentPlan: boolean;
  // (planId: string) => void;
};
const SubscriptionCard = ({
  name,
  description,
  whatIncludes,
  price,
  isSelected,
  onSelect,
  onSubscribe,
  isCurrentPlan,
}: SubscriptionProps) => {
  // border border-6 border-blue-600
  return (
    <div
      className={cn(
        `
        flex flex-col cursor-pointer max-w-lg w-full rounded-3xl text-center border border-stroke border-gray-100 dark:border-gray-600 hover:border-6 hover:border-blue-600  shadow-sm hover:shadow-xl p-6 xl:p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800`,
        isSelected! ? "drop-shadow-xl ring-1 ring-blue-600" : "",
        isCurrentPlan ? "drop-shadow-xl ring-2 ring-blue-600 " : ""
      )}
      onClick={onSelect}
    >
      {/* name of subscription */}
      <h3 className="my-4 text-2xl font-bold tracking-tight">{name}</h3>

      {/* description */}
      <p className="font-light px-2 text-gray-500 text-lg md:text-md md:text-base  dark:text-gray-400">
        {description}
      </p>

      {/* subscription price */}
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-bold tracking-tighter">${price}</span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>

      {/* What includes in this subscription  */}
      <ul role="list" className="mb-8 space-y-4 text-left px-2">
        {whatIncludes.map((point: string) => {
          return (
            <li key={point} className="flex items-center space-x-3">
              <TiTick className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
              <span>{point}</span>
            </li>
          );
        })}
      </ul>

      {/* button for [Upgtrade or Current Plan] */}
      <Link
        href="#"
        onClick={onSubscribe}
        className={cn(
          "text-white bg-zinc-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-blue-500",
          isSelected
            ? "bg-blue-500 text-white focus:ring-4 focus:ring-blue-600 "
            : "",
          isCurrentPlan ? "bg-blue-500 text-white ring-2 ring-blue-600" : ""
        )}
      >
        {isCurrentPlan ? "Current Plan" : "Upgrade"}
      </Link>
    </div>
  );
}