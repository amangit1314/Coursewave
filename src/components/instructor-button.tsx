"use client";

import React from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";

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
      className="mx-auto hidden cursor-pointer items-center rounded-md border border-black border-opacity-10 bg-transparent px-4 text-xs text-black transition-all duration-200 hover:border-opacity-100 hover:bg-slate-50 dark:border-white dark:border-opacity-10 dark:text-white dark:hover:border-opacity-100 dark:hover:bg-zinc-800 md:flex"
    >
      {isInstructor ? "Instructor View" : "Become Instructor"}
    </Button>
  );
};

export default InstructorButton;
