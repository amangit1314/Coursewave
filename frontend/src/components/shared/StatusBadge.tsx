import { cn } from "@/lib/utils/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  error: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  neutral:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

/** Map common enrollment/payment status strings to a StatusType */
export function resolveStatusType(status: string): StatusType {
  const s = status.toUpperCase();
  if (s === "ACTIVE" || s === "COMPLETED" || s === "SUCCESS" || s === "completed")
    return "success";
  if (s === "PENDING" || s === "PAUSED" || s === "pending") return "warning";
  if (s === "CANCELLED" || s === "FAILED" || s === "cancelled") return "error";
  if (s === "INACTIVE") return "neutral";
  return "info";
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {label}
    </span>
  );
}
