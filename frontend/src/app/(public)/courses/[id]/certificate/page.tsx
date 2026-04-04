"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCourse, useCourseProgress } from "@/hooks/useCourses";
import { useUserStore } from "@/zustand/userStore";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

function generateCertificateId(enrollmentId: string): string {
  const hash = enrollmentId.replace(/-/g, "").slice(0, 12).toUpperCase();
  return `CW-${hash}`;
}

export default function GenerateCertificate() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const { user } = useUserStore();

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: progressData, isLoading: progressLoading } =
    useCourseProgress(courseId);

  const isLoading = courseLoading || progressLoading;

  const completionPercentage = useMemo(() => {
    if (!progressData) return 0;
    const p = progressData?.data ?? progressData;
    if (p?.totalChapters && p.totalChapters > 0) {
      return Math.round((p.completedChapters / p.totalChapters) * 100);
    }
    return 0;
  }, [progressData]);

  const enrollmentId = useMemo(() => {
    const p = progressData?.data ?? progressData;
    return p?.enrollmentId ?? "";
  }, [progressData]);

  const isCompleted = completionPercentage >= 100;

  const completionDate = useMemo(() => {
    const p = progressData?.data ?? progressData;
    if (p?.updatedAt) {
      return new Date(p.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [progressData]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div
        className={`${dmSans.className} flex min-h-screen items-center justify-center pt-[80px]`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Loading certificate...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${dmSans.className} flex min-h-screen items-center justify-center pt-[80px]`}
      >
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
            Sign in required
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Please sign in to view your certificate.
          </p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isCompleted) {
    return (
      <div
        className={`${dmSans.className} flex min-h-screen items-center justify-center pt-[80px]`}
      >
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 text-6xl">📚</div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            Course Not Completed
          </h2>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            You need to complete all chapters before you can generate your
            certificate.
          </p>
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                Your progress
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <Link href={`/courses/${courseId}/courseContent`}>
            <Button>Continue Learning</Button>
          </Link>
        </div>
      </div>
    );
  }

  const certificateId = generateCertificateId(enrollmentId || courseId);

  return (
    <div className={`${dmSans.className} pt-[80px]`}>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-container,
          #certificate-container * {
            visibility: visible;
          }
          #certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>

      {/* Download button - hidden in print */}
      <div className="no-print mx-auto mb-8 flex max-w-4xl items-center justify-between px-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          &larr; Back to course
        </Link>
        <Button onClick={handleDownloadPDF}>Download as PDF</Button>
      </div>

      {/* Certificate */}
      <div id="certificate-container" className="mx-auto max-w-4xl px-4 pb-12">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* Blue gradient header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-10 text-center text-white">
            <div className="mb-2 text-sm font-medium uppercase tracking-widest opacity-90">
              Certificate of Completion
            </div>
            <h1 className="text-4xl font-bold tracking-tight">CourseWave</h1>
          </div>

          {/* Certificate body */}
          <div className="px-8 py-12 text-center sm:px-16">
            <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              This is to certify that
            </p>
            <h2 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              {user.name || "Student"}
            </h2>

            <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              has successfully completed the course
            </p>
            <h3 className="mb-8 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              {course?.title || "Course"}
            </h3>

            {/* Decorative divider */}
            <div className="mx-auto mb-8 flex w-48 items-center justify-center gap-2">
              <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-600" />
              <div className="h-2 w-2 rotate-45 bg-blue-500" />
              <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-600" />
            </div>

            <div className="mb-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Date of Completion
                </p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {completionDate}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Certificate ID
                </p>
                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                  {certificateId}
                </p>
              </div>
            </div>

            {/* Instructor signature area */}
            <div className="mx-auto max-w-xs border-t border-zinc-300 pt-4 dark:border-zinc-600">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                CourseWave Learning Platform
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-200 bg-zinc-50 px-8 py-4 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Verify this certificate at coursewave.com/verify/{certificateId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
