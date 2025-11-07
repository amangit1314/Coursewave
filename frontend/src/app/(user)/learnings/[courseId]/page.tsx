"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import CourseDetails from "./_components/CourseDetails";
import { useUserStore } from "@/zustand/userStore";
import toast from "react-hot-toast";

const CourseContentPage = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  const { user } = useUserStore();
  const router = useRouter();

  // Redirect if not enrolled or no user
  React.useEffect(() => {
    if (!user || !user.id) {
      toast.error("Please sign in to access this course");
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="h-auto overflow-x-hidden">
      <CourseDetails courseId={courseId} />
      <div className="h-12 w-2" />
    </div>
  );
};

export default CourseContentPage;
