"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/zustand/userStore";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { BsPersonFillCheck } from "react-icons/bs";
import { TbJewishStar } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AiOutlineTransaction } from "react-icons/ai";

const UserAvatar = () => {
  const { user, logout } = useUserStore();

  const options = [
    {
      icon: <BsPersonFillCheck className="h-4 w-4" />,
      name: "Profile",
      link: `/profile/${user?.id}/`,
    },
    // {
    //   // icon: <RiMoneyDollarCircleLine className="h-4 w-4" />,
    //   icon: <AiOutlineTransaction className="h-4 w-4" />,
    //   name: "Subscription",
    //   link: `/subscription`,
    // },
    {
      icon: <FiShoppingCart className="h-4 w-4" />,
      name: "Cart",
      link: "/cart",
    },
    {
      icon: <TbJewishStar className="h-4 w-4" />,
      name: "Wishlist",
      link: "/wishlist",
    },
    {
      icon: <FiLogOut className="h-4 w-4" />,
      name: "Logout",
      link: "/cart",
    },
  ];

  const onLogout = async () => {
    logout();
  };

  return (
    <DropdownMenu>
      {/* User avatar */}
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer rounded-lg transition-all duration-300">
          <AvatarImage
            src={
              user?.profileImageUrl
                ? user?.profileImageUrl
                : "https://github.com/shadcn.png"
            }
            alt="username"
            className="object-cover"
          />
          <AvatarFallback>{user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent className="bg-white w-48 mx-4 dark:bg-zinc-800 border-stroke border-zinc-100 shadow-xl shadow-zinc-100 dark:shadow-zinc-900 dark:border-zinc-800 text-sm z-50">
        <DropdownMenuLabel className="sr-only">My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          {options.map((option, index) => (
            <React.Fragment key={option.name}>
              <DropdownMenuItem className="hover:bg-zinc-100 text-sm transition-all hover:text-black dark:hover:text-white duration-300 dark:hover:bg-zinc-700 cursor-pointer rounded-md">
                {option.name}
                <DropdownMenuShortcut>{option.icon}</DropdownMenuShortcut>
              </DropdownMenuItem>

              {index === options.length - 2 && (
                <DropdownMenuSeparator className="bg-zinc-100 h-px dark:bg-zinc-700 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
