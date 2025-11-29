import { useQuery } from "@tanstack/react-query";
import { Instructor } from "@/types/instructor";
import { instructorService } from "@/lib/api/services/instructorService";
import { Course } from "@/types/course-details-api-response";
import { InstructorAnalytics } from "@/types/instructor.service.types";


// For logged-in user
export const useIsInstructor = () => {
  return useQuery<boolean, Error>({
    queryKey: ["isInstructor"],
    queryFn: async () => {
      const response = await instructorService.getIsInstructor();
      return response.data; // extract the boolean status
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// For logged-in user
export const useMyInstructorProfile = () => {
  return useQuery<Instructor, Error>({
    queryKey: ["myInstructorProfile"],
    queryFn: async () => {
      return await instructorService.getInstructorProfile(); // already returns unwrapped Instructor
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

// For loggedin instructor user to get created courses
export const useMyCreatedCourses = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["myCreatedCourses"],
    queryFn: async () => {
      const response = await instructorService.getMyCreatedCourses({
        page: page,
        limit: limit,
      });
      return response.data; // extract the actual created courses
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useMyInstructorAnlaytics = () => {
  return useQuery<InstructorAnalytics>({
    queryKey: ["myInstructorAnalytics"],
    queryFn: async () => {
      const res = await instructorService.getMyAnalytics();
      return res.data;
    },

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
