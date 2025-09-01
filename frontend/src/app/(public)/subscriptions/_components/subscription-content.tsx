// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   userSubscriptionPlans,
//   instructorSubscriptionPlans,
// } from "@/lib/config/subscriptionPlans";
// import SubscriptionPlanCard from "./subscription-plan-card";

// import { useUserStore } from "@/zustand/userStore";
// import {
//   getSubscriptionPlans,
//   UserSubscription,
// } from "@/lib/utils/subscription";

// type SubscriptionContentProps = {
//   subscriptionPlan: UserSubscription | null;
//   userType?: "USER" | "INSTRUCTOR";
// };

// const SubscriptionContent = ({
//   subscriptionPlan,
//   userType = "USER",
// }: SubscriptionContentProps) => {
//   const { user } = useUserStore();
//   const userId = user?.id;
//   const userEmail = user?.email;

//   const [plans, setPlans] = useState(
//     userType === "USER" ? userSubscriptionPlans : instructorSubscriptionPlans
//   );
//   const [loading, setLoading] = useState(false);

//   // Get plans based on user type
//   const getPlansByType = () => {
//     return userType === "USER"
//       ? userSubscriptionPlans
//       : instructorSubscriptionPlans;
//   };

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setLoading(true);
//         const backendPlans = await getSubscriptionPlans();
//         if (backendPlans.length > 0) {
//           // Filter plans by user type
//           const filteredPlans = backendPlans.filter(
//             (plan) => plan.type === userType || !plan.type // Include plans without type for backward compatibility
//           );
//           setPlans(filteredPlans);
//         } else {
//           // Fallback to static plans if backend doesn't return any
//           console.log("No plans from backend, using static plans");
//           setPlans(getPlansByType());
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching plans from backend, using static plans:",
//           error
//         );
//         // Fallback to static plans
//         setPlans(getPlansByType());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, [userType]);

//   const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
//     const currentPlan = plans.find(
//       (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
//     );
//     const freePlan = plans.find((plan) => plan.name === "Free");
//     return currentPlan?.id || freePlan?.id || null;
//   });

//   useEffect(() => {
//     const currentPlan = plans.find(
//       (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
//     );
//     const freePlan = plans.find((plan) => plan.name === "Free");
//     setSelectedPlan(currentPlan?.id || freePlan?.id || null);
//   }, [subscriptionPlan, plans]);

//   if (!userId || !userEmail) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-600 dark:text-gray-400">
//           Please log in to view subscription plans.
//         </p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-[1rem] gap-6 space-y-8 md:mx-[4rem] lg:grid lg:grid-cols-3 lg:space-y-0">
//       {plans.map((subscription) => {
//         const isCurrentPlan =
//           subscriptionPlan?.stripePriceId === subscription.stripePriceId;
//         const isSelected = isCurrentPlan || subscription.id === selectedPlan;

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
//             isSubscribed={!!subscriptionPlan?.isSubscribed}
//             isCurrentPlan={isCurrentPlan}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default SubscriptionContent;

// ! -----------------------------------------------------------------------------------------------------------

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   userSubscriptionPlans,
//   instructorSubscriptionPlans,
// } from "@/lib/config/subscriptionPlans";
// import SubscriptionPlanCard from "./subscription-plan-card";
// import { useUserStore } from "@/zustand/userStore";
// import {
//   getSubscriptionPlans,
//   UserSubscription,
// } from "@/lib/utils/subscription";

// type SubscriptionContentProps = {
//   subscriptionPlan: UserSubscription | null;
//   userType?: "USER" | "INSTRUCTOR";
// };

// const SubscriptionContent = ({
//   subscriptionPlan,
//   userType = "USER",
// }: SubscriptionContentProps) => {
//   const { user } = useUserStore();
//   const userId = user?.id;
//   const userEmail = user?.email;

//   const [plans, setPlans] = useState(
//     userType === "USER" ? userSubscriptionPlans : instructorSubscriptionPlans
//   );
//   const [loading, setLoading] = useState(false);

//   const getPlansByType = () => {
//     return userType === "USER"
//       ? userSubscriptionPlans
//       : instructorSubscriptionPlans;
//   };

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setLoading(true);
//         const backendPlans = await getSubscriptionPlans();
//         if (backendPlans.length > 0) {
//           const filteredPlans = backendPlans.filter(
//             (plan) => plan.type === userType || !plan.type
//           );
//           setPlans(filteredPlans);
//         } else {
//           console.log("No plans from backend, using static plans");
//           setPlans(getPlansByType());
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching plans from backend, using static plans:",
//           error
//         );
//         setPlans(getPlansByType());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, [userType]);

//   const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
//     const currentPlan = plans.find(
//       (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
//     );
//     const freePlan = plans.find((plan) => plan.name === "Free");
//     return currentPlan?.id || freePlan?.id || null;
//   });

//   useEffect(() => {
//     const currentPlan = plans.find(
//       (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
//     );
//     const freePlan = plans.find((plan) => plan.name === "Free");
//     setSelectedPlan(currentPlan?.id || freePlan?.id || null);
//   }, [subscriptionPlan, plans]);

//   if (!userId || !userEmail) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <p className="text-gray-600 dark:text-gray-400">
//           Please log in to view subscription plans.
//         </p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-4xl text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
//           Choose Your Plan
//         </h1>
//         <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
//           Select the subscription that fits your learning needs
//         </p>
//       </div>

