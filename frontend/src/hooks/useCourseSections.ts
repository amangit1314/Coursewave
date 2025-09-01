
import { courseService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchCourseSections = async (id: string) => {
  const result = await courseService.getCourseSections(id);
  return result.data ?? [];
};

export function useCourseSections(id?: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseSections(id!),
    enabled: !!id, // Only run if id is present
  });
}
