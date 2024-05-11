import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Course } from "@prisma/client";

const useCourseInfo = (courseId: string) => {
  const fetchCourseInfo = async () => {
    const courseUrl = absoluteUrl(`/api/courses/${courseId}`);
    const response = await fetch(courseUrl);

    if (!response.ok) {
      throw new Error(`Failed to get course info from ${courseUrl} ...`);
    }

    return await response.json();
  }

  // const { data, error, isLoading } =
   return useQuery({
    queryKey: ["course", courseId],
    queryFn: fetchCourseInfo,
    staleTime: 4,
  });

  // const courseInfo: Course = data?.data!;

  // return { courseInfo, error, isLoading };
};

export default useCourseInfo;