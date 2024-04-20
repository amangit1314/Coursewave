"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserInfo from "@/hooks/use-user-info";
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

const UserAvatar = () => {
  const user = useUserInfo();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-lg cursor-pointer transition-all duration-300">
          <AvatarImage
            src={
              user.user?.profileImageUrl
                ? user.user?.profileImageUrl
                : "https://github.com/shadcn.png"
            }
            alt="username"
            className="object-cover"
          />
          <AvatarFallback>{user.user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 my-2 mr-2 rounded-xl overflow-hidden">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user.user?.id}/`}>Profile</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user.user?.id}/`}>⌘P</Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/subscription`}>Subscription</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user.user?.id}/`}>⌘S</Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="transition-all duration-300">
          Log out
          <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
