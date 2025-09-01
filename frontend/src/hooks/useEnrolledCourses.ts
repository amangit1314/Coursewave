import { userService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

export const useEnrolledCourses = () => {
  const fetchEnrolledCourses = async () => {
    const enrollments = await userService.getEnrolledCourses();
    console.log("Enrolled courses response:", enrollments);
    return enrollments;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourses,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, isLoading, error };
};
