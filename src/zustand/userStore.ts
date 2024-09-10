import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course, User } from "@prisma/client";
import { LearningGoal } from "@/types/learning-goal";
import { fetchCourseInfo } from "@/helpers/data-fetching-methods";
import { db } from "@/lib/db";
import { BlogWithComments } from "@/types/blog-with-comments";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import axios from "axios";
import { absoluteUrl } from "@/utils/utils";

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type UserState = {
  user: User | null;
  savedCourses: Course[];
  token: string | null;
  loadingState: LoadingState;
  learningGoals: LearningGoal[];
  cartCourses: Course[];
  wishListedCourses: Course[];
  enrolledCourses: EnrollementWithProgress[];
  savedArticles: BlogWithComments[];
  createdArticles: BlogWithComments[];
  userSettingsPreferences: any[];
};

type UserActions = {
  loginUser: (email: string, password: string) => Promise<void>;
  logOutUser: (userId: string) => Promise<void>;
  setUser: (user: User) => void;
  saveCourse: (course: Course) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateUserProfile: (
    userId: string,
    newUserName: string,
    newProfileImage: string,
  ) => Promise<void>;
  becomeInstructor: (userId: string) => Promise<void>;
  updatePassword: (
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
  addLearningGoal: (learningGoal: LearningGoal) => void;
  markLearningGoalAsDone: (id: string, isDone: boolean) => void;
  editLearningGoal: (
    id: string,
    title?: string,
    tag?: string,
    time?: string,
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
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string,
  ) => Promise<void>;
  fetchCreatedArticles: (userId: string) => Promise<void>;
  saveArticle: (article: BlogWithComments) => void;
  unsaveArticle: (articleId: string) => void;
  syncSavedArticles: () => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      savedCourses: [],
      token: null,
      loadingState: { loading: false, error: null },
      learningGoals: [],
      cartCourses: [],
      wishListedCourses: [],
      enrolledCourses: [],
      savedArticles: [],
      createdArticles: [],
      userSettingsPreferences: [],

      // Auth Actions

      loginUser: async (email: string, password: string) => {
        try {
          set({ loadingState: { loading: true, error: null } });

          const url =
            process.env.ENVIRONMENT === "DEVELOPMENT"
              ? absoluteUrl("/api/auth/login")
              : "api/auth/login";

          const response = await axios
            .post(url, { email: email, password: password })
            .then((res) => {
              console.log("Login response: ", res.data);
              set({
                user: res.data as User,
                loadingState: { loading: false, error: "" },
              });
            });

          console.log("Login success response: ", response);
          console.log(
            "Auth successfull in userStore.ts, the user: ",
            get().user,
          );
        } catch (error: any) {
          console.error("Login failed: ", error.message);
          set({ loadingState: { loading: false, error: error.message } });
        }
      },
      logOutUser: async (userId: string) => {
        // Implement logout logic here
      },
      setUser: (user: User) => {
        set({ user });
      },
      saveCourse: async (course: Course) => {
        // Implement save course logic here
      },
      verifyEmail: async () => {
        // Implement email verification logic here
      },

      // Update Profile Action
      updateUserProfile: async (
        userId: string,
        newUserName: string,
        newProfileImage: string,
      ) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await fetch(`/api/profile/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              newUserName,
              newProfileImageUrl: newProfileImage,
            }),
          });

          if (!response.ok) throw new Error("Failed to update profile ...");

          const updatedUser = await response.json();
          set({
            user: updatedUser,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },

      becomeInstructor: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await fetch("/api/becomeInstructor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok)
            throw new Error("Failed to make user an instructor ...");

          const updatedUser = await response.json();
          set({
            user: updatedUser,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },

      // Password Actions
      updatePassword: async (
        userId: string,
        oldPassword: string,
        newPassword: string,
      ) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await fetch(
            `/api/profile/${userId}/changePassword`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ oldPassword, newPassword }),
            },
          );

          if (!response.ok) throw new Error("Failed to change password ...");

          const updatedUser = await response.json();
          set({
            user: updatedUser.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },

      deleteAccount: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await fetch(`/api/profile/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Failed to delete user ...");

          set({ user: null, loadingState: { loading: false, error: null } });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },

      // Learning Goals
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
          learningGoals: state.learningGoals.map((goal) =>
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

      // Cart Actions
      addToCart: async (userId: string, courseId: string) => {
        try {
          const course = await fetchCourseInfo(courseId);
          if (course) {
            set((state) => ({ cartCourses: [...state.cartCourses, course] }));
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      },
      removeFromCart: (userId: string, courseId: string) => {
        set((state) => ({
          cartCourses: state.cartCourses.filter(
            (course) => course.courseId !== courseId,
          ),
        }));
      },

      // Wishlist
      addToWishList: async (userId: string, course: Course) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await fetch(`/api/profile/${userId}/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) throw new Error("Failed to save course 🚨❌ ...");

          set((state) => ({
            wishListedCourses: [...state.wishListedCourses, course],
            loadingState: { loading: false, error: null },
          }));
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },
      removeFromWishList: (courseId: string) => {
        set((state) => ({
          wishListedCourses: state.wishListedCourses.filter(
            (course) => course.courseId !== courseId,
          ),
        }));
      },

      // Enrolled Courses
      fetchEnrolledCourses: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          // Fetch enrollments with related course data
          const enrollments = await db.enrollment.findMany({
            where: { userId },
            include: {
              course: {
                select: {
                  courseId: true,
                  courseTitle: true,
                  coursePrice: true,
                  CourseProgress: true,
                },
              },
            },
          });

          // Format data for use in the frontend
          const formattedEnrollments: EnrollementWithProgress[] =
            enrollments.map((enrollment) => ({
              enrollmentId: enrollment.enrollmentId,
              userId: enrollment.userId,
              courseId: enrollment.courseId,
              enrollmentDate: enrollment.enrollmentDate,
              courseProgressId: enrollment.courseProgressId,
              courseTitle: enrollment.course?.courseTitle || "Unknown Title",
              enrollmentStatus: enrollment.enrollmentStatus,
              coursePrice: enrollment.course?.coursePrice || 0,
              progress: 0,
              certificate: "None",
              validity: "Unknown",
              createdAt: enrollment.createdAt
                ? new Date(enrollment.createdAt)
                : null,
              updatedAt: enrollment.updatedAt
                ? new Date(enrollment.updatedAt)
                : null,
            }));

          set({
            enrolledCourses: formattedEnrollments,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error ? error.message : "An error occurred",
            },
          });
        }
      },

      // Articles
      fetchArticles: async () => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const articles: BlogWithComments[] = await db.blog.findMany({
            include: {
              comments: true,
            },
          });

          set({
            savedArticles: articles,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Error fetching articles ...",
            },
          });
        }
      },

      createArticle: async (
        title: string,
        content: string,
        thumbnailUrl: string | null,
        estimatedReadingTime: string,
        authorId: string,
      ) => {
        // Implement logic here
      },

      editArticle: async (
        title: string,
        content: string,
        thumbnailUrl: string | null,
        estimatedReadingTime: string,
        authorId: string,
      ) => {
        // Implement logic here
      },

      fetchCreatedArticles: async (userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const articles: BlogWithComments[] = await db.blog.findMany({
            where: {
              authorId: userId,
            },
            include: {
              comments: true,
            },
          });

          set({
            createdArticles: articles,
            loadingState: { loading: false, error: null },
          });
        } catch (error) {
          set({
            loadingState: {
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Error fetching created articles ...",
            },
          });
        }
      },

      saveArticle: (article: BlogWithComments) => {
        set((state) => ({
          savedArticles: [...state.savedArticles, article],
        }));
      },

      unsaveArticle: (articleId: string) => {
        set((state) => ({
          savedArticles: state.savedArticles.filter(
            (article) => article.id !== articleId,
          ),
        }));
      },

      syncSavedArticles: async () => {
        // Implement logic here
      },
    }),
    { name: "Coursewave-User-Store", getStorage: () => localStorage },
  ),
);
