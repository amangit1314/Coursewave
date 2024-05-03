//* ---------------------------------------------- WORKING CODE -----------------------

// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { TiTick } from "react-icons/ti";
// import ManageUserSubscriptionButton from "./manage-user-subscription-button";

// type SubscriptionPlanProps = {
//   name: string;
//   description: string;
//   whatIncludes: string[];
//   price: number;
//   isSelected?: boolean;
//   onSelect?: any;
//   onSubscribe?: any;
//   isCurrentPlan: boolean;
// };

// const SubscriptionPlanCard = ({
//   name,
//   description,
//   whatIncludes,
//   price,
//   isSelected,
//   onSelect,
//   onSubscribe,
//   isCurrentPlan,
// }: SubscriptionPlanProps) => {
//   return (
//     <div
//       className={cn(
//         `
//         flex flex-col cursor-pointer max-w-lg w-full rounded-3xl text-center border border-stroke border-gray-100 dark:border-gray-600 hover:border-6 hover:border-blue-600  shadow-sm hover:shadow-xl p-6 xl:p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800`,
//         isSelected! ? "drop-shadow-xl ring-1 ring-blue-600" : "",
//         isCurrentPlan ? "drop-shadow-xl ring-2 ring-blue-600 " : ""
//       )}
//       onClick={onSelect}
//     >

//       <h3 className="my-4 text-2xl font-bold tracking-tight">{name}</h3>


//       <p className="font-light px-2 text-gray-500 text-lg md:text-md md:text-base  dark:text-gray-400">
//         {description}
//       </p>


//       <div className="flex justify-center items-baseline my-8">
//         <span className="mr-2 text-5xl font-bold tracking-tighter">
//           ${price}
//         </span>
//         <span className="text-gray-500 dark:text-gray-400">/month</span>
//       </div>


//       <ul role="list" className="mb-8 space-y-4 text-left px-2">
//         {whatIncludes.map((point: string) => {
//           return (
//             <li key={point} className="flex items-center space-x-3">
//               <TiTick className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
//               <span>{point}</span>
//             </li>
//           );
//         })}
//       </ul>

//       <ManageUserSubscriptionButton
//         isSelected={isSelected!}
//         onSubscribe={onSubscribe}
//         isCurrentPlan={isCurrentPlan}
//       />
//     </div>
//   );
// };

// export default SubscriptionPlanCard;


//! ------------------------------------------------ TRY 2 ------------------------------------
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TiTick } from "react-icons/ti";
import ManageUserSubscriptionButton from "./manage-user-subscription-button";

type SubscriptionPlanProps = {
  email: string;
  name: string;
  userId: string;
  description: string;
  whatIncludes: string[];
  price: number;
  isSelected: boolean;
  onSelect?: any;
  isCurrentPlan: boolean;
  stripePriceId: string;
  stripeCustomerId?: string | null;
  isSubscribed: boolean;
  // onSubscribe?: any;
};

const SubscriptionPlanCard = ({
  email,
  name,
  userId,
  description,
  whatIncludes,
  price,
  isSelected,
  onSelect,
  isCurrentPlan,
  stripePriceId,
  stripeCustomerId,
  isSubscribed,
  // onSubscribe,
}: SubscriptionPlanProps) => {
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
        <span className="mr-2 text-5xl font-bold tracking-tighter">
          ${price}
        </span>
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

      <ManageUserSubscriptionButton
        email={email}
        userId={userId}
        // stripePriceId={plan.stripePriceId}
        // stripeCustomerId={subscriptionPlan?.stripeCustomerId}
        // isSubscribed={!!subscriptionPlan.isSubscribed ?? false}
        stripePriceId={stripePriceId}
        stripeCustomerId={stripeCustomerId}
        isSubscribed={isSubscribed}
        isSelected={isSelected!}
        // onSubscribe={onSubscribe}
        isCurrentPlan={isCurrentPlan}
      />
    </div>
  );
};

export default SubscriptionPlanCard;

