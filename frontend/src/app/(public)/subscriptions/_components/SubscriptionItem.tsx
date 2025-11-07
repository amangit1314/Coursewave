import { dmSans } from "@/lib/config/fonts";
import { SubscriptionPlan } from "@/types/subscription.types";
import { useCurrencyStore } from "@/zustand/currencyStore";
import ManageUserSubscriptionButton from "./ManageUserSubscriptionButton";
import { TiTick } from "react-icons/ti";
import { cn } from "@/lib/utils/utils";

type Props = {
  plan: SubscriptionPlan;
  isSelected: boolean;
  canUpgrade: boolean;
  isSubscribed: boolean;
  isDummyFreePlan: boolean;
  isOnlyFreePlan: boolean;
  canCancel: boolean;
  subscribeToPlan: ({ planId }: { planId: string }) => Promise<void>;
  cancelSubscription: () => Promise<void>;
};

const SubscriptionItem = (props: Props) => {
  const {
    plan,
    isSelected,
    canUpgrade,
    isSubscribed,
    isDummyFreePlan,
    isOnlyFreePlan,
    canCancel,
    subscribeToPlan,
    cancelSubscription,
  } = props;
  const { formatPriceFixed } = useCurrencyStore();

  return (
    <div
      key={plan.id}
      className={cn(
        "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950",
        isSelected && "ring ring-blue-500"
      )}
      onClick={() => {}}
    >
      <h3
        className={`${dmSans.className} mb-2 text-lg font-medium text-zinc-900 dark:text-white`}
      >
        {plan.name}
      </h3>
      <p className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
        {formatPriceFixed(plan.price)}
        <span
          className={`${dmSans.className} text-zinc-500 text-xl dark:text-zinc-400 font-normal`}
        >
          /{plan.interval?.toLowerCase() || "month"}
        </span>
      </p>
      <ul className="space-y-3">
        {(plan.whatIncludes || []).map((feature: any) => (
          <li key={feature} className="flex items-start">
            <TiTick className="mt-1 h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
            <span className="ml-2 text-zinc-700 dark:text-zinc-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <ManageUserSubscriptionButton
          isCurrentPlan={isSelected}
          isLastSubscribedPlan={!!canUpgrade}
          isSubscribed={isSubscribed}
          isDummyFreePlan={isDummyFreePlan}
          isOnlyFreePlan={isOnlyFreePlan}
          canUpgrade={canUpgrade}
          canCancel={canCancel}
          onSubscribe={() =>
            subscribeToPlan({
              planId: plan.id,
            })
          }
          onUpgrade={() =>
            subscribeToPlan({
              planId: plan.id,
            })
          }
          onCancel={cancelSubscription}
        />
      </div>
    </div>
  );
};

export default SubscriptionItem;