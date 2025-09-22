import { useQuery } from "@tanstack/react-query";
import { Instructor } from "@/types/instructor";
import { instructorService } from "@/lib/api/services/instructorService";

// For logged-in user
export const useMyInstructorProfile = () => {
  return useQuery<Instructor, Error>({
    queryKey: ["myInstructorProfile"],
    queryFn: async () => {
      const response = await instructorService.getInstructorProfile();
      return response; // <- already returns Instructor 
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// For any instructor by ID
export const useInstructorById = (instructorId?: string) => {
  return useQuery<Instructor, Error>({
    queryKey: ["instructorById", instructorId],
    queryFn: async () => {
      if (!instructorId) throw new Error("Instructor ID is required");
      const response = await instructorService.getInstructorById(instructorId);
      return response.data; // extract the actual Instructor object
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
