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
import { CiUser, CiShoppingCart, CiSaveDown2 } from "react-icons/ci";
import { FaMoneyCheck } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import axios from "axios";
import { QueryClient } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const UserAvatar = () => {
  const router = useRouter();
  const user = useUserInfo();
  const [loading, setLoading] = React.useState(false);
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30,
      },
    },
  });

  const onLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/logout", user);
      queryClient.setQueryData(["user"], {});
      console.log("Logout success", response.data);

      successNotification("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Logout failed: ", error.message);
      errorNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Link href={`/profile/${user.user?.id}/`}>
                <CiUser />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user.user?.id}/`}>Cart</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user.user?.id}/`}>
                <CiShoppingCart />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="transition-all duration-300">
            <Link href={`/profile/${user.user?.id}/`}>Saved Courses</Link>
            <DropdownMenuShortcut>
              <Link href={`/profile/${user.user?.id}/`}>
                <CiSaveDown2 />
              </Link>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="transition-all duration-300"
        >
          { loading ? <Loader2 className="animate-spin" /> : 'Log out'}
          <DropdownMenuShortcut>
            <IoMdLogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
