"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";

type ManageUserSubscriptionButtonProps = {
  onSubscribe: any;
  isSelected: boolean;
  isCurrentPlan: boolean;
};

export default function ManageUserSubscriptionButton({
  onSubscribe,
  isSelected,
  isCurrentPlan,
}: ManageUserSubscriptionButtonProps) {
  return (
    // <form onSubmit={onSubscribe} action="">
      <Link
        href="#"
        onClick={onSubscribe}
        className={cn(
          "text-white  bg-zinc-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-blue-500",
          isSelected
            ? "bg-blue-500 text-white focus:ring-4 focus:ring-blue-600 "
            : "",
          isCurrentPlan ? "bg-blue-500 text-white ring-2 ring-blue-600" : ""
        )}
      >
        {isCurrentPlan ? "Manage Subscription" : "Subscribe"}
      </Link>
    // </form>
  );
}
