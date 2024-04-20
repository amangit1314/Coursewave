import { absoluteUrl } from '@/lib/utils';
import { create } from 'zustand';
import { Category, Chapter, ChapterNotes, Course, CourseAttachment, CourseProgress, CourseSection, Instructor, User } from '@prisma/client';

interface CoursewaveState {
  courses: Course[];
  courseInfo: Course | null;
  categories: Category[];
  selectedCategory: Category | null;
  filteredCourses: Course[];
  userInfo: User | null;
  instructorInfo: Instructor | null;
  instructorCourses: Course[];
  instructorCourse: Course | null;
  selectedCourse: Course | null;
  courseProgress: CourseProgress | null;
  courseAttachments: CourseAttachment[];
  courseSections: CourseSection[];
  // activeCourseSection: CourseSection | null;
  courseSectionChapters: Chapter[];
  courseSectionChapterInfo: Chapter | null;
  chapterNotes: ChapterNotes[];
  error: String | null;
  loading: Boolean;
  fetchUserInfo: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSelectedCourseInfo: (courseId: string) => Promise<void>;
}

export const useZustandStore = create<CoursewaveState>((set) => ({
  courses: [],
  courseInfo: null,
  categories: [],
  selectedCategory: null,
  filteredCourses: [],
  userInfo: null,
  instructorInfo: null,
  instructorCourses: [],
  instructorCourse: null,
  selectedCourse: null,
  courseProgress: null,
  courseAttachments: [],
  courseSections: [],
  courseSectionChapters: [],
  courseSectionChapterInfo: null,
  chapterNotes: [],
  error: null,
  loading: false,
  fetchUserInfo: async () => {
    try {
      set({ loading: true });
      const response = await fetch(absoluteUrl(`/api/auth/me`));

      if (!response.ok) {
        console.error("Failed to get user info from auth/me api ...");
      }

      const data = await response.json();
      const user: User = data?.data;

      set({ userInfo: user, loading: false, error: null });
    } catch (error: any) {
      console.error(
        `Failed to get user info from auth/me api in @/zustand/store.ts, ERROR: ${error.message} ...`
      );
      set({ loading: false, error: error.message });
    }
  },
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const response = await fetch("https://localhost:3000/api/courses/");

      if (!response.ok) {
        console.error("Failed to get user info from api/courses api ...");
      }

      const courses = await response.json();
      set({ courses: courses, loading: false });
    }

    catch (error: any) {
      console.error(
        `Failed to get user info from api/courses api, ERROR: ${error.message} ...`
      );
      set({ loading: false, error: error.message });
    }
  },
  fetchCategories: async () => {
    try {
      set({ loading: true });
      const response = await fetch("/api/categories/");

      if (!response.ok) {
        console.error("Failed to get categories from api/categories api ...");
      }

      const categories = await response.json();
      set({ categories: [{ categoryName: "All" }, ...categories.data], loading: false });
    }

    catch (error: any) {
      console.error(
        `Failed to get categories from api/categories api, ERROR: ${error.message} ...`
      );
      set({ loading: false, error: error.message });
    }
  },
  fetchSelectedCourseInfo: async (courseId: string) => {
    try {
      set({ loading: true });
      const response = await fetch(absoluteUrl(`/api/courses/${courseId}`));

      if (!response.ok) {
        console.error("Failed to get course for course with this courseId ...");
      }

      const course = await response.json();
      // const course: Course = data.data;

      set({ selectedCourse: course.data, loading: false, error: null });
    } catch (error: any) {
      console.error(
        `Failed to fetch course info for given courseId in @/zustand/store.ts, ERROR: ${error.message} ...`
      );
      set({ loading: false, error: error.message });
    }
  },
}));
