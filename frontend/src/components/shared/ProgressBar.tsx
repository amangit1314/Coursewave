"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  size = "sm",
  color = "bg-primary",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          size === "sm" ? "h-2" : "h-3"
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[2.5rem] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
