import { absoluteUrl } from '@/lib/utils';
import { Course } from '@prisma/client';
import { create } from 'zustand';

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(absoluteUrl(`/api/courses`));

      if (!response.ok) {
        set({error: 'Failed to fetch courses ...'})
      }

      const data = await response.json();
      const courses: Course[] = data?.data;

      set({ courses, loading: false });
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      set({ loading: false, error: error.message });
    }
  },
}));

export default useCoursesStore;
