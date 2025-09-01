import { courseService } from "@/lib/api/services";
import { Course } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCourses = () => {
  const { data, error, isLoading, isFetching, refetch, isError } = useQuery<
    Course[],
    Error
  >({
    queryKey: ["courses"],
    queryFn: async () => {
      const result = await courseService.getCourses(); // ✅ No params passed here
      return result ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 mins cache
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    courses: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};
