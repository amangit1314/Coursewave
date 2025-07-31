"use client";

import React, { useState, useEffect } from "react";
import { userSubscriptionPlans, instructorSubscriptionPlans } from "@/lib/subscriptionPlans";
import { useUserInfo } from "@/hooks/useUserInfo";
import SubscriptionPlanCard from "./subscription-plan-card";
import { UserSubscription, getSubscriptionPlans } from "@/lib/subscription";

type SubscriptionContentProps = {
  subscriptionPlan: UserSubscription | null;
  userType?: 'USER' | 'INSTRUCTOR';
};

const SubscriptionContent = ({
  subscriptionPlan,
  userType = 'USER'
}: SubscriptionContentProps) => {
  const user = useUserInfo();
  const userId = user?.user?.id;
  const userEmail = user?.user?.email;

  const [plans, setPlans] = useState(userType === 'USER' ? userSubscriptionPlans : instructorSubscriptionPlans);
  const [loading, setLoading] = useState(false);

  // Get plans based on user type
  const getPlansByType = () => {
    return userType === 'USER' ? userSubscriptionPlans : instructorSubscriptionPlans;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const backendPlans = await getSubscriptionPlans();
        if (backendPlans.length > 0) {
          // Filter plans by user type
          const filteredPlans = backendPlans.filter(plan => 
            plan.type === userType || !plan.type // Include plans without type for backward compatibility
          );
          setPlans(filteredPlans);
        } else {
          // Fallback to static plans if backend doesn't return any
          console.log('No plans from backend, using static plans');
          setPlans(getPlansByType());
        }
      } catch (error) {
        console.error('Error fetching plans from backend, using static plans:', error);
        // Fallback to static plans
        setPlans(getPlansByType());
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userType]);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    const currentPlan = plans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId,
    );
    const freePlan = plans.find(
      (plan) => plan.name === "Free",
    );
    return currentPlan?.id || freePlan?.id || null;
  });

  useEffect(() => {
    const currentPlan = plans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId,
    );
    const freePlan = plans.find(
      (plan) => plan.name === "Free",
    );
    setSelectedPlan(currentPlan?.id || freePlan?.id || null);
  }, [subscriptionPlan, plans]);

  if (!userId || !userEmail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to view subscription plans.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-[1rem] gap-6 space-y-8 md:mx-[4rem] lg:grid lg:grid-cols-3 lg:space-y-0">
      {plans.map((subscription) => {
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
