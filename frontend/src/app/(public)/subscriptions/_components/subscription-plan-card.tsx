//* ---------------------------------------------- WORKING CODE -----------------------

// import { cn } from "@/lib/utils/utils";
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
// import { cn } from "@/lib/utils/utils";
// import Link from "next/link";
// import { TiTick } from "react-icons/ti";
// import ManageUserSubscriptionButton from "./manage-user-subscription-button";

// type SubscriptionPlanProps = {
//   email: string;
//   name: string;
//   userId: string;
//   description: string;
//   whatIncludes: string[];
//   price: number;
//   isSelected: boolean;
//   onSelect?: () => void;
//   isCurrentPlan: boolean;
//   stripePriceId: string;
//   stripeCustomerId?: string | null;
//   isSubscribed: boolean;
// };

// const SubscriptionPlanCard = ({
//   email,
//   name,
//   userId,
//   description,
//   whatIncludes,
//   price,
//   isSelected,
//   onSelect,
//   isCurrentPlan,
//   stripePriceId,
//   stripeCustomerId,
//   isSubscribed,
// }: SubscriptionPlanProps) => {
//   return (
//     <div
//       className={cn(
//         `border-stroke hover:border-6 flex w-full max-w-lg cursor-pointer flex-col rounded-3xl border border-gray-100 bg-white p-6 text-center text-gray-900 shadow-sm hover:border-blue-600 hover:shadow-xl dark:border-neutral-600 dark:bg-gray-800 dark:text-white xl:p-2`,
//         isSelected ? "bg-sky-600 drop-shadow-xl" : "",
//         isCurrentPlan ? "ring-2 ring-blue-600 drop-shadow-xl" : "",
//       )}
//       onClick={onSelect}
//     >
//       {/* name of subscription */}
//       <h3 className="my-4 text-2xl font-bold tracking-tight">{name}</h3>

//       {/* description */}
//       <p className="md:text-md px-2 text-lg font-light text-gray-500 dark:text-gray-400 md:text-base">
//         {description}
//       </p>

//       {/* subscription price */}
//       <div className="my-8 flex items-baseline justify-center">
//         <span className="mr-2 text-5xl font-bold tracking-tighter">
//           ${price}
//         </span>
//         <span className="text-gray-500 dark:text-gray-400">/month</span>
//       </div>

//       {/* What includes in this subscription  */}
//       <ul role="list" className="mb-8 space-y-4 px-2 text-left">
//         {whatIncludes.map((point: string) => {
//           return (
//             <li key={point} className="flex items-center space-x-3">
//               <TiTick className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
//               <span>{point}</span>
//             </li>
//           );
//         })}
//       </ul>

//       <ManageUserSubscriptionButton
//         email={email}
//         userId={userId}
//         stripePriceId={stripePriceId}
//         stripeCustomerId={stripeCustomerId}
//         isSubscribed={isSubscribed}
//         isSelected={isSelected}
//         isCurrentPlan={isCurrentPlan}
//       />
//     </div>
//   );
// };

// export default SubscriptionPlanCard;

//* ---------------------------------------------- UI TRY 3 -----------------------
import { cn } from "@/lib/utils/utils";
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
  onSelect?: () => void;
  isCurrentPlan: boolean;
  stripePriceId: string;
  stripeCustomerId?: string | null;
  isSubscribed: boolean;
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
}: SubscriptionPlanProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        isSelected && "ring-2 ring-blue-500",
        isCurrentPlan && "ring-2 ring-blue-500"
      )}
      onClick={onSelect}
    >
      <div className="p-6">
        <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {description}
        </p>
        
        <div className="mt-6 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            ${price}
          </span>
          <span className="ml-1 text-lg text-gray-500 dark:text-gray-400">
            /month
          </span>
        </div>
        
        <ul className="mt-8 space-y-3">
          {whatIncludes.map((point) => (
            <li key={point} className="flex items-start">
              <TiTick className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto p-6 pt-0">
        <ManageUserSubscriptionButton
          email={email}
          userId={userId}
          stripePriceId={stripePriceId}
          stripeCustomerId={stripeCustomerId}
          isSubscribed={isSubscribed}
          isSelected={isSelected}
          isCurrentPlan={isCurrentPlan}
          // className="w-full"
        />
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;