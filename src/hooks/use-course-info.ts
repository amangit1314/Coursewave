import { useQuery } from "@tanstack/react-query";
import { Course } from "@prisma/client";
import { absoluteUrl } from "@/utils/utils";

const useCourseInfo = (courseId: string) => {
  const fetchCourseInfo = async () => {
    const response = await fetch(
      // process.env.ENVIRONMENT! === "DEVELOPMENT" ? 
      `/api/courses/${courseId}`
      //  : `api/courses/${courseId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get course info for courseId: ${courseId} ...`);
    }

    return await response.json();
  }

  const { data, error, isLoading } =
    // return
    useQuery({
      queryKey: ["course", courseId],
      queryFn: fetchCourseInfo,
      // staleTime: 4,
    });

  const courseInfo: Course = data?.data!;
  console.log('Course info data in user-course-info hook ', courseInfo);
  return { courseInfo, error, isLoading };
};

export default useCourseInfo;