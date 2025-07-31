import { useQuery } from "@tanstack/react-query";
import { Course } from "@prisma/client";

export const useCourseInfo = (courseId: string) => {
  const fetchCourseInfo = async () => {
    const fetchCourseInfoUrl =
      process.env.ENVIRONMENT === "DEVELOPMENT"
        ? `/api/courses/${courseId}`
        : `api/courses/${courseId}`;

    const response = await fetch(`/api/courses/${courseId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to get course info for courseId: ${courseId} ...`,
      );
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: fetchCourseInfo,
    staleTime: 4,
  });

  const courseInfo: Course = data?.data!;
  console.log("Course info data in user-course-info hook ", courseInfo);
  return { courseInfo, error, isLoading };
};
