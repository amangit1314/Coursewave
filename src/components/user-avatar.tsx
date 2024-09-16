"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserInfo } from "@/hooks/useUserInfo";
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
import { CiUser, CiShoppingCart, CiSaveDown2 } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useZustandStore } from "@/zustand/store";
import { useUserStore } from "@/zustand/userStore";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const UserAvatar = () => {
  const router = useRouter();

  const { user, setUser, loadingState } = useUserStore();

  // const onLogout = async () => {
  //   try {
  //     setLoading(true);
  //     await axios
  //       .post("api/auth/logout", user)
  //       .then((res) => {
  //         setUser({
  //           id: "",
  //           name: "",
  //           email: "",
  //           password: "",
  //           profileImageUrl: "",
  //           about: "",
  //           shortSummary: "",
  //           isEmailVerified: false,
  //           isInstructor: false,
  //           verifyToken: "",
  //           verifyTokenExpiry: "",
  //           verifyTokenGenerationTime: null,
  //           verifyTokenStatus: "EXPIRED",
  //           refreshTokenGenerationTime: null,
  //           refreshToken: "",
  //           refreshTokenExpiry: "",
  //           refreshTokenStatus: "",
  //           preferences: [],
  //           accessTokenGenerationTime: null,
  //           accessToken: "",
  //           accessTokenExpiry: "",
  //           accessTokenStatus: "",
  //           resetTokenGenerationTime: null,
  //           resetToken: "",
  //           resetTokenExpiry: "",
  //           resetTokenStatus: "",
  //           createdAt: null,
  //           updatedAt: null,
  //         });
  //       })
  //       .catch((err: any) => {
  //         toast.error(`Error loging out: ${err.message}`);
  //       });

  //     successNotification("Logged out successfully");
  //     router.push("/");
  //   } catch (error: any) {
  //     console.error("Logout failed: ", error.message);
  //     errorNotification(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onLogout = async () => {
    setUser({
      id: "",
      email: "",
      password: "",
      accessToken: "",
      preferences: {},
      name: null,
      profileImageUrl: null,
      about: null,
      shortSummary: null,
      isEmailVerified: null,
      isInstructor: null,
      verifyToken: null,
      verifyTokenGenerationTime: null,
      verifyTokenExpiry: null,
      verifyTokenStatus: null,
      refreshToken: null,
      refreshTokenGenerationTime: null,
      refreshTokenExpiry: null,
      refreshTokenStatus: null,
      accessTokenGenerationTime: null,
      accessTokenExpiry: null,
      accessTokenStatus: null,
      resetToken: null,
      resetTokenGenerationTime: null,
      resetTokenExpiry: null,
      resetTokenStatus: null,
      createdAt: null,
      updatedAt: null,
    });
  };

  return (
    <DropdownMenu>
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
      <DropdownMenuContent className="my-2 mr-2 w-56 overflow-hidden rounded-xl">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user?.id}/`}>Profile</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user?.id}/`}>
                <CiUser />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user?.id}/`}>Cart</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user?.id}/`}>
                <CiShoppingCart />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user?.id}/`}>Saved Courses</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user?.id}/`}>
                <CiSaveDown2 />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer transition-all duration-300"
        >
          {loadingState.loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Log out"
          )}
          <DropdownMenuShortcut>
            <IoMdLogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
