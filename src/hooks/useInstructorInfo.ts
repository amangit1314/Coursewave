import { useQuery } from "@tanstack/react-query";
import { Instructor } from "@/types/instructor";
import { instructorService } from "@/lib/api/services/instructor-service";

export const useInstructorInfo = (userId: string) => {
  const fetchInstructorInfo = async () => {
    return await instructorService.getInstructorByUserId(userId);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["instructorByUserId", userId],
    queryFn: fetchInstructorInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes instead of 4 seconds
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount if data exists
    enabled: !!userId,
  });

  const instructor: Instructor = data as Instructor;
  console.log("Instructor Info in the useInstructorInfo hook", instructor);

  return { instructor, isLoading, error };
};
