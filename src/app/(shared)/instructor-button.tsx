"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { Button } from "@/components/ui/button";
import { InstructorRegistrationForm } from "./InstructorRegisterationForm";
import { useUserStore } from "@/zustand/userStore";

const InstructorButton = () => {
  const router = useRouter();
  const { user, becomeInstructor } = useUserStore();
  const { instructor, isLoading: instructorLoading } = useInstructorInfo(
    user?.id || ""
  );
  const [showForm, setShowForm] = useState(false);

  const isInstructor = user?.roles?.includes("INSTRUCTOR") ?? false;

  const handleNavigation = () => {
    if (!user?.id) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return;
    }

    if (isInstructor && instructor?.id) {
      router.push(`/instructor/${instructor.id}/analytics`);
    } else if (isInstructor && !instructor?.id) {
      toast.error("Instructor profile not found. Please contact support.");
    } else {
      setShowForm(true);
    }
  };

  const handleBecomeInstructor = async (formData: {
    bio: string;
    expertise: string[];
    socialLinks?: any;
  }) => {
    try {
      if (!user?.id) {
        throw new Error("User ID is required.");
      }

      becomeInstructor(formData.bio, formData.expertise, formData.socialLinks);
      toast.success("Congratulations! You are now an instructor.");
      setShowForm(false);
      if (user?.id) {
        router.push(`/profile/${user.id}`);
      }
    } catch (error: any) {
      console.error("Error becoming instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to become an instructor. Please try again."
      );
    }
  };

  if (instructorLoading) {
    return (
      <Button disabled className="text-sm cursor-not-allowed h-10 px-4">
        Loading...
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleNavigation}
        className="text-sm cursor-pointer hover:text-white h-10 text-center flex justify-center items-center w-auto px-4 rounded-md border border-stroke hover:border-transparent bg-white dark:bg-zinc-800 dark:hover:bg-blue-600 hover:bg-blue-600 transition-all duration-100"
      >
        {isInstructor ? "Instructor Dashboard" : "Become Instructor"}
      </Button>

      {showForm && (
        <InstructorRegistrationForm
          onSubmit={handleBecomeInstructor}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default InstructorButton;
