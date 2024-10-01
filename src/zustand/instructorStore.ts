import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course, Instructor } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type InstructorState = {
  instructor: Instructor | null;
  instructorCreatedCourses: Course[] | null;
  instructorStudentsCount: number;
  instructorAverageStarRating: number;
  loadingState: LoadingState;
  instructorSettingsPreferences: any[]; // Customize as per your preferences schema
};

type InstructorActions = {
  fetchInstructorById: (instructorId: string) => Promise<void>;
  fetchInstructorStats: (instructorId: string) => Promise<void>;
  setInstructor: (instructor: Instructor | null) => void;
  setPreferences: (preferences: any[]) => void;
};

export const useInstructorStore = create<InstructorState & InstructorActions>()(
  persist(
    (set) => ({
      instructor: null,
      instructorCreatedCourses: null,
      instructorStudentsCount: 0,
      instructorAverageStarRating: 0,
      loadingState: { loading: false, error: null },
      instructorSettingsPreferences: [],

      // Set instructor data
      setInstructor: (instructor: Instructor | null) => set({ instructor }),

      // Fetch instructor by ID
      fetchInstructorById: async (instructorId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await axios.get(`/api/instructor/${instructorId}`);
          if (!response.data) {
            throw new Error("Failed to fetch instructor");
          }
          set({
            instructor: response.data.instructor,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: { loading: false, error: error.message },
          });
        }
      },

      // Fetch instructor statistics (courses, student count, average rating)
      fetchInstructorStats: async (instructorId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const { data } = await axios.get(
            `/api/instructor/${instructorId}/dashboard/analytics`,
          );
          set({
            instructorCreatedCourses: data.courses,
            instructorStudentsCount: data.studentsCount,
            instructorAverageStarRating: data.averageStarRating,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: { loading: false, error: error.message },
          });
        }
      },

      // Set instructor preferences
      setPreferences: (preferences: any[]) =>
        set({ instructorSettingsPreferences: preferences }),
    }),
    { name: "coursewave-instructor-store" },
  ),
);

// Fetch Instructor's Courses
export const useFetchInstructorCreatedCourses = (instructorId: string) => {
  return useQuery({
    queryKey: ["instructorCourses", instructorId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/instructor/${instructorId}/dashboard/analytics`,
      );
      return data.courses as CourseWithOtherFields[];
    },
    enabled: !!instructorId, // Only run the query if instructorId is available
  });
};

// Fetch Instructor's Earnings
export const useFetchInstructorEarnings = (instructorId: string) => {
  return useQuery({
    queryKey: ["instructorEarnings", instructorId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/instructor/${instructorId}/dashboard/earnings`,
      );
      return data.earnings;
    },
    enabled: !!instructorId,
  });
};

// Create a Course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      const { data } = await axios.post(
        `/api/instructor/create-course`,
        course,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate the courses query to refetch the list after a successful mutation
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
};

// Delete a Course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      instructorId,
      courseId,
    }: {
      instructorId: string;
      courseId: string;
    }) => {
      await axios.delete(`/api/instructor/${instructorId}/courses/${courseId}`);
    },
    onSuccess: () => {
      // Invalidate the courses query to refetch the list after deletion
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
};
