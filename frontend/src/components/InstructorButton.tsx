"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InstructorRegistrationForm } from "./InstructorRegisterationForm";

import { useUserStore } from "@/zustand/userStore";
import { useBecomeInstructor } from "@/hooks/useAccount";

const InstructorButton = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const { user } = useUserStore();
  const { mutate: becomeInstructor, isPending } = useBecomeInstructor();

  const isInstructor = user?.roles?.includes("INSTRUCTOR") ?? false;

  const handleNavigation = () => {
    if (!user?.id) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return;
    }

    if (isInstructor) {
      router.push(`/instructor/analytics`);
    } else {
      setShowForm(true);
    }
  };

  const handleBecomeInstructor = (formData: {
    bio: string;
    expertise: string[];
    socialLinks?: any;
  }) => {
    if (!user?.id) {
      toast.error("User ID is required.");
      return;
    }

    becomeInstructor(formData, {
      onSuccess: (response) => {
        toast.success("Congratulations! You are now an instructor.");
        if (response.success && response.data?.user) {
          const updateUser = useUserStore((s) => s.updateUser);
          updateUser(response.data.user); // keep zustand in sync
        }
        setShowForm(false);
        router.push(`/instructor/analytics`);
      },
      onError: (error: any) => {
        console.error("Error becoming instructor:", error);
        const errorMessage = error.response?.data?.message ||
          "Failed to become an instructor. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <>
      <Button
        onClick={handleNavigation}
        disabled={isPending}
        className="text-sm cursor-pointer hover:text-white h-10 shadow-none text-center flex justify-center items-center w-auto px-4 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-transparent bg-white dark:bg-transparent dark:hover:bg-blue-600 hover:bg-blue-600 transition-all duration-100"
      >
        {isPending
          ? "Processing..."
          : isInstructor
            ? "Instructor Dashboard"
            : "Become Instructor"}
      </Button>

      {showForm && (
        <InstructorRegistrationForm
          onSubmit={handleBecomeInstructor}
          onClose={() => setShowForm(false)}
          isSubmitting={isPending}
        />
      )}
    </>
  );
};

export default InstructorButton;
