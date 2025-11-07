"use client";

import React, { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // Fetch course data
  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const { data: reviews } = useCourseReviews(courseId);
  const { data: sections } = useCourseSections(courseId);

  // Auth management
  const { user } = useUserStore();
  const { refetch: checkAuth } = useCheckAuth();
  const { mutateAsync: refreshAuth } = useRefreshToken();

  // Mount detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle success/cancel messages from Stripe checkout
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const canceled = params.get("canceled");

    if (success === "1") {
      toast.success(
        "🎉 Payment successful! You are now enrolled in this course.",
        {
          duration: 5000,
          icon: "🎓",
        }
      );
    } else if (canceled === "1") {
      toast.error("Payment was canceled. You can try again anytime.", {
        duration: 4000,
      });
    }

    if (success || canceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [mounted]);

  // Loading State with improved skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <CoursePreviewLoadingSkeleton />
      </div>
    );
  }

  // Error State with better styling
  if (isError && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <ErrorMessage
                title="Failed to Load Course"
                message={
                  error.message ||
                  "An unexpected error occurred while fetching the course information."
                }
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Normalize data for safe rendering
  const courseData = course;
  const safeReviews: Review[] = Array.isArray(reviews?.data)
    ? reviews.data
    : reviews?.data
      ? [reviews.data]
      : [];

  const safeSections = Array.isArray(sections)
    ? sections.map((s: any) => ({
        ...s,
        courseId,
        Chapter: Array.isArray(s.Chapter) ? s.Chapter : [],
      }))
    : [];

  // Course not found state
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <ErrorMessage
                title="Course Not Found"
                message="This course does not exist or has been removed. Please browse our catalog for other courses."
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const courseTitle = courseData.title;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Course Navbar - Sticky */}
      {courseTitle && (
        <div className="sticky top-0 z-50">
          <CourseNavbar courseName={courseTitle} />
        </div>
      )}

      {/* Main Content Container */}
      <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Course Content Grid with staggered animations */}
        <div className="space-y-8 lg:space-y-12">
          {/* Hero Section - Course Details */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Section - Main Course Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Show right section ONLY on mobile (below md) */}
              <div className="block md:hidden mt-6">
                <CourseDetailsRightSection course={courseData} />
              </div>

              <CourseDetailsLeftSection
                course={courseData}
                reviews={safeReviews}
              />
            </div>

            {/* Right Section - Enrollment Card */}
            <div className="hidden md:flex md:flex-col lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <CourseDetailsRightSection course={courseData} />
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 lg:p-8 shadow-lg">
              <CourseSectionsAndChapters
                courseId={courseId}
                sections={safeSections}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 lg:p-8 shadow-lg">
              <CourseRatingsSection reviews={safeReviews} course={courseData} />
            </div>
          </div>
        </div>

        {/* Scroll to top button could go here */}
      </div>

      {/* Footer */}
      <div className="mt-16 lg:mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default CoursePreviewClient;
