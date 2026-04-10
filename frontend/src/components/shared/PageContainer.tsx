"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/config/motion";
import { cn } from "@/lib/utils/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Max width variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthMap = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function PageContainer({
  children,
  className,
  size = "lg",
}: PageContainerProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "min-h-screen bg-background",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 py-8 sm:px-6 lg:px-8",
          maxWidthMap[size]
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