//       <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//         {plans.map((subscription) => {
//           const isCurrentPlan =
//             subscriptionPlan?.stripePriceId === subscription.stripePriceId;
//           const isSelected = isCurrentPlan || subscription.id === selectedPlan;

//           return (
//             <SubscriptionPlanCard
//               key={subscription.id}
//               email={userEmail}
//               name={subscription.name}
//               userId={userId}
//               description={subscription.description}
//               whatIncludes={subscription.whatIncludes}
//               price={subscription.price}
//               isSelected={isSelected}
//               onSelect={() => setSelectedPlan(subscription.id)}
//               stripePriceId={subscription.stripePriceId}
//               stripeCustomerId={subscriptionPlan?.stripeCustomerId}
//               isSubscribed={!!subscriptionPlan?.isSubscribed}
//               isCurrentPlan={isCurrentPlan}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SubscriptionContent;

//* -----------------------------------------------------------------------------------

"use client";

import React, { useState, useEffect } from "react";
import {
  userSubscriptionPlans,
  instructorSubscriptionPlans,
} from "@/lib/config/subscriptionPlans";
import { useUserStore } from "@/zustand/userStore";
import {
  getSubscriptionPlans,
  UserSubscription,
} from "@/lib/utils/subscription";
import { TiTick } from "react-icons/ti";
import ManageUserSubscriptionButton from "./manage-user-subscription-button";
import { cn } from "@/lib/utils/utils";

type SubscriptionContentProps = {
  subscriptionPlan: UserSubscription | null;
  userType?: "USER" | "INSTRUCTOR";
};

const SubscriptionContent = ({
  subscriptionPlan,
  userType = "USER",
}: SubscriptionContentProps) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const userEmail = user?.email;

  const [plans, setPlans] = useState(
    userType === "USER" ? userSubscriptionPlans : instructorSubscriptionPlans
  );
  const [loading, setLoading] = useState(false);

  const getPlansByType = () => {
    return userType === "USER"
      ? userSubscriptionPlans
      : instructorSubscriptionPlans;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const backendPlans = await getSubscriptionPlans();
        if (backendPlans.length > 0) {
          const filteredPlans = backendPlans.filter(
            (plan) => plan.type === userType || !plan.type
          );
          setPlans(filteredPlans);
        } else {
          console.log("No plans from backend, using static plans");
          setPlans(getPlansByType());
        }
      } catch (error) {
        console.error(
          "Error fetching plans from backend, using static plans:",
          error
        );
        setPlans(getPlansByType());
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userType]);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    const currentPlan = plans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
    );
    const freePlan = plans.find((plan) => plan.name === "Free");
    return currentPlan?.id || freePlan?.id || null;
  });

  useEffect(() => {
    const currentPlan = plans.find(
      (plan) => plan.stripePriceId === subscriptionPlan?.stripePriceId
    );
    const freePlan = plans.find((plan) => plan.name === "Free");
    setSelectedPlan(currentPlan?.id || freePlan?.id || null);
  }, [subscriptionPlan, plans]);

  if (!userId || !userEmail) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to view subscription plans.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Billing & Subscription
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Keep track of your subscription details, update your billing
          information, and control your account's payment
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left sidebar with navigation */}
        {/* <div className="w-full lg:w-1/4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Navigation
            </h2>
            <ul className="space-y-3">
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Calendar</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Widgets</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Marketing</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Product</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Emails</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Integration</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Contacts</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Mobile</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Opportunity Stages</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Key Metrics</a>
              </li>
              <li className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <a href="#">Product Plan</a>
              </li>
            </ul>
          </div>
        </div> */}

        {/* Main content area */}
        <div className="w-full">
          {/* Current Plan Section */}
          {/* <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Status
              </h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Current Plan
              </span>
            </div>

            {subscriptionPlan && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {subscriptionPlan.name}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${subscriptionPlan.price}{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </p>
              </div>
            )}

            <ul className="space-y-3">
              {subscriptionPlan?.whatIncludes?.map((feature) => (
                <li key={feature} className="flex items-start">
                  <TiTick className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Available Plans Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {plans
                .filter(
                  (plan) =>
                    plan.stripePriceId !== subscriptionPlan?.stripePriceId
                )
                .map((subscription) => {
                  const isSelected = subscription.id === selectedPlan;

                  return (
                    <div
                      key={subscription.id}
                      className={cn(
                        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800",
                        isSelected && "ring-2 ring-blue-500"
                      )}
                      onClick={() => setSelectedPlan(subscription.id)}
                    >
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        {subscription.name}
                      </h3>
                      <p className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ${subscription.price}{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      </p>

                      <ul className="space-y-3">
                        {subscription.whatIncludes.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <TiTick className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6">
                        <ManageUserSubscriptionButton
                          email={userEmail}
                          userId={userId}
                          stripePriceId={subscription.stripePriceId}
                          stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                          isSubscribed={!!subscriptionPlan?.isSubscribed}
                          isSelected={isSelected}
                          isCurrentPlan={false}
                          // className="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Billing History Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Billing History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Plan Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Purchase Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      Starter Plan - Jan 2024
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      $10.00
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      2024-06-01
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      2024-06-31
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-green-600 dark:text-green-400">
                      Success
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      Growth Plan - May 2024
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      $79.00
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      2024-06-01
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      2024-06-31
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-green-600 dark:text-green-400">
                      Success
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionContent;
