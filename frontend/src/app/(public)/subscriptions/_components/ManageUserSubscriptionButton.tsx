import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import { Loader2 } from "lucide-react";

// --- Add extra props you might need for richer decisions
type ManageUserSubscriptionButtonProps = {
  isCurrentPlan: boolean;
  isSubscribed: boolean;
  isDummyFreePlan: boolean;
  canUpgrade: boolean;
  canCancel: boolean;
  isOnlyFreePlan: boolean;
  onSubscribe: () => void;
  onUpgrade: () => void;
  onCancel: () => void;
  isPending?: boolean; // if you want to forward hook-driven loading state
};

export default function ManageUserSubscriptionButton({
  isCurrentPlan,
  isSubscribed,
  isDummyFreePlan,
  canUpgrade,
  canCancel,
  isOnlyFreePlan,
  onSubscribe,
  onUpgrade,
  onCancel,
  isPending = false,
}: ManageUserSubscriptionButtonProps) {
  // You can use React.useTransition() here if you want to manage local pending
  // const [isPending, startTransition] = React.useTransition();

  let buttonLabel = "";
  let buttonAction: () => void = onSubscribe;
  let buttonDisabled = false;

  // LOGIC FOR BUTTON LABELS & ACTIONS
  if (isCurrentPlan) {
    if (isDummyFreePlan && isOnlyFreePlan) {
      buttonLabel = "Active Plan";
      buttonDisabled = true;
    } else if (isDummyFreePlan && canUpgrade) {
      buttonLabel = "Upgrade";
      buttonAction = onUpgrade;
    } else if (canUpgrade) {
      buttonLabel = "Manage Subscription"; // Could split to "Upgrade" if plan is higher
      buttonAction = onUpgrade;
    } else if (canCancel) {
      buttonLabel = "Cancel Subscription";
      buttonAction = onCancel;
    } else {
      buttonLabel = "Manage Subscription";
      buttonAction = onCancel;
    }
  } else if (canUpgrade) {
    buttonLabel = "Upgrade";
    buttonAction = onUpgrade;
  } else if (isDummyFreePlan && !isSubscribed) {
    buttonLabel = "Active Plan";
    buttonDisabled = true;
  } else {
    buttonLabel = "Subscribe";
    buttonAction = onSubscribe;
  }

  // Only one button―could expand to offer separate "Cancel" for current plan
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!buttonDisabled) buttonAction();
      }}
    >
      <Button
        disabled={isPending || buttonDisabled}
        className={cn(
          "w-full overflow-hidden rounded-lg bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-600 focus:ring focus:ring-blue-600 dark:text-white",
          isCurrentPlan ? "bg-blue-500 text-white ring ring-blue-500" : ""
        )}
        type="submit"
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonLabel}
      </Button>
      {/* Optionally, for current paid plan, show a separate inline Cancel below */}
      {isCurrentPlan && canCancel && buttonLabel !== "Cancel Subscription" && (
        <Button
          type="button"
          className="mt-2 w-full rounded-lg border border-red-500 text-red-500 bg-transparent hover:bg-red-50"
          onClick={e => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel Subscription
        </Button>
      )}
    </form>
  );
}
