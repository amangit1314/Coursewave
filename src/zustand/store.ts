import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { absoluteUrl } from '@/utils/utils';
import { Blog, Category, Chapter, ChapterNotes, Course, CourseAttachment, CourseProgress, CourseSection, Instructor, Review, User } from '@prisma/client';

type CoursewaveState = {
  courses: Course[];
  courseInfo: Course | null;
  categories: Category[];
  selectedCategory: Category | null;
  filteredCourses: Course[];
  user: User | null;
  cartCourses: Course[];
  wishListedCourses: Course[];
  enrolledCourses: Course[];
  articles: Blog[];
  savedArticles: Blog[];
  createdArticles: Blog[];
  instructorInfo: Instructor | null;
  instructorCourses: Course[];
  instructorCourse: Course | null;
  selectedCourse: Course | null;
  courseProgress: CourseProgress | null;
  courseAttachments: CourseAttachment[];
  courseSections: CourseSection[];
  courseSectionChapters: Chapter[];
  courseSectionChapterInfo: Chapter | null;
  chapterNotes: ChapterNotes[];
  courseReviews: Review[];
  error: String | null;
  loading: boolean;
}

type CoursewaveActions = {
  setUser: (user: User | null) => void;
  // fetchUserInfo: () => Promise<void>;
  addToCart: (userId: string, courseId: string) => Promise<void>;
  removeFromCart: (userId: string, courseId: string) => void;
  addToWishList: (userId: string, course: Course) => Promise<void>;
  removeFromWishList: (courseId: string) => void;
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  fetchArticles: () => Promise<void>;
  createArticle: (title: string, content: string, thumbnailUrl: string | null, estimatedReadingTime: string, authorId: string) => Promise<void>;
  editArticle: (title: string, content: string, thubnailUrl: string | null, estimatedReadingTime: string, authorId: string) => Promise<void>;
  fetchCreatedArticles: (userId: string) => Promise<void>;
  fetchSavedArticles: (userId: string) => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSelectedCourseInfo: (courseId: string) => Promise<void>;
  fetchInstructorCourses: (instructorId: string) => Promise<void>;
  fetchInstructorSelectedCourseInfo: (instructorId: string, courseId: string) => Promise<void>;
  fetchCourseProgress: (userId: string, courseId: string) => Promise<void>;
  fetchCourseAttachments: (courseId: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchCourseSectionInfo: (courseId: string, sectionId: string) => Promise<void>;
  fetchCourseSectionChapterInfo: (courseId: string, sectionId: string, chapterId: string) => Promise<void>;
  fetchChapterNotes: (userId: string, courseId: string, chapterId: string) => Promise<void>;
  fetchCourseReviews: (courseId: string) => Promise<void>;
}

const fetchCourse = async (courseId: string) => {
  const response = await fetch(absoluteUrl(`/api/courses/${courseId}`));
  if (!response.ok) {
    console.error("Failed to get course details");
    return null;
  }
  const data = await response.json();
  return data?.data! as Course;
};

export const useZustandStore = create<CoursewaveState & CoursewaveActions>()(persist((set) => ({
  courses: [],
  courseInfo: null,
  categories: [],
  selectedCategory: null,
  filteredCourses: [],
  user: null,
  cartCourses: [],
  wishListedCourses: [],
  enrolledCourses: [],
  articles: [],
  savedArticles: [],
  createdArticles: [],
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
  courseReviews: [],
  error: null,
  loading: false,
  setUser: (user: User | null) => set({ loading: false, user: user }),
  addToCart: async (userId: string,courseId: string) => {
    const course = await fetchCourse(courseId);
    if (course) {
      set((state) => ({ cartCourses: [...state.cartCourses, course] }));
    }
  },
  removeFromCart: (userId:string, courseId: string) => {
    set((state) => ({
      cartCourses: state.cartCourses.filter((course) => course.courseId !== courseId),
    }));
  },
  addToWishList: async (userId: string, course: Course) => {
    try {
      set((state) => ({ loading: true }));

      // 2. Call API endpoint to save the course (assuming user authentication)
      const response = await fetch(absoluteUrl(`/api/profile/${userId}/wishlist`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId })
      });

      if (!response.ok) {
        set((state) => ({ loading: false, error: 'Failed to save course ' }));
      }

      // 3. Update local state (if successful)
      set((state) => ({ wishListedCourses: [...state.wishListedCourses, course] }));
    } catch (error: any) {
      console.error("Error saving course:", error);
      set((state) => ({ error: error.message, loading: false }));
      // Handle errors in the UI
    }
  },
  removeFromWishList: (courseId: string) => { },
  fetchEnrolledCourses: async (userId: string) => { },
  fetchArticles: async () => {
  },
  createArticle: async (title: string, content: string, thumbnailUrl: string | null, estimatedReadingTime: string, authorId: string) => { },
  editArticle: async (title: string, content: string, thubnailUrl: string | null, estimatedReadingTime: string, authorId: string) => { },
  fetchCreatedArticles: async (userId: string) => { },
  fetchSavedArticles: async (userId: string) => { },
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const response = await fetch(absoluteUrl("/api/courses"));

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
      const response = await fetch(absoluteUrl(`/api/categories/`));

      if (!response.ok) {
        console.error("Failed to get categories from api/categories api ...");
      }

      const categories = await response.json();
      set({ categories: [{ categoryName: "All", createdAt: Date.now(), updatedAt: Date.now() }, ...categories.data], loading: false });
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
  fetchInstructorCourses: async (instructorId: string) => { },
  fetchInstructorSelectedCourseInfo: async (instructorId: string, courseId: string) => { },
  fetchCourseProgress: async (courseId: string, sectionId: string) => { },
  fetchCourseAttachments: async (courseId: string) => { },
  fetchCourseSections: async (courseId: string) => { },
  fetchCourseSectionInfo: async (courseId: string, sectionId: string) => { },
  fetchCourseSectionChapterInfo: async (courseId: string, sectionId: string, chapterId: string) => { },
  fetchChapterNotes: async (userId: string, courseId: string, chapterId: string) => { },
  fetchCourseReviews: async (courseId: string) => { }
}), { name: 'Coursewave-Store', getStorage: () => localStorage },));

// fetchUserInfo: async () => {
//   try {
//     set({ loading: true });
//     const response = await fetch(absoluteUrl(`/api/auth/me`));

//     if (!response.ok) {
//       console.error("Failed to get user info from auth/me api ...");
//     }

//     const data = await response.json();
//     const user: User = data?.data;

//     set({ user: user, loading: false, error: null });
//   } catch (error: any) {
//     console.error(
//       `Failed to get user info from auth/me api in @/zustand/store.ts, ERROR: ${error.message} ...`
//     );
//     set({ loading: false, error: error.message });
//   }
// },