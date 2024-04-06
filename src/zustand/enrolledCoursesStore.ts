import { db } from '@/lib/db';
import { Course } from '@prisma/client';
import { create } from 'zustand';

interface EnrolledCoursesState {
  enrolledCourses: Course[];
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  setEnrolledCourses: (courses: Course[]) => void;
}

const useEnrolledCoursesStore = create<EnrolledCoursesState>((set) => ({
  enrolledCourses: [],
  fetchEnrolledCourses: async (userId: string) => {
    try {
      // Replace with your actual Prisma client call
      const courses = await db.course.findMany({
        where: { enrollments: { some: { userId } } },
        include: { enrollments: true },
      });
      set((state) => ({ ...state, enrolledCourses: courses }));
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  },
  setEnrolledCourses: (courses: Course[]) =>
    set((state) => ({ ...state, enrolledCourses: courses })),
}));

export default useEnrolledCoursesStore;
