"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";

import CourseNavbar from "../../_components/CourseNavbar";
import { useUserStore } from "@/zustand/userStore";
import { Footer } from "@/components/LandingPage/footer";
import { CoursePreviewLoadingSkeleton } from "./skeletons/CoursePreviewLoadingSekeleton";
import { ErrorMessage } from "./ErrorMessage";
import { CourseRatingsSection } from "./CourseRatingsSection";
import { CourseSectionsAndChapters } from "./CourseSectionAndChapters";
import { CourseDetailsRightSection } from "./CourseDetailsRightSection";
import { CourseDetailsLeftSection } from "./CourseDetailsLeftSection";

import { useCourse } from "@/hooks/useCourses";
import { useCourseReviews } from "@/hooks/useCourses";
import { useCourseSections } from "@/hooks/useCourses";
import { useCheckAuth, useRefreshToken } from "@/hooks/useAuth";
import { Review } from "@/types/review";

const CoursePreviewClient = ({ courseId }: { courseId: string }) => {
  // Fetch course data
  const { data: course, isLoading, isError, error } = useCourse(courseId);

  const { data: reviews } = useCourseReviews(courseId);
  const { data: sections } = useCourseSections(courseId);

  // Auth management
  const { user } = useUserStore();
  const { refetch: checkAuth } = useCheckAuth();
  const { mutateAsync: refreshAuth } = useRefreshToken();

  // 🔹 Auto-refresh token when user is logged in
  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const result = await checkAuth();
        if (!result.data) {
          await refreshAuth();
        }
      } catch (err) {
        console.error("Auth check/refresh failed:", err);
      }
    })();
  }, [user?.id, checkAuth, refreshAuth]);

  // 🔹 Handle success/cancel messages from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const canceled = params.get("canceled");

    if (success === "1") {
      toast.success(
        "🎉 Payment successful! You are now enrolled in this course."
      );
    } else if (canceled === "1") {
      toast.error("Payment was canceled. You can try again anytime.");
    }

    if (success || canceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 🔹 Loading State
  if (isLoading) {
    return <CoursePreviewLoadingSkeleton />;
  }

  // 🔹 Error State
  if (isError && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-2xl">
              <ErrorMessage
                title="Failed to Fetch Course Information"
                message={error.message}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Normalize data for safe rendering
  const courseData = course?.data ?? null;
  const safeReviews: Review[] = reviews?.data ? [reviews.data] : [];

  const safeSections = Array.isArray(sections)
    ? sections.map((s: any) => ({
        ...s,
        courseId,
        Chapter: Array.isArray(s.Chapter) ? s.Chapter : [],
      }))
    : [];

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          title="Course Not Found"
          message="This course does not exist or has been removed."
        />
      </div>
    );
  }

  const courseTitle = courseData.title;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-12 lg:px-8">
        {/* 🔹 Course Navbar */}
        {courseTitle && (
          <div className="sticky top-0 z-50 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-transparent lg:mx-0 lg:px-0">
            <CourseNavbar courseName={courseTitle} />
          </div>
        )}

        {/* 🔹 Course Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseDetailsLeftSection
              course={courseData}
              reviews={safeReviews}
            />
          </div>
          <div className="lg:col-span-1">
            <CourseDetailsRightSection course={courseData} />
          </div>
        </div>

        {/* 🔹 Course Sections and Chapters */}
        <CourseSectionsAndChapters
          courseId={courseId}
          sections={safeSections}
        />

        {/* 🔹 Course Ratings */}
        <CourseRatingsSection reviews={safeReviews} course={courseData} />

        {/* 🔹 Instructor Info (optional) */}
        {/* {courseData.instructor && (
          <CourseInstructorInformationSection instructor={courseData.instructor} />
        )} */}
      </div>

      <Footer />
    </div>
  );
};

export default CoursePreviewClient;
