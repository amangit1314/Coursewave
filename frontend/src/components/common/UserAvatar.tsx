"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { BsPersonFillCheck } from "react-icons/bs";
import { TbJewishStar } from "react-icons/tb";
import { useUserStore } from "@/zustand/userStore";
import { IMAGES } from "@/constants/images";

// You can replace with your own dialog/modal implementation or use a UI library
const SimpleDialog = ({ open, onConfirm, onCancel }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg w-[90vw] max-w-sm">
        <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
          Confirm Logout
        </h3>
        <p className="mb-6 text-zinc-600 dark:text-zinc-300">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-zinc-200 text-black hover:bg-zinc-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const UserAvatar = () => {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // let isInstructor = user?.roles?.includes("INSTRUCTOR") ?? false;
  const pathname = usePathname(); // Add this import: import { usePathname } from 'next/navigation';

  const options = [
    {
      icon: <BsPersonFillCheck className="h-4 w-4" />,
      name: "Profile",
      link: `/profile`,
    },
  ];

  // Conditionally add Cart and Wishlist only when not on instructor routes
  if (!pathname.includes("/instructor/")) {
    options.push(
      {
        icon: <FiShoppingCart className="h-4 w-4" />,
        name: "Cart",
        link: "/cart",
      },
      {
        icon: <TbJewishStar className="h-4 w-4" />,
        name: "Wishlist",
        link: "/wishlist",
      }
    );
  }

  // Always add Logout
  options.push({
    icon: <FiLogOut className="h-4 w-4" />,
    name: "Logout",
    link: "",
  });

  // Handles click on dropdown items
  const handleOptionClick = (option: {
    icon?: React.JSX.Element;
    name: any;
    link: any;
  }) => {
    if (option.name === "Logout") {
      setLogoutDialogOpen(true);
    } else if (option.link) {
      router.push(option.link);
    }
  };

  const onLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
    // Optionally redirect after logout (e.g., router.push('/login'))
  };

  return (
    <>
      <DropdownMenu>
        {/* User avatar */}
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer rounded-lg transition-all duration-300">
            <AvatarImage
              src={
                user?.profileImageUrl
                  ? user?.profileImageUrl
                  : IMAGES.SAMPLE_PERSON_1
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
                <DropdownMenuItem
                  className="hover:bg-zinc-100 text-sm transition-all hover:text-black dark:hover:text-white duration-300 dark:hover:bg-zinc-700 cursor-pointer rounded-md"
                  onClick={() => handleOptionClick(option)}
                >
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

      {/* Logout confirmation dialog */}
      <SimpleDialog
        open={logoutDialogOpen}
        onConfirm={onLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </>
  );
};

export default UserAvatar;
