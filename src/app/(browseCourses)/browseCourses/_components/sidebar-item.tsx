"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { FaLock } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";

interface SidebarItemProps {
  label: string;
  icon: any;
  href: string;
  isLocked: boolean;
}

const SidebarItem = ({ href, icon, label, isLocked }: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive =
    (pathname === "/browseCourses" && href === "browseCourses") ||
    pathname === href ||
    pathname?.startsWith(`${href}`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={isLocked}
      className={cn(
        "group flex w-full items-center rounded-md text-gray-900 transition-all disabled:cursor-not-allowed hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        isActive &&
          "bg-blue-200/20 text-blue-500 hover:bg-blue-200/20 hover:text-blue-500",
      )}
    >
      <div className="item-center flex gap-x-2 py-2 pl-2">
        <div className={cn("text-slate-500", isActive && "text-blue-500")}>
          {icon}
        </div>
        <span className="ml-3 flex-1 whitespace-nowrap tracking-tight">
          {label}{" "}
        </span>
      </div>
      <div
        className={cn(
          "ml-auto h-8 rounded-l-md border-2 border-blue-500 opacity-0 transition-all",
          isActive && "opacity-100",
        )}
      />
      {isLocked ? (
        <div>
          <CiLock className="mr-2 text-yellow-500" size={16} />
        </div>
      ) : (
        <div></div>
      )}
    </button>
  );
};

export default SidebarItem;
