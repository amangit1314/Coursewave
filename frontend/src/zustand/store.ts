import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LearningGoal } from "@/types/learning-goal";
import { fetchCourseInfo } from "@/lib/helpers/data-fetching-methods";
import { User } from "@/types/user";
import { Course } from "@/types/course";
import { Category, Chapter, Instructor } from "@/types/user-enrollments-api-response";
import { Review } from "@/types/review";
import { Blog } from "@/types/blog.service.types";
import { CourseProgress, CourseSection } from "@/types/courses.service.types";

type CoursewaveState = {
  // user
  user: User | null;
  learningGoals: LearningGoal[];
  cartCourses: Course[];
  wishListedCourses: Course[];
  enrolledCourses: Course[];
  savedArticles: Blog[];
  createdArticles: Blog[];
  userSettingsPreferences: [];

  // categories
  categories: Category[];
  selectedCategory: Category | null;

  //  articles
  articles: Blog[];
  selectedArticle: Blog | null;

  // courses
  courses: Course[];
  courseInfo: Course | null;
  selectedCourse: Course | null;
  courseProgress: CourseProgress | null;
  courseAttachments: any[];
  courseSections: CourseSection[];
  courseSectionChapters: Chapter[];
  courseSectionChapterInfo: Chapter | null;
  chapterNotes: any[];
  courseReviews: Review[];
  filteredCourses: Course[];

  // instructor
  instructorInfo: Instructor | null;
  instructorCourses: Course[];
  instructorCourse: Course | null;

  // tracking states
  error: String | null;
  loading: boolean;
};

