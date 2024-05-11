'use client';

import React from "react";
import SidebarItem from "./sidebarItem";
import { FaCompass } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import useUserInfo from "@/hooks/use-user-info";
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
    },
    {
      icon: <FaCompass size={22} />,
      label: "Courses",
      href: `/browseCourses`,
    },
    {
      icon: <FaBloggerB size={22} />,
      label: "Articles",
      href: `/articles`,
    },
    // {
    //   icon: <BiBroadcast size={22} />,
    //   label: "Sessions",
    //   href: `/browseSessions`,
    // },
    // {
    //   icon: <PiChatsTeardropFill size={22} />,
    //   label: "Community Chat",
    //   href: `/${user.user?.id}/communityChat`,
    // },
    {
      icon: <AiOutlineTransaction size={22} />,
      label: "Subscription",
      href: `/subscription`,
    },
    {
      icon: <AiFillSetting size={22} />,
      label: "Settings",
      href: `/settings`,
    },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/helpAndSupport`,
    },
  ];
  return (
    <div className="flex flex-col font-medium justify-between">
      <ul className="space-y-2 font-medium">
        {routes.map((route, index) => {
          return (
            <SidebarItem
              key={index}
              href={route.href}
              icon={route.icon}
              label={route.label}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default SideBarRoutes;
