
"use client";

import React, { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import {
  BsFolder2,
  BsPersonVideo2,
  BsProjector,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { FaBloggerB, FaHandsHelping, FaUsers } from "react-icons/fa";
import { MdOndemandVideo, MdGroups } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa6";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { useUserStore } from "@/zustand/userStore";
import InstructorSidebarItem from "./InstructorSidebarItem";

const InstructorSideBarRoutes = () => {
  const { user } = useUserStore();

  const routeGroups = [
    {
      group: "Analytics",
      key: "analytics",
      icon: <TbBrandGoogleAnalytics size={20} />,
      routes: [
        {
          icon: <TbBrandGoogleAnalytics size={18} />,
          label: "Dashboard",
          href: `/instructor/analytics`,
          isLocked: false,
        },
        // {
        //   icon: <FaMoneyCheck size={18} />,
        //   label: "Earnings",
        //   href: `/instructor/earnings`,
        //   isLocked: !user,
        // },
        // {
        //   icon: <FaUsers size={18} />,
        //   label: "Students",
        //   href: `/instructor/students`,
        //   isLocked: !user,
        // },
      ],
    },
    {
      group: "Content",
      key: "content",
      icon: <BsFolder2 size={20} />,
      routes: [
        {
          icon: <BsPersonVideo2 size={18} />,
          label: "Courses",
          href: `/instructor/courses`,
          isLocked: !user,
        },
        {
          icon: <FaBloggerB size={18} />,
          label: "Articles",
          href: `/instructor/articles`,
          isLocked: !user,
        },
        {
          icon: <BsProjector size={18} />,
          label: "Projects",
          href: `/instructor/projects`,
          isLocked: !user,
        },
        // {
        //   icon: <MdOndemandVideo size={18} />,
        //   label: "Live Sessions",
        //   href: `/instructor/sessions`,
        //   isLocked: !user,
        // },
      ],
    },
    // {
    //   group: "Audience",
    //   key: "audience",
    //   icon: <FaUsers size={20} />,
    //   routes: [
    //     {
    //       icon: <MdGroups size={18} />,
    //       label: "Communities",
    //       href: `/instructor/communities`,
    //       isLocked: !user,
    //     },
    //   ],
    // },
    {
      group: "Settings",
      key: "settings",
      icon: <AiFillSetting size={20} />,
      routes: [
        {
          icon: <AiFillSetting size={18} />,
          label: "Profile & Settings",
          href: `/instructor/settings`,
          isLocked: !user,
        },
        {
          icon: <FaHandsHelping size={18} />,
          label: "Help & Support",
          href: `/instructor/helpAndSupport`,
          isLocked: false,
        },
      ],
    },
  ];

  const [expandedGroups, setExpandedGroups] = useState(
    routeGroups.reduce((acc, group) => {
      acc[group.key] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <div className="flex flex-col font-medium">
      <ul className="space-y-1">
        {routeGroups.map((group) => (
          <li key={group.key} className="mb-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.key)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-x-2">
                <span className="text-slate-500">{group.icon}</span>
                <span className="tracking-tight">{group.group}</span>
              </div>
              {expandedGroups[group.key] ? (
                <BsChevronDown size={14} className="text-slate-400" />
              ) : (
                <BsChevronRight size={14} className="text-slate-400" />
              )}
            </button>
            {/* Group Routes w/ branching */}
            {expandedGroups[group.key] && (
              <ul className="relative mt-1 space-y-0 pl-4 pr-2">
                {group.routes.map((route, routeIndex) => (
                  <li key={route.label} className="relative">
                    <InstructorSidebarItem
                      href={route.href}
                      icon={route.icon}
                      label={route.label}
                      isNested={true}
                      isLastItem={routeIndex === group.routes.length - 1}
                      isLocked={route.isLocked}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorSideBarRoutes;
