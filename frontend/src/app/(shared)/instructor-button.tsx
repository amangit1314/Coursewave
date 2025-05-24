"use client";

import React from "react";
import toast from "react-hot-toast";
// import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { Button } from "@/components/ui/button";

const InstructorButton = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const userId = user?.id;
  const isUserAnInstructor = user?.isInstructor;
  console.log(
    "Is user instructor in instructor-button.tsx: ",
    isUserAnInstructor
  );

  const switchToInstructorView = () => {
    if (!userId || !user) {
      toast.error("Please provide user id ⚠ ...");
    } else if (isUserAnInstructor) {
      router.push(`/instructor/${userId}/analytics`);
    } else {
      toast.error("You are not an instructor ...");
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <Button
      onClick={switchToInstructorView}
      // className="mx-auto hidden cursor-pointer items-center rounded-md border border-black border-opacity-10 bg-transparent px-4 text-xs text-black transition-all duration-200 hover:border-opacity-100 hover:bg-slate-50 dark:border-white dark:border-opacity-10 dark:text-white dark:hover:border-opacity-100 dark:hover:bg-zinc-800 md:flex"
      className="text-sm cursor-pointer hover:text-white h-10 text-center flex justify-center items-center w-auto px-4 rounded-md border border-stroke hover:border-transparent bg-white dark:bg-zinc-800 dark:hover:bg-blue-600 hover:bg-blue-600 transition-all duration-100"
    >
      {isUserAnInstructor ? "Instructor View" : "Become Instructor"}
    </Button>
  );
};

export default InstructorButton;
