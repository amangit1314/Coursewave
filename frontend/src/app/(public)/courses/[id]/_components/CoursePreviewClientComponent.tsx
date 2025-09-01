"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";
import CourseNavbar from "../../_components/CourseNavbar";
import { useUserStore } from "@/zustand/userStore";
import { Footer } from "@/app/(shared)/LandingPage/footer";
import { CoursePreviewLoadingSkeleton } from "./skeletons/CoursePreviewLoadingSekeleton";
import { ErrorMessage } from "./ErrorMessage";
import { CourseRatingsSection } from "./CourseRatingsSection";
import { CourseSectionsAndChapters } from "./CourseSectionAndChapters";
import { CourseDetailsRightSection } from "./CourseDetailsRightSection";
import { CourseDetailsLeftSection } from "./CourseDetailsLeftSection";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useCourseReviews } from "@/hooks/useCourseReviews";
import { useCourseSections } from "@/hooks/useCourseSections";

const CoursePreviewClient = ({ courseId }: { courseId: string }) => {
  console.log(
    `Course id in courses/[id]/page.tsx before fetching data: ${courseId}`
  );

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useCourseDetails(courseId);
  const { data: reviews } = useCourseReviews(courseId);
  const { data: sections } = useCourseSections(courseId);

  const { user, checkAuthToken, refreshAuthToken } = useUserStore();

  console.log("Course Reviews: ", JSON.stringify(reviews));

  // Handle success/cancel messages from Stripe checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");

    if (success === "1") {
      toast.success(
        "🎉 Payment successful! You are now enrolled in this course."
      );
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "1") {
      toast.error("Payment was canceled. You can try again anytime.");
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-refresh token if user is authenticated but doesn't have a token
  useEffect(() => {
    const autoRefreshToken = async () => {
      // console.log("=== Auto-refresh token check ===");
      // console.log("User:", user);

      if (user && user.id && user.id !== "null" && user.id !== "undefined") {
        const hasToken = checkAuthToken();
        // console.log("Has token:", hasToken);

        if (!hasToken) {
          // console.log(
          //   "User authenticated but no token found, attempting auto-refresh..."
          // );
          try {
            const refreshSuccess = await refreshAuthToken();
            // console.log("Auto-refresh result:", refreshSuccess);

            if (refreshSuccess) {
              // console.log("Auth token auto-refreshed successfully");
            } else {
              // console.warn("Failed to auto-refresh auth token");
            }
          } catch (error) {
            // console.error("Error during auto-refresh:", error);
          }
        } else {
          // console.log("User has valid token, no refresh needed");
        }
      } else {
        // console.log("No valid user found for auto-refresh");
      }
    };

    autoRefreshToken();
  }, [user, checkAuthToken, refreshAuthToken]);

  if (isLoading) {
    return <CoursePreviewLoadingSkeleton />;
  }

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

  // Handle course data - it might be an array or single object
  const courseData = Array.isArray(course) ? course[0] : course;

  // Provide fallback values only when rendering
  const courseTitle = courseData?.title;
  const instructor = courseData?.instructor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-12 lg:px-8">
        {/* Course Navbar */}
        {courseTitle && (
          <div className="sticky top-0 z-50 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-transparent lg:mx-0 lg:px-0">
            <CourseNavbar courseName={courseTitle} />
          </div>
        )}

        {/* Course Content */}
        {courseData && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CourseDetailsLeftSection course={courseData} reviews={reviews ?? []} />
            </div>
            <div className="lg:col-span-1">
              <CourseDetailsRightSection course={courseData} />
            </div>
          </div>
        )}

        {/* Course Sections and Chapters */}
        <div className="mt-12">
          <CourseSectionsAndChapters
            courseId={courseId}
            sections={
              (sections ?? []).map((section: any) => ({
                ...section,
                courseId: section.courseId ?? courseId,
                Chapter: section.Chapter ?? [],
              }))
            }
          />
        </div>

        {/* Course Ratings */}
        <div className="mt-12">
          <CourseRatingsSection reviews={reviews ?? []} course={courseData} />
        </div>

        {/* Instructor Info */}
        {/* {instructor && (
          <div className="mt-12">
            <CourseInstructorInformationSection instructor={instructor} />
          </div>
        )} */}
      </div>

      <Footer />
    </div>
  );
};

export default CoursePreviewClient;
