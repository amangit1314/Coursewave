"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { manageStripeSubscriptionAction } from "@/app/_actions/stripe";
import { Loader2 } from "lucide-react";

type ManageUserSubscriptionButtonProps = {
  userId: string;
  email: string;
  isCurrentPlan: boolean;
  isSubscribed: boolean;
  stripeCustomerId?: string | null;
  stripePriceId: string;
  isSelected: boolean;
};

export default function ManageUserSubscriptionButton({
  userId,
  email,
  isCurrentPlan,
  isSubscribed,
  stripeCustomerId,
  stripePriceId,
  isSelected,
}: ManageUserSubscriptionButtonProps) {
  const [isPending, startTransition] = React.useTransition();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        disabled={isPending}
        className={cn(
          "mb-1 w-full overflow-hidden rounded-2xl bg-zinc-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:ring-4 dark:text-white",
          isSelected
            ? "bg-blue-500 text-white focus:ring-4 focus:ring-blue-300"
            : "",
          isCurrentPlan ? "bg-blue-500 text-white ring-2 ring-blue-600" : "",
        )}
      >
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin transition-all duration-300" />
        )}
        {isCurrentPlan ? "Manage Subscription" : "Subscribe"}
      </Button>
    </form>
  );
}
