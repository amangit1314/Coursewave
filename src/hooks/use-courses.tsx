import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../lib/utils";
import { Course } from "@prisma/client";

const useCourses = () => {
  const fetchCourses = async () => {
    const coursesUrl = absoluteUrl(`/api/courses`);
    const response = await fetch(coursesUrl);

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

  const courses: Course[] = data?.data;

  return {courses , error, isLoading};
};

export default useCourses;