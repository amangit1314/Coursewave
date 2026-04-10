"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/config/motion";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function UnauthorizedState({
  title = "Unauthorized Access",
  description = "You don't have permission to view this page.",
  action,
  className,
}: UnauthorizedStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center justify-center min-h-[400px] p-6",
        className
      )}
    >
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button onClick={action.onClick} className="mt-6">
            {action.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
