//* ---------------------------------------------- WORKING CODE -----------------------

// "use client";

// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { Button } from "../../../../components/ui/button";

// type ManageUserSubscriptionButtonProps = {
//   onSubscribe: any;
//   isSelected: boolean;
//   isCurrentPlan: boolean;
// };

// export default function ManageUserSubscriptionButton({
//   onSubscribe,
//   isSelected,
//   isCurrentPlan,
// }: ManageUserSubscriptionButtonProps) {
//   return (
//     <form onSubmit={onSubscribe}>
//       <Button
//         className={cn(
//           "text-white  bg-zinc-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-blue-500 overflow-hidden",
//           isSelected
//             ? "bg-blue-500 text-white focus:ring-4 focus:ring-blue-600 "
//             : "",
//           isCurrentPlan ? "bg-blue-500 text-white ring-2 ring-blue-600" : ""
//         )}
//       >
//         {isCurrentPlan ? "Manage Subscription" : "Subscribe"}
//       </Button>
//     </form>
//   );
// }

//! ------------------------------------------------ TRY 2 ------------------------------------

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { manageStripeSubscriptionAction } from "@/app/_actions/stripe";
import { Loader2 } from "lucide-react";

type ManageUserSubscriptionButtonProps = {
  // onSubscribe: any;
  userId: string;
  email: string;
  isCurrentPlan: boolean;
  isSubscribed: boolean;
  stripeCustomerId?: string | null;
  stripePriceId: string;
  isSelected: boolean;
};

export default function ManageUserSubscriptionButton({
  // onSubscribe,
  userId,
  email,
  isCurrentPlan,
  isSubscribed,
  stripeCustomerId,
  stripePriceId,
  isSelected,
}: ManageUserSubscriptionButtonProps) {
  const [isPending, startTransition] = React.useTransition();
  const handleSubmit = (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const session = await manageStripeSubscriptionAction({
          userId,
          email,
          isCurrentPlan,
          isSubscribed,
          stripeCustomerId,
          stripePriceId,
        });

        if (session) {
          window.location.href = session.url ?? "/subscription";
        }
      } catch (error) {
        console.error((error as Error).message);
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <Button
        // href="#"
        // onClick={onSubscribe}
        disabled={isPending}
        // focus:ring-blue-500 dark:focus:ring-blue-500
        className={cn(
          "text-white bg-zinc-700 w-full mb-1 hover:bg-blue-600 focus:ring-4 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:text-white overflow-hidden",
          isSelected
            ? "bg-blue-500 text-white focus:ring-4 focus:ring-blue-300 "
            : "",
          isCurrentPlan ? "bg-blue-500 text-white ring-2 ring-blue-600" : ""
        )}
      >
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4animate-spin transition-all duration-300" />
        )}
        {isCurrentPlan ? "Manage Subscription" : "Subscribe"}
      </Button>
    </form>
  );
}
