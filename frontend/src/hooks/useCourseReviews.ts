
import { courseService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchCourseReviews = async (id: string) => {
  const result = await courseService.getCourseReviews(id);
  return result.data ?? [];
};

export function useCourseReviews(id?: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseReviews(id!),
    enabled: !!id, // Only run if id is present
  });
}
