"use client";

import React from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaHandsHelping } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { Instructor } from "@prisma/client";

const InstructorSideBarRoutes = () => {
  const user = useUserInfo();
  const userId = user.user?.id!;

  const instructorData = useInstructorInfo(userId);

  // let instructorId = instructor.data?.data.instructorID! as string;
  let instructor: Instructor = instructorData?.instructor!;
  let instructorId = instructor?.instructorID!;

  const routes = [
    {
      icon: <TbBrandGoogleAnalytics size={22} />,
      label: "Analytics",
      href: `/instructor/${instructorId}/analytics`,
    },
    {
      icon: <BsPersonVideo2 size={22} />,
      label: "Courses",
      href: `/instructor/${instructorId}/courses/createdCourses`,
    },
    // {
    //   icon: <HiUserGroup size={22} />,
    //   label: "Enrollments",
    //   href: `/instructor/${instructorId}/enrollements`,
    // },
    // {
    //   icon: <VscFeedback size={22} />,
    //   label: "Feedback",
    //   href: `/instructor/${instructorId}/feedback`,
    // },
    // {
    //   icon: <BsPatchQuestion size={22} />,
    //   label: "Questions",
    //   href: `/instructor/${instructorId}/questions`,
    // },
    {
      icon: <AiFillSetting size={22} />,
      label: "Settings",
      href: `/instructor/${instructorId}/instructorSettings`,
    },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/instructor/${instructorId}/helpAndSupport`,
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
};

export default InstructorSideBarRoutes;

interface SidebarItemProps {
  label: string;
  icon: any;
  href: string;
}

const InstructorSidebarItem = ({ href, icon, label }: SidebarItemProps) => {
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
        "group flex w-full items-center rounded-md text-zinc-900 transition-all hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-700",
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
    </button>
  );
};
