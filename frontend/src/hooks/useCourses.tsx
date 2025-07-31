import { useQuery } from "@tanstack/react-query";
import { Course } from "@prisma/client";

export const useCourses = () => {
  const fetchCourses = async () => {
    const coursesUrl =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/courses`
        : `api/courses`;

    const response = await fetch(`/api/courses`);

    if (!response.ok) {
      throw new Error(`Failed to get course info from ${coursesUrl} ...`);
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 4,
  });

  const courses: Course[] = data?.data as Course[];

  return { courses, error, isLoading };
};
