"use client";

import { motion } from "framer-motion";
import { staggerItem, hoverLift } from "@/lib/config/motion";
import { cn } from "@/lib/utils/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label?: string };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  trend,
  className,
}: StatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      {...hoverLift}
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className={cn("rounded-lg p-2", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend.value >= 0 ? "text-emerald-600" : "text-red-500"
          )}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}%{trend.label && ` ${trend.label}`}
        </p>
      )}
    </motion.div>
  );
}
