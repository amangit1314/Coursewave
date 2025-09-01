import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Instructor } from "@/types/instructor";
import { useFetchInstructorCreatedCourses, useInstructorStore } from "@/zustand/instructorStore";
import { useEffect } from "react";
import InstructorCard, { InstructorCardLoadingSkeleton } from "../../_components/sections/InstructorCard";
import { MoreInstructorCreatedCoursesSkeleton } from "./skeletons/MoreInstructorCreatedCoursesSkeleton";
import { ErrorMessage } from "./ErrorMessage";
import { FaGraduationCap } from "react-icons/fa6";

const CourseInstructorInformationSection = ({
  instructor,
}: {
  instructor: Instructor;
}) => {
  const {
    fetchInstructorStats,
    instructorStudentsCount,
    instructorAverageStarRating,
    loadingState,
  } = useInstructorStore();

  // Use instructor.id instead of instructor.user.id for API calls
  const instructorId = instructor?.id || "undefined";

  // Fetch instructor courses using react-query hook
  const {
    data: instructorCreatedCourses,
    isLoading,
    isError,
    error,
  } = useFetchInstructorCreatedCourses(instructorId);

  // Fetch instructor stats on mount or when the instructorId changes
  useEffect(() => {
    if (instructorId && instructorId !== "undefined") {
      fetchInstructorStats(instructorId);
    }
  }, [instructorId, fetchInstructorStats]);

  // Handle loading, error, and empty instructor case
  if (loadingState.loading || isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <InstructorCardLoadingSkeleton />
          <MoreInstructorCreatedCoursesSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (loadingState.error || isError) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <ErrorMessage
            title="Failed to fetch Instructor data"
            message={
              loadingState.error || error?.message || "Unknown error occurred"
            }
          />
        </CardContent>
      </Card>
    );
  }

  // Default placeholder values
  const instructorProfilePicUrl =
    instructor?.user?.profileImageUrl ??
    "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg";
  const instructorName = instructor?.user?.name ?? "Coursewave";
  const instructorTag = "Full Stack Developer";
  const aboutInstructor = instructor?.bio ?? "Sample about";

  return (
    <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
      <CardHeader className="text-center pb-8">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Meet Your Instructor
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn from industry experts with proven track records
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 ">
        <InstructorCard
          instructorProfilePicUrl={instructorProfilePicUrl}
          instructorName={instructorName}
          instructorTag={instructorTag}
          aboutInstructor={aboutInstructor}
          instructorCreatedCourses={instructorCreatedCourses?.data?.length || 1}
          instructorStudentsCount={instructorStudentsCount || 1}
          instructorAverageStarRating={instructorAverageStarRating || 4.9}
        />

        {/* <MoreIntructorCreatedCourses
          instructorName={instructorName}
          instructorCreatedCourses={instructorCreatedCourses || []}
        /> */}
      </CardContent>
    </Card>
  );
};

export default CourseInstructorInformationSection;