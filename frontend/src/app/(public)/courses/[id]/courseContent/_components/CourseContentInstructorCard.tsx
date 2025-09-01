// app/(course)/courses/[courseId]/courseContent/_components/CourseContentInstructorCard.tsx

import { Instructor } from "@/types/course-details-api-response";
import Image from "next/image";

interface CourseContentInstructorCardProps {
  instructor: Instructor;
}

export default function CourseContentInstructorCard({ instructor }: CourseContentInstructorCardProps) {
  const instructorID = instructor?.id ?? "N/A";
  const instructorName = instructor?.user.name ?? "CourseWave";
  const instructorTag = instructor?.expertise[0] ?? "Full Stack Engineer";
  const instructorProfilePicUrl = instructor?.user.profileImageUrl ?? "/assets/images/user/user-01.png";
  const aboutInstructor = instructor?.bio ?? `No profile description.`;

  return (
    <div className="relative w-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="flex items-center space-x-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-blue-500">
          <Image
            src={instructorProfilePicUrl}
            alt={`Image of ${instructorName}`}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {instructorName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{instructorTag}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
        {aboutInstructor}
      </div>
    </div>
  );
}
