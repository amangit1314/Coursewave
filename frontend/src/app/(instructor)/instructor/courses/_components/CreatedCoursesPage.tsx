"use client";

import React from "react";
import toast from "react-hot-toast";
import { DataTable } from "./DataTable";
import { columns } from "./CreatedCoursesColumns";
import { useUserStore } from "@/zustand/userStore";
import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { BookOpenIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";
import { useMyCreatedCourses } from "@/hooks/useInstructor";

type CreatedCourseProps = {
  id: string;
  instructorId: string;
  image: string;
  name: string;
  href: string;
  price: any;
  status: "published" | "draft";
};

const CreatedCoursesPage = () => {
  const { user } = useUserStore();
  const instructorId = user?.id;
  const router = useRouter();

  const {
    data: createdCourses,
    isLoading,
    isError,
    error,
  } = useMyCreatedCourses();

  const transformedCourses = React.useMemo(() => {
    if (!createdCourses) return [];
    const toCreatedCourseProps = (course: Course): CreatedCourseProps => ({
      id: course.id,
      instructorId: course.instructorId!,
      image: course.imageUrl || "",
      href: `/instructor/courses/${course.id}`,
      name: course.title,
      price: course.price!,
      status: course.isPublished ? "published" : "draft",
    });
    return (createdCourses as Course[]).map(toCreatedCourseProps);
  }, [createdCourses, instructorId]);

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(`Error fetching courses: ${error.message}`);
    }
  }, [isError, error]);

  return (
    <div className="h-full pt-6 dark:bg-zinc-900">
      <div className="bg-white space-y-4 dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
              <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">
                Created Courses
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage and track the courses you've published
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/instructor/courses/create`)}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow-xl hover:bg-blue-700"
          >
            <IoAddCircleOutline size={22} />
            <span className="hidden sm:inline">Create Course</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading courses...
            </p>
          ) : (
            <DataTable columns={columns} data={transformedCourses} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatedCoursesPage;
