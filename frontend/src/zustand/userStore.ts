import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Course, User } from "@prisma/client";
import { LearningGoal } from "@/types/learning-goal";
import { BlogWithComments } from "@/types/blog-with-comments";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import {
  articleService,
  authService,
  courseService,
  userService,
} from "@/lib/api/user";
import { BlogArticle } from "@/types/blog-api-response";
import toast from "react-hot-toast";
import router from "next/router";
import { EnrolledCourse } from "@/types/enrollments-api-response";

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type UserState = {
  userResponse: {
    status: boolean;
    data: User;
    accessToken: string;
    refreshToken: string;
  } | null;
  userId: string;
  user: User | null;
  savedCourses: Course[];
  token: string | null;
  loadingState: LoadingState;
  learningGoals: LearningGoal[];
  cartCourses: Course[];
  wishListedCourses: Course[];
  enrolledCourses: EnrolledCourse[];
  savedArticles: BlogArticle[];
  createdArticles: BlogArticle[];
  userSettingsPreferences: any[];
};

type UserActions = {
  loginUser: (email: string, password: string) => Promise<void>;
  logOutUser: (userId: string) => Promise<void>;
  setUser: (user: User) => void;
  saveCourse: (courseId: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateUserProfile: (updates: {
    newUserName?: string;
    newProfileImage?: string;
  }) => Promise<void>;
  becomeInstructor: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  addLearningGoal: (learningGoal: LearningGoal) => void;
  markLearningGoalAsDone: (id: string, isDone: boolean) => void;
  editLearningGoal: (
    id: string,
    title?: string,
    tag?: string,
    time?: string
  ) => void;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => void;
  addToWishList: (courseId: string) => Promise<void>;
  removeFromWishList: (courseId: string) => void;
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  fetchArticles: () => Promise<void>;
  createArticle: (articleData: {
    title: string;
    content: string;
    thumbnailUrl: string | null;
    estimatedReadingTime: string;
  }) => Promise<void>;
  editArticle: (
    articleId: string,
    updates: {
      title?: string;
      content?: string;
      thumbnailUrl?: string | null;
      estimatedReadingTime?: string;
    }
  ) => Promise<void>;
  fetchCreatedArticles: () => Promise<void>;
  saveArticle: (articleId: string) => Promise<void>;
  unsaveArticle: (articleId: string) => Promise<void>;
  syncSavedArticles: () => Promise<void>;
};

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      userResponse: null,
      userId: "",
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
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await authService.login(email, password);
          set({
            userResponse: response,
            user: response.data,
            userId: response.data.id,
            token: response.accessToken,
            loadingState: { loading: false, error: null },
          });
          console.log("Login response: ", response.data);
          // setUser(res.data);
          successNotification("Logged in successfully");
          router.push("/browse");
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Login failed",
            },
          });
          throw error;
        } finally {
          set({ loadingState: { loading: false, error: null } });
        }
      },

      logOutUser: async (userId: string) => {
        try {
          await authService.logout(userId);
          set({
            userResponse: null,
            user: null,
            userId: "",
            token: null,
          });
        } catch (error) {
          console.error("Logout failed:", error);
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      saveCourse: async (courseId: string) => {
        const { userId } = get();
        if (!userId) return;

        try {
          await courseService.saveCourse(userId, courseId);
          // Update local state if needed
        } catch (error) {
          console.error("Failed to save course:", error);
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        try {
          await authService.verifyEmail(token);
          // Handle successful verification
        } catch (error) {
          console.error("Email verification failed:", error);
          throw error;
        }
      },

      updateUserProfile: async (updates) => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          const updatedUser = await userService.updateProfile(userId, updates);
          set({
            user: updatedUser,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Profile update failed",
            },
          });
          throw error;
        }
      },

      becomeInstructor: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          const updatedUser = await userService.becomeInstructor(userId);
          set({
            user: updatedUser,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to become instructor",
            },
          });
          throw error;
        }
      },

      updatePassword: async (oldPassword: string, newPassword: string) => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          await userService.changePassword(userId, oldPassword, newPassword);
          set({ loadingState: { loading: false, error: null } });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Password change failed",
            },
          });
          throw error;
        }
      },

      deleteAccount: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          await userService.deleteAccount(userId);
          set({
            userResponse: null,
            user: null,
            userId: "",
            token: null,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Account deletion failed",
            },
          });
          throw error;
        }
      },

      // Learning Goals (local only)
      addLearningGoal: (learningGoal: LearningGoal) => {
        set((state) => ({
          learningGoals: [...state.learningGoals, learningGoal],
        }));
      },

      markLearningGoalAsDone: (id: string, isDone: boolean) => {
        set((state) => ({
          learningGoals: state.learningGoals.map((goal) =>
            goal.id === id ? { ...goal, isDone } : goal
          ),
        }));
      },

      editLearningGoal: (
        id: string,
        title?: string,
        tag?: string,
        time?: string
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
              : goal
          ),
        }));
      },

      // Cart Actions
      addToCart: async (courseId: string) => {
        try {
          const course = await courseService.getCourseInfo(courseId);
          if (course) {
            set((state) => ({ cartCourses: [...state.cartCourses, course] }));
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
          throw error;
        }
      },

      removeFromCart: (courseId: string) => {
        set((state) => ({
          cartCourses: state.cartCourses.filter(
            (course) => course.courseId !== courseId
          ),
        }));
      },

      // Wishlist
      addToWishList: async (courseId: string) => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          await courseService.addToWishlist(userId, courseId);
          const course = await courseService.getCourseInfo(courseId);
          set((state) => ({
            wishListedCourses: [...state.wishListedCourses, course],
            loadingState: { loading: false, error: null },
          }));
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to add to wishlist",
            },
          });
          throw error;
        }
      },

      removeFromWishList: (courseId: string) => {
        const { userId } = get();
        if (!userId) return;

        set((state) => ({
          wishListedCourses: state.wishListedCourses.filter(
            (course) => course.courseId !== courseId
          ),
        }));
        // You might want to call courseService.removeFromWishlist here
      },

      // Enrolled Courses
      fetchEnrolledCourses: async (userId: string) => {
        // const { userId } = get();

        console.log("Fetching enrolled courses for userId:", userId);
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await userService.getEnrolledCourses(userId);
          set({
            enrolledCourses: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch enrolled courses",
            },
          });
          throw error;
        }
      },

      // Articles
      fetchArticles: async () => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const articles = await articleService.getArticles();
          set({
            savedArticles: articles,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch articles",
            },
          });
          throw error;
        }
      },

      createArticle: async (articleData) => {
        const { userId } = get();
        if (!userId) return;

        try {
          const newArticle = await articleService.createArticle({
            ...articleData,
            authorId: userId,
          });
          set((state) => ({
            createdArticles: [...state.createdArticles, newArticle],
          }));
          return newArticle;
        } catch (error) {
          console.error("Failed to create article:", error);
          throw error;
        }
      },

      editArticle: async (articleId: string, updates) => {
        try {
          const updatedArticle = await articleService.updateArticle(
            articleId,
            updates
          );
          set((state) => ({
            createdArticles: state.createdArticles.map((article) =>
              article.id === articleId ? updatedArticle : article
            ),
          }));
          return updatedArticle;
        } catch (error) {
          console.error("Failed to edit article:", error);
          throw error;
        }
      },

      fetchCreatedArticles: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          const articles = await articleService.getCreatedArticles(userId);
          set({
            createdArticles: articles,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch created articles",
            },
          });
          throw error;
        }
      },

      saveArticle: async (articleId: string) => {
        const { userId } = get();
        if (!userId) return;

        try {
          await articleService.saveArticle(userId, articleId);
          // You might want to fetch the article details here if needed
        } catch (error) {
          console.error("Failed to save article:", error);
          throw error;
        }
      },

      unsaveArticle: async (articleId: string) => {
        const { userId } = get();
        if (!userId) return;

        try {
          await articleService.unsaveArticle(userId, articleId);
          set((state) => ({
            savedArticles: state.savedArticles.filter(
              (article) => article.id !== articleId
            ),
          }));
        } catch (error) {
          console.error("Failed to unsave article:", error);
          throw error;
        }
      },

      syncSavedArticles: async () => {
        // Implement if needed
      },
    }),
    {
      name: "Coursewave-User-Store",
    }
  )
);
