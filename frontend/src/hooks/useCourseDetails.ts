// hooks/useCourseDetails.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchCourseById = async (id: string) => {
  const { data } = await axios.get(`/api/courses/${id}`);
  return data;
};

export function useCourseDetails(id?: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id, // Only run if id is present
  });
}
