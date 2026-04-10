"use client";

import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-8",
        className
      )}
    >
      <div>
        <h1
          className={cn(
            "text-2xl font-bold tracking-tight text-foreground",
            dmSans.className
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 mt-3 sm:mt-0">{children}</div>
      )}
    </div>
  );
}
