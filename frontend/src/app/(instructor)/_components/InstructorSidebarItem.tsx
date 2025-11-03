"use client";

import { poppins } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";



interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  isNested?: boolean;
  isLastItem?: boolean;
  isLocked?: boolean;
}

const InstructorSidebarItem = ({
  href,
  icon,
  label,
  isNested = false,
  isLastItem = false,
  isLocked = false,
}: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive =
    (pathname?.includes("/analytics") && href.includes("/analytics")) ||
    (pathname?.includes("/courses") && href.includes("/courses")) ||
    (pathname?.includes("/articles") && href.includes("/articles")) ||
    (pathname?.includes("/projects") && href.includes("/projects")) ||
    (pathname?.includes("/sessions") && href.includes("/sessions")) ||
    (pathname?.includes("/students") && href.includes("/students")) ||
    (pathname?.includes("/communities") && href.includes("/communities")) ||
    (pathname?.includes("/settings") && href.includes("/settings")) ||
    (pathname?.includes("/helpAndSupport") && href.includes("/helpAndSupport")) ||
    pathname === href;

  const onClick = () => {
    if (isLocked) return;
    router.push(href);
  };

  return (
    <div className={poppins.className}>
      <button
        onClick={onClick}
        type="button"
        disabled={isLocked}
        className={cn(
          "group w-full flex items-center rounded-xl transition-all duration-150",
          "pr-3 pl-2",
          isNested
            ? "ml-2 mr-2 my-2 bg-zinc-100 dark:bg-zinc-800/80 text-xs"
            : "bg-transparent",
          isActive &&
            "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow",
          isActive && !isNested && "border border-blue-500 shadow-sm",
          "hover:bg-blue-50 dark:hover:bg-blue-800",
          isLocked &&
            "opacity-60 cursor-not-allowed text-gray-400 dark:text-gray-500"
        )}
        style={{
          minHeight: "2.5rem", // modern touch target
        }}
      >
        <div
          className={cn(
            "flex items-center gap-x-3",
            isNested && "scale-90"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center text-xl",
              isActive && "text-blue-600 dark:text-blue-300",
              isLocked && "opacity-40"
            )}
          >
            {icon}
          </span>
          <span
            className={cn(
              "flex-1 text-left font-medium text-sm",
              isNested ? "text-xs" : "text-base",
              isLocked && "font-normal"
            )}
          >
            {label}
          </span>
        </div>
        {isActive && (
          <span className="ml-auto px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full shadow-sm">
            Active
          </span>
        )}
        {isLocked && (
          <div
            className="ml-auto pr-1 text-gray-400 dark:text-gray-500 select-none"
            title="Locked"
          >
            🔒
          </div>
        )}
      </button>
    </div>
  );
};

export default InstructorSidebarItem;
