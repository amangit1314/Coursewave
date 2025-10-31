import { useCourseInstructor } from "@/hooks/useCourses";
import { Instructor } from "@/types/course-details-api-response";
import Image from "next/image";

interface CourseContentInstructorCardProps {
  courseId: string;
  instructor: Instructor | null;
}

export default function CourseContentInstructorCard({
  courseId,
  instructor,
}: CourseContentInstructorCardProps) {
  // const { data: instructor, isLoading: isInstructorLoading } =
  //   useCourseInstructor(courseId);

  // // Loading state
  // const isLoading = isInstructorLoading;

  // if (isLoading) {
  //   return <CourseContentInstructorCardSkeleton />;
  // }

  const instructorID = instructor?.id ?? "N/A";
  const instructorName = instructor?.user.name ?? "CourseWave";
  const instructorTag = instructor?.expertise[0] ?? "Full Stack Engineer";
  const instructorProfilePicUrl =
    instructor?.user.profileImageUrl ?? "/assets/images/user/user-01.png";
  const aboutInstructor = instructor?.bio ?? `No profile description.`;

  if (!instructor) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        No instructor information available
      </p>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-white p-6 hover:shadow-md ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="flex items-center space-x-4">
        <div className="relative h-14 w-14 p-[2px] rounded-full ring-2 ring-blue-500 dark:ring-blue-400">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={instructorProfilePicUrl ?? "https://github.com/shadcn.png"}
              alt={`Image of ${instructorName}`}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {instructorName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {instructorTag}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
        {aboutInstructor}
      </div>
    </div>
  );
}

function CourseContentInstructorCardSkeleton() {
  return (
    <div className="relative w-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="flex items-center space-x-4">
        {/* Profile image shimmer */}
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-blue-500">
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 bg-[length:200%_100%] rounded-full" />
        </div>

        <div className="flex flex-col space-y-2">
          {/* Name shimmer */}
          <div className="h-4 w-32 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse bg-[length:200%_100%]" />
          {/* Tag shimmer */}
          <div className="h-3 w-20 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse bg-[length:200%_100%]" />
        </div>
      </div>

      {/* About text shimmer */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse bg-[length:200%_100%]" />
        <div className="h-3 w-5/6 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse bg-[length:200%_100%]" />
        <div className="h-3 w-4/6 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse bg-[length:200%_100%]" />
      </div>
    </div>
  );
}
