"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

import CourseNavbar from "../../_components/CourseNavbar";
import { CoursePreviewLoadingSkeleton } from "./skeletons/CoursePreviewLoadingSekeleton";
import { ErrorMessage } from "./ErrorMessage";
import { CourseDetailsRightSection } from "./CourseDetailsRightSection";
import { CourseDetailsLeftSection } from "./CourseDetailsLeftSection";

import { useCourse, useCourseReviews, useCourseSections } from "@/hooks/useCourses";
import { Review } from "@/types/review";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";

// Lazy-load heavy below-the-fold sections
const CourseSectionsAndChapters = dynamic(
  () => import("./CourseSectionAndChapters").then((m) => ({ default: m.CourseSectionsAndChapters })),
  { ssr: false }
);
const CourseRatingsSection = dynamic(
  () => import("./CourseRatingsSection").then((m) => ({ default: m.CourseRatingsSection })),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/landing-page/footer").then((m) => ({ default: m.Footer })),
  { ssr: false }
);

const CoursePreviewClient = ({ courseId }: { courseId: string }) => {
  const [mounted, setMounted] = useState(false);

  // Fetch course data
  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const { data: reviews } = useCourseReviews(courseId);
  const { data: sections } = useCourseSections(courseId);

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
      toast.success(SUCCESS_MESSAGES.ENROLLMENT_SUCCESS, { duration: 5000 });
    } else if (canceled === "1") {
      toast.error("Payment was canceled. You can try again anytime.", {
        duration: 4000,
      });
    }

    if (success || canceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [mounted]);

  // Memoize data transformations to avoid recalculation on every render
  const safeReviews: Review[] = useMemo(
    () =>
      reviews?.data
        ? Array.isArray(reviews.data)
          ? reviews.data
          : [reviews.data]
        : [],
    [reviews?.data]
  );

  const safeSections = useMemo(
    () =>
      Array.isArray(sections)
        ? sections.map((s: any) => ({
            ...s,
            courseId,
            Chapter: Array.isArray(s.Chapter) ? s.Chapter : [],
          }))
        : [],
    [sections, courseId]
  );

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <CoursePreviewLoadingSkeleton />
      </div>
    );
  }

  // Error
  if (isError && error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <ErrorMessage
              title={ERROR_MESSAGES.COURSE_LOAD_FAILED}
              message={error.message || ERROR_MESSAGES.GENERIC}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found
  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <ErrorMessage
              title={ERROR_MESSAGES.COURSE_NOT_FOUND}
              message="This course does not exist or has been removed. Please browse our catalog for other courses."
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Course Navbar - Sticky */}
      {course.title && (
        <div className="sticky top-0 z-50">
          <CourseNavbar courseName={course.title} />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="space-y-8 lg:space-y-12">
          {/* Hero Section */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Mobile-only pricing card */}
              <div className="block md:hidden mt-6">
                <CourseDetailsRightSection course={course} />
              </div>

              <CourseDetailsLeftSection
                course={course}
                reviews={safeReviews}
              />
            </div>

            {/* Desktop pricing card */}
            <div className="hidden md:flex md:flex-col lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <CourseDetailsRightSection course={course} />
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 p-6 lg:p-8 shadow-md">
            <CourseSectionsAndChapters
              courseId={courseId}
              sections={safeSections}
            />
          </div>

          {/* Reviews Section */}
          <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 p-6 lg:p-8 shadow-md">
            <CourseRatingsSection reviews={safeReviews} course={course} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 lg:mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default CoursePreviewClient;