type CoursewaveActions = {
  // user actions
  setUser: (user: User | null) => void;
  addLearningGoal: (learningGoal: LearningGoal) => void;
  markLearningGoalAsDone: (id: string, isDone: boolean) => void;
  editLearningGoal: (
    id: string,
    title: string,
    tag: string,
    time: string,
  ) => void;
  addToCart: (userId: string, courseId: string) => Promise<void>;
  removeFromCart: (userId: string, courseId: string) => void;
  addToWishList: (userId: string, course: Course) => Promise<void>;
  removeFromWishList: (courseId: string) => void;
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  fetchArticles: () => Promise<void>;
  createArticle: (
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string,
  ) => Promise<void>;
  editArticle: (
    title: string,
    content: string,
    thubnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string,
  ) => Promise<void>;
  fetchCreatedArticles: (userId: string) => Promise<void>;
  fetchSavedArticles: (userId: string) => Promise<void>;
  saveArticle: (article: Blog) => void;
  unsaveArticle: (articleId: string) => void;
  syncSavedArticles: () => Promise<void>;

  // categories
  fetchCategories: () => Promise<void>;

  // courses
  fetchCourses: () => Promise<void>;
  fetchSelectedCourseInfo: (courseId: string) => Promise<void>;
  fetchCourseReviews: (courseId: string) => Promise<void>;
  fetchCourseProgress: (userId: string, courseId: string) => Promise<void>;
  fetchCourseAttachments: (courseId: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchCourseSectionInfo: (
    courseId: string,
    sectionId: string,
  ) => Promise<void>;
  fetchCourseSectionChapterInfo: (
    courseId: string,
    sectionId: string,
    chapterId: string,
  ) => Promise<void>;
  fetchChapterNotes: (
    userId: string,
    courseId: string,
    chapterId: string,
  ) => Promise<void>;

  // instructor actions
  becomeInstructor: (userId: string) => Promise<void>;
  fetchInstructorInfo: (instructorId: string) => Promise<void>;
  fetchInstructorCourses: (instructorId: string) => Promise<void>;
  fetchInstructorSelectedCourseInfo: (
    instructorId: string,
    courseId: string,
  ) => Promise<void>;
};

export const useZustandStore = create<CoursewaveState & CoursewaveActions>()(
  persist(
    (set, get) => ({
      // user states
      user: null,
      learningGoals: [],
      cartCourses: [],
      enrolledCourses: [],
      wishListedCourses: [],
      savedArticles: [],
      createdArticles: [],
      userSettingsPreferences: [],

      // categories states
      categories: [],
      selectedCategory: null,

      // article states
      articles: [],
      selectedArticle: null,

      // course states
      courses: [],
      courseInfo: null,
      filteredCourses: [],
      selectedCourse: null,
      courseProgress: null,
      courseAttachments: [],
      courseSections: [],
      courseSectionChapters: [],
      courseSectionChapterInfo: null,
      chapterNotes: [],
      courseReviews: [],

      // instructor
      instructorInfo: null,
      instructorCourses: [],
      instructorCourse: null,

      // tracking states
      error: null,
      loading: false,

      // user methods
      setUser: (user: User | null) => set({ loading: false, user: user }),
      addLearningGoal: (learningGoal: LearningGoal) => {
        set((state) => ({
          learningGoals: [...state.learningGoals, learningGoal],
        }));
      },
      markLearningGoalAsDone: (id: string, isDone: boolean) => {
        set((state) => {
          const updatedGoals = state.learningGoals.map((goal) =>
            goal.id === id ? { ...goal, isDone } : goal,
          );
          localStorage.setItem("learningGoals", JSON.stringify(updatedGoals));
          return { learningGoals: updatedGoals };
        });
      },
      editLearningGoal: (
        id: string,
        title?: string,
        tag?: string,
        time?: string,
      ) => {
        set((state) => ({
          learningGoals: state.learningGoals.map((goal: LearningGoal) =>
            goal.id === id
              ? {
                  ...goal,
                  title: title ?? goal.title,
                  tag: tag ?? goal.tag,
                  time: time ?? goal.time,
                }
              : goal,
          ),
        }));
      },
      addToCart: async (userId: string, courseId: string) => {
        const course = await fetchCourseInfo(courseId);
        if (course) {
          set((state) => ({ cartCourses: [...state.cartCourses, course] }));
        }
      },
      removeFromCart: (userId: string, courseId: string) => {
        set((state) => ({
          cartCourses: state.cartCourses.filter(
            (course) => course.id !== courseId,
          ),
        }));
      },
      addToWishList: async (userId: string, course: Course) => {
        try {
          set((state) => ({ loading: true }));

          const response = await fetch(`/api/profile/${userId}/wishlist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
          });

          if (!response.ok) {
            set((state) => ({
              loading: false,
              error: "Failed to save course 🚨❌ ...",
            }));
          }

          set((state) => ({
            wishListedCourses: [...state.wishListedCourses, course],
          }));
        } catch (error: any) {
          console.error("Error saving course:", error);
          set((state) => ({ error: error.message, loading: false }));
        }
      },
      removeFromWishList: (courseId: string) => {},
      fetchEnrolledCourses: async (userId: string) => {},
      fetchArticles: async () => {},
      createArticle: async (
        title: string,
        content: string,
        thumbnailUrl: string | null,
        estimatedReadingTime: string,
        authorId: string,
      ) => {},
      editArticle: async (
        title: string,
        content: string,
        thubnailUrl: string | null,
        estimatedReadingTime: string,
        authorId: string,
      ) => {},
      fetchCreatedArticles: async (userId: string) => {},
      fetchSavedArticles: async (userId: string) => {},
      saveArticle: (article: Blog) => {
        set((state) => ({ savedArticles: [...state.savedArticles, article] }));
      },
      unsaveArticle: (articleId: string) => {
        set((state) => ({
          savedArticles: state.savedArticles.filter(
            (article) => article.id !== articleId,
          ),
        }));
      },
      syncSavedArticles: async () => {},

      // categories methods
      fetchCategories: async () => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/categories`);

          if (!response.ok) {
            console.error(
              "Failed to get categories from api/categories api ...",
            );
          }

          const categories = await response.json();
          set({
            categories: [
              {
                categoryName: "All",
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
              ...categories.data,
            ],
            loading: false,
          });
        } catch (error: any) {
          console.error(
            `Failed to get categories from api/categories api, ERROR: ${error.message} ...`,
          );
          set({ loading: false, error: error.message });
        }
      },

      // course methods
      fetchCourses: async () => {
        set({ loading: true });
        try {
          const response = await fetch("/api/courses");

          if (!response.ok) {
            console.error("Failed to get user info from /api/courses api ...");
          }

          const courses = await response.json();
          set({ courses: courses, loading: false });
        } catch (error: any) {
          console.error(
            `Failed to get user info from /api/courses api, ERROR: ${error.message} ...`,
          );
          set({ loading: false, error: error.message });
        }
      },
      fetchSelectedCourseInfo: async (courseId: string) => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/courses/${courseId}`);

          if (!response.ok) {
            console.error(
              "Failed to get course for course with this courseId ...",
            );
            set({
              loading: false,
              error: `Failed to fetch course info for course with this courseId ${courseId}  ...`,
            });
          }

          const data = await response.json();
          const course: Course = data?.data! as Course;
          console.log("Course info in @zustand/store.ts, course:", course);
          set({ selectedCourse: course, loading: false, error: null });
        } catch (error: any) {
          console.error(
            `Failed to fetch course info for given courseId in @/zustand/store.ts, ERROR: ${error.message} ...`,
          );
          set({ loading: false, error: error.message });
        }
      },
      fetchCourseReviews: async (courseId: string) => {},
      fetchCourseProgress: async (courseId: string, sectionId: string) => {},
      fetchCourseAttachments: async (courseId: string) => {},
      fetchCourseSections: async (courseId: string) => {},
      fetchCourseSectionInfo: async (courseId: string, sectionId: string) => {},
      fetchCourseSectionChapterInfo: async (
        courseId: string,
        sectionId: string,
        chapterId: string,
      ) => {},
      fetchChapterNotes: async (
        userId: string,
        courseId: string,
        chapterId: string,
      ) => {},

      // instructor methods
      becomeInstructor: async (userId: string) => {
        console.log("You are an instructor now ...");
      },
      fetchInstructorInfo: async (instructorId: string) => {},
      fetchInstructorCourses: async (instructorId: string) => {},
      fetchInstructorSelectedCourseInfo: async (
        instructorId: string,
        courseId: string,
      ) => {},
    }),

    {
      name: "Coursewave-Store",
    },
  ),
);
