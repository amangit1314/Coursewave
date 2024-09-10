"use client";

import React from "react";
import SidebarItem from "./sidebar-item";
import { FaCompass } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { useUserInfo } from "@/hooks/useUserInfo";
import { AiFillSetting, AiOutlineTransaction } from "react-icons/ai";
import { FaBloggerB } from "react-icons/fa";
import { BiBroadcast } from "react-icons/bi";
import { PiChatsTeardropFill } from "react-icons/pi";

const SideBarRoutes = () => {
  const user = useUserInfo();
  const routes = [
    {
      icon: <MdDashboard size={22} />,
      label: "Dashboard",
      href: `/${user.user?.id}/dashboard`,
      isLocked: true,
    },
    {
      icon: <FaCompass size={22} />,
      label: "Courses",
      href: `/browseCourses`,
      isLocked: false,
    },
    {
      icon: <FaBloggerB size={22} />,
      label: "Articles",
      href: `/articles`,
      isLocked: false,
    },
    {
      icon: <BiBroadcast size={22} />,
      label: "Sessions",
      href: `/browseSessions`,
      isLocked: false,
    },
    {
      icon: <PiChatsTeardropFill size={22} />,
      label: "Community Chat",
      href: `/${user.user?.id}/communityChat`,
      isLocked: true,
    },
    {
      icon: <AiOutlineTransaction size={22} />,
      label: "Subscription",
      href: `/subscription`,
      isLocked: true,
    },
    {
      icon: <AiFillSetting size={22} />,
      label: "Settings",
      href: `/settings`,
      isLocked: true,
    },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/helpAndSupport`,
      isLocked: false,
    },
  ];
  return (
    <div className="flex flex-col justify-between font-medium">
      <ul className="space-y-2 font-medium">
        {routes.map((route, index) => {
          return (
            <SidebarItem
              key={index}
              href={route.href}
              icon={route.icon}
              label={route.label}
              isLocked={route.isLocked}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default SideBarRoutes;
