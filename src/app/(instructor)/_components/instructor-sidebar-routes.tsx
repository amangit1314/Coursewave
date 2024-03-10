"use client";

import React from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { BsPatchQuestion } from "react-icons/bs";
import { BiBroadcast } from "react-icons/bi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";
import { VscFeedback } from "react-icons/vsc";
import { FaHandsHelping } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function InstructorSideBarRoutes() {
  let instructorId = "123456";

  const routes = [
    {
      icon: <TbBrandGoogleAnalytics size={22} />,
      label: "Analytics",
      href: `/instructor/${instructorId}/analytics`,
    },
    {
        icon: <BiBroadcast size={22} />,
        label: 'Sessions',
        href: `/instructor/${instructorId}/createdSessions`,
    },
    {
      icon: <BsPersonVideo2 size={22} />,
      label: "Courses",
      href: `/instructor/${instructorId}/courses/createdCourses`,
    },
    {
      icon: <HiUserGroup size={22} />,
      label: "Enrollments",
      href: `/instructor/${instructorId}/enrollements`,
    },
    {
      icon: <VscFeedback size={22} />,
      label: "Feedback",
      href: `/instructor/${instructorId}/feedback`,
    },
    {
      icon: <BsPatchQuestion size={22} />,
      label: "Questions",
      href: `/instructor/${instructorId}/questions`,
    },
    {
      icon: <AiFillSetting size={22} />,
      label: "Settings",
      href: `/instructor/${instructorId}/instructorSettings`,
    },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/instructor/${instructorId}/instructorSettings`,
    },
  ];

  return (
    <ul className="space-y-2 font-medium">
      {routes.map((route, index) => {
        return (
          <InstructorSidebarItem
            key={index}
            href={route.href}
            icon={route.icon}
            label={route.label}
          />
        );
      })}
    </ul>
  );
}

export default InstructorSideBarRoutes;

interface SidebarItemProps {
  label: string;
  icon: any;
  href: string;
}

function InstructorSidebarItem({ href, icon, label }: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive =
    (pathname?.includes("/analytics") && href.includes("/analytics")) ||
    (pathname?.includes("/courses") && href.includes("/courses")) ||
    (pathname?.includes("/sessions") && href.includes("/sessions")) ||
    (pathname?.includes("/enrollements") && href.includes("/enrollements")) ||
    pathname === href ||
    pathname?.includes(`${href}`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center w-full rounded-md text-gray-900 dark:text-white transition-all hover:bg-gray-100 dark:hover:bg-gray-700 group",
        isActive &&
          "text-blue-500 bg-blue-200/20 hover:bg-blue-200/20 hover:text-blue-500"
      )}
    >
      <div className="pl-2  flex py-2 item-center gap-x-2">
        <div className={cn("text-slate-500", isActive && "text-blue-500")}>
          {icon}
        </div>
        <span className="flex-1 ml-3 tracking-tight whitespace-nowrap">
          {label}{" "}
        </span>
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 rounded-l-md border-2 border-blue-500 h-8 transition-all ",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
}