import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Instructor } from "@/types/instructor";
import { Course } from "@/types/course";
import { instructorService } from "@/lib/api/services/instructor-service";
import { useQuery } from "@tanstack/react-query";

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
      fetchInstructorById: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const instructor = await instructorService.getInstructorByUserId(userId);
          set({
            instructor,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: { loading: false, error: error.message },
          });
        }
      },

      // Fetch instructor statistics (courses, student count, average rating)
      fetchInstructorStats: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          // First get the instructor by user ID
          const instructor = await instructorService.getInstructorByUserId(userId);
          if (!instructor) {
            throw new Error("Instructor not found");
          }
          
          // Then get analytics using the instructor ID
          const analytics = await instructorService.getInstructorAnalytics(instructor.id);
          set({
            instructorCreatedCourses: analytics.createdCourses,
            instructorStudentsCount: analytics.totalStudents,
            instructorAverageStarRating: analytics.averageStarRating,
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
    {
      name: "instructor-storage",
    }
  )
);

// Fetch Instructor's Courses
export const useFetchInstructorCreatedCourses = (userId: string) => {
  return useQuery({
    queryKey: ["instructorCourses", userId],
    queryFn: async () => {
      // First get the instructor by user ID
      const instructor = await instructorService.getInstructorByUserId(userId);
      if (!instructor) {
        throw new Error("Instructor not found");
      }
      
      // Then get courses using the instructor ID
      const courses = await instructorService.getInstructorCourses(instructor.id);
      return courses;
    },
    enabled: !!userId, // Only run the query if userId is available
  });
};

// Fetch Instructor's Earnings
export const useFetchInstructorEarnings = (userId: string) => {
  return useQuery({
    queryKey: ["instructorEarnings", userId],
    queryFn: async () => {
      // This endpoint might not exist yet, so we'll return a placeholder
      return { earnings: 0 };
    },
    enabled: !!userId,
  });
};
