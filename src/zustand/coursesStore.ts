import { absoluteUrl } from '@/utils/utils';
import { Course } from '@prisma/client';
import { create } from 'zustand';

type CoursesState = {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

type CoursesActions = {
  fetchCourses: () => Promise<void>;
}

const useCoursesStore = create<CoursesState & CoursesActions>()((set) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses`);

      if (!response.ok) {
        set({loading: false, error: 'Failed to fetch courses ...' })
      }

      const data = await response.json();
      const courses: Course[] = data?.data;

      set({ courses: courses, loading: false, error: null });
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      set({ loading: false, error: error.message });
    }
  },
}));

export default useCoursesStore;