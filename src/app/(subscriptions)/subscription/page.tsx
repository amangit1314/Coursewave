"use client";

import { storeSubscriptionPlans } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { TiTick } from "react-icons/ti";

function Subscription() {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null | any>(null);

  return (
    <div className="mt-16 md:mt-0">
      <section className="bg-white dark:bg-zinc-900 py-8">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Choose a plan for <span className="text-blue-600">yourself!</span>{" "}
            </h2>
            {/* <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for learners like yours</h2> */}
            <p className="mb-5 font-light text-base text-gray-500 sm:text-xl dark:text-gray-400">
              Here at Courewave we are building a platform where technology,
              innovation, and capital can unlock long-term value and drive
              economic growth.
            </p>
          </div>

          <div className="space-y-8 lg:grid lg:grid-cols-3 gap-6  lg:space-y-0 mx-[1rem]">
            {storeSubscriptionPlans.map((subscription) => {
              const isSelected = subscription.id === selectedPlan;

              return (
                <SubscriptionCard
                  key={subscription.id}
                  name={subscription.name}
                  description={subscription.description}
                  whatIncludes={subscription.whatIncludes}
                  price={subscription.price}
                  isSelected={isSelected}
                  onSelect={() => setSelectedPlan(subscription.id)}
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

type SubscriptionProps = {
  name: string;
  description: string;
  whatIncludes: string[];
  price: number;
  isSelected?: boolean;
  onSelect?: any
  // (planId: string) => void;
};
const SubscriptionCard = ({
  name,
  description,
  whatIncludes,
  price,
  isSelected,
  onSelect,
}: SubscriptionProps) => {
  const currentPlan = name === "Free";
  return (
    <div
      className={cn(
        `
        flex flex-col cursor-pointer border border-stroke border-gray-100 dark:border-gray-600 hover:border-6 active:border-6 hover:border-blue-600 active:border-blue-600 rounded-2xl shadow-sm hover:shadow-xl p-6 xl:p-2 max-w-lg text-center text-gray-900 dark:text-white bg-white dark:bg-gray-800  border-gray - 100 hover:border-6 active:border-6`,
        isSelected
          ? "border border-6 border-blue-600 drop-shadow-xl bg-blue-600"
          : "",
        name === "Free"
          ? "border border-6 border-blue-600 drop-shadow-xl bg-blue-600 "
          : ""
      )}
      onClick={onSelect}
    >
      {/* name of subscription */}
      <h3 className="my-4 text-2xl font-bold">{name}</h3>

      {/* description */}
      <p className="font-light text-gray-500 text-lg md:text-md md:text-base  dark:text-gray-400">
        {description}
      </p>

      {/* subscription price */}
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">
          ${price}
        </span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>

      {/* What includes in this subscription  */}
      <ul role="list" className="mb-8 space-y-4 text-left">
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
        className={cn(
          "text-white bg-gray-600 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-blue-900",
          isSelected ? "bg-blue-600" : ""
        )}
      >
        {name === "Free" ? "Current Plan" : "Upgrade"}
      </Link>
    </div>
  );
};
