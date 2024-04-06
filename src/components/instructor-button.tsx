"use client";

import React from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/use-user-info";

const InstructorButton = () => {
  const router = useRouter();
  const user = useUserInfo();

  const userId = user.user?.id!;
  const isUserAnInstructor = user.user?.isInstructor;

  console.log("Is user instructor: ", isUserAnInstructor);

  const [isInstructor, setIsInstructor] = React.useState(!!isUserAnInstructor!);

  const switchToInstructorView = () => {
    if (!userId) {
      toast.error("Please provide user id ⚠ ...");
    } else if (isUserAnInstructor) {
      setIsInstructor(true);
      router.push(`/instructor/${userId}/analytics`);
    } else {
      setIsInstructor(false);
      toast.error("You are not an instructor ...");
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <Button
      onClick={switchToInstructorView}
      className="hidden md:flex cursor-pointer border-opacity-10 hover:bg-slate-50 dark:hover:border-opacity-100 dark:border-opacity-10 hover:border-opacity-100 dark:hover:bg-zinc-800 border px-4 border-black text-black text-xs dark:border-white dark:text-white bg-transparent rounded-md mx-auto transition-all duration-200 items-center"
    >
      {isInstructor ? "Instructor View" : "Become Instructor"}
    </Button>
  );
};

export default InstructorButton;
