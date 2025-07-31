"use client";

import React from "react";
import SidebarItem from "./SidebarItem";
import { FaCompass } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { AiFillSetting, AiOutlineTransaction } from "react-icons/ai";
import { FaBloggerB } from "react-icons/fa";
import { BiBroadcast } from "react-icons/bi";
import { PiChatsTeardropFill } from "react-icons/pi";
import { useUserStore } from "@/zustand/userStore";
import { RiRoadMapLine } from "react-icons/ri";
import { GoProjectTemplate } from "react-icons/go";

const SideBarRoutes = () => {
  const { user, userId } = useUserStore();

  const routes = [
    {
      icon: <MdDashboard size={22} />,
      label: "Dashboard",
      href: `/${user?.id}/dashboard`,
      isLocked: user ? false : true,
    },
    {
      icon: <FaCompass size={22} />,
      label: "Courses",
      href: `/browse`,
      isLocked: false,
    },
    // {
    //   icon: <FaBloggerB size={22} />,
    //   label: "Articles",
    //   href: `/articles`,
    //   isLocked: false,
    // },
    // {
    //   icon: <BiBroadcast size={22} />,
    //   label: "Sessions",
    //   href: `/browseSessions`,
    //   isLocked: false,
    // },
    // {
    //   icon: <RiRoadMapLine size={22} />,
    //   label: "Roadmaps",
    //   href: `/roadmaps`,
    //   isLocked: false,
    // },
    // {
    //   icon: <GoProjectTemplate size={22} />,
    //   label: "Projects",
    //   href: `/projects`,
    //   isLocked: false,
    // },
    // {
    //   icon: <PiChatsTeardropFill size={22} />,
    //   label: "Community Chat",
    //   href: `/communityChat`,
    //   isLocked: user ? false : true,
    // },
    // {
    // icon: <AiOutlineTransaction size={22} />,
    // label: "Subscription",
    // href: `/subscription`,
    //   isLocked: user ? false : true,
    // },
    // {
    //   icon: <AiFillSetting size={22} />,
    //   label: "Settings",
    //   href: `/settings`,
    //   isLocked: user ? false : true,
    // },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/helpAndSupport`,
      isLocked: user ? false : true,
    },
  ];

  return (
    <div className="flex flex-col justify-between font-medium">
      <ul className="space-y-2 font-medium ">
        {routes.map((route, index) => {
          return (
            <SidebarItem
              key={index}
              icon={route.icon}
              label={route.label}
              href={route.href}
              isLocked={route.isLocked}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default SideBarRoutes;
