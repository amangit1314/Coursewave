"use client";


import { create } from "zustand";
import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";
import { InstructorPreference, getErrorMessage } from "@/types/common-types";

// =================== TYPES ===================
type InstructorStore = {
  instructor: Instructor | null;
  instructorError: string | null;
  instructorLoading: boolean;
  instructorCourses: Course[];
  totalEarnings: number;
  instructorSettingsPreferences: InstructorPreference[];

  // Actions
  fetchInstructorInfo: (instructorId: string) => Promise<void>;
  fetchInstructorCourses: (instructorId: string) => Promise<void>;
  setPreferences: (preferences: InstructorPreference[]) => void;
};

// =================== STORE ===================
export const useInstructorStore = create<InstructorStore>((set) => ({
  // Initial State
  instructor: null,
  instructorError: null,
  instructorLoading: false,
  instructorCourses: [],
  totalEarnings: 0,
  instructorSettingsPreferences: [],

  // Fetch instructor information
  fetchInstructorInfo: async (instructorId: string) => {
    set({ instructorLoading: true, instructorError: null });
    try {
      // TODO: Implement API call
      // const response = await instructorService.getInstructorById(instructorId);
      // set({ instructor: response.data, instructorLoading: false });
      set({ instructorLoading: false });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("Error fetching instructor info:", errorMessage);
      set({ instructorError: errorMessage, instructorLoading: false });
    }
  },

  // Fetch instructor's courses
  fetchInstructorCourses: async (instructorId: string) => {
    set({ instructorLoading: true, instructorError: null });
    try {
      // TODO: Implement API call
      // const response = await instructorService.getInstructorCourses(instructorId);
      // set({ instructorCourses: response.data, instructorLoading: false });
      set({ instructorLoading: false });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("Error fetching instructor courses:", errorMessage);
      set({ instructorError: errorMessage, instructorLoading: false });
    }
  },

  // Set instructor preferences
  setPreferences: (preferences: InstructorPreference[]) =>
    set({ instructorSettingsPreferences: preferences }),
}));
