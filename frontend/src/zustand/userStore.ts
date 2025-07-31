import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  User,
  UserResponse,
  LearningGoal,
  Course,
  EnrolledCourse,
  BlogArticle,
  LoadingState,
} from "@/types";
import {
  articleService,
  authService,
  courseService,
  userService,
} from "@/lib/api/user";
import toast from "react-hot-toast";
import { RiExpandVerticalSLine } from "react-icons/ri";
import { Enrollment } from "@/types/user-enrollments-api-response";

type UserState = {
  userResponse: UserResponse | null;
  userId: string;
  user: User | null;
  savedCourses: Course[];
  token: string | null;
  loadingState: LoadingState;
  learningGoals: LearningGoal[];
  cartCourses: Course[];
  wishListedCourses: Course[];
  enrolledCourses: Enrollment[];
  savedArticles: BlogArticle[];
  createdArticles: BlogArticle[];
  userSettingsPreferences: any[];
  isAuthenticated: boolean;
};

type UserActions = {
  registerUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logOutUser: () => Promise<void>;
  setUser: (user: User) => void;
  saveCourse: (courseId: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateUserProfile: (updates: {
    newUserName?: string;
    newProfileImage?: string;
  }) => Promise<void>;
  becomeInstructor: (
    bio: string,
    expertise?: string[],
    socialLinks?: JSON[]
  ) => Promise<void>;
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
  fetchEnrolledCourses: (

    // userId: string
  ) => Promise<void>;
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
  checkAuthToken: () => boolean;
  refreshAuthToken: () => Promise<boolean>;
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
      isAuthenticated: false,

      // Auth Actions
      registerUser: async (email: string, password: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await authService.register(email, password);
          console.log(
            "Full response from authService on registeration:",
            JSON.stringify(response)
          );
          console.log("Response type:", typeof response);
          console.log("Response keys:", Object.keys(response));

          set({
            userResponse: response,
            loadingState: { loading: false, error: null },
          });

          successNotification("User registered successfully");

          // Redirect to login page after successfull registeration
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        } catch (error: any) {
          console.log("Login error: ", error);
          set({
            loadingState: {
              loading: false,
              error: error.message || "Login failed",
            },
            isAuthenticated: false,
          });
          errorNotification(error.message || "Login failed");
          // throw error;
        } finally {
          set({ loadingState: { loading: false, error: null } });
        }
      },

      loginUser: async (email: string, password: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await authService.login(email, password);
          console.log("Full response from authService:", response);
          console.log("Response type:", typeof response);
          console.log("Response keys:", Object.keys(response));

          // Extract user data from the response
          const userData = response.user;
          const accessToken = response.accessToken;
          const refreshToken = response.refreshToken;

          console.log("Extracted user data:", userData);
          console.log("User ID:", userData?.id);

          if (!userData || !userData.id) {
            throw new Error("Invalid user data received from server");
          }

          // Ensure token is stored in localStorage/sessionStorage
          if (accessToken && typeof window !== "undefined") {
            localStorage.setItem("coursewave_access_token", accessToken);
            console.log("Auth token stored in localStorage from userStore");
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
          }

          set({
            userResponse: response,
            user: userData,
            userId: userData.id,
            token: accessToken,
            loadingState: { loading: false, error: null },
            isAuthenticated: true,
          });
          console.log("Login successful, user set:", userData);
          successNotification("Logged in successfully");

          // Redirect to browse page after successful login
          if (typeof window !== "undefined") {
            window.location.href = "/browse";
          }
        } catch (error: any) {
          console.log("Login error: ", error);
          set({
            loadingState: {
              loading: false,
              error: error.message || "Login failed",
            },
            isAuthenticated: false,
          });
          errorNotification(error.message || "Login failed");
          // throw error;
        } finally {
          set({ loadingState: { loading: false, error: null } });
        }
      },

      logOutUser: async () => {
        try {
          await authService.logout();
          set({
            userResponse: null,
            user: null,
            userId: "",
            token: null,
            isAuthenticated: false,
          });
          // Clear authToken from localStorage/sessionStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("coursewave_access_token");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          console.error("Logout failed:", error);
          throw error;
        }
      },

      // Check if user has valid auth token
      checkAuthToken: () => {
        if (typeof window !== "undefined") {
          const authToken = localStorage.getItem("coursewave_access_token");
          console.log("checkAuthToken - Token found:", !!authToken);
          console.log(
            "checkAuthToken - Token value:",
            authToken ? `${authToken.substring(0, 20)}...` : "null"
          );
          return !!authToken;
        }
        return false;
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

      becomeInstructor: async (bio, expertise, socialLinks) => {
        const { userId } = get();
        if (!userId) return;

        set({ loadingState: { loading: true, error: null } });
        try {
          const updatedUser = await userService.becomeInstructor(
            userId,
            bio,
            expertise,
            socialLinks
          );
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
            isAuthenticated: false,
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
            (course) => course.id !== courseId
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
            (course) => course.id !== courseId
          ),
        }));
        // You might want to call courseService.removeFromWishlist here
      },

      // Enrolled Courses
      fetchEnrolledCourses: async () => {
        // userId: string

        // console.log("Fetching enrolled courses for userId:", userId);

        // Validate userId before making API call
        // if (!userId || userId === "null" || userId === "undefined") {
        //   console.warn(
        //     "Invalid userId provided to fetchEnrolledCourses:",
        //     userId
        //   );
        //   set({
        //     enrolledCourses: [],
        //     loadingState: { loading: false, error: null },
        //   });
        //   return;
        // }

        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await userService.getEnrolledCourses(
            // userId
          );
          console.log("Enrolled courses response:", response);

          // Ensure we have valid data
          const courses = response ?? [];
          console.log("Setting enrolled courses:", JSON.stringify(courses));

          set({
            enrolledCourses: courses,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          console.error("Error fetching enrolled courses:", error);
          set({
            enrolledCourses: [],
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
          const response = await articleService.getCreatedArticles(userId);
          console.log("Created articles response:", response);

          // Ensure we have valid data
          const articles = response?.data || [];
          console.log("Setting created articles:", articles);

          set({
            createdArticles: articles,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          console.error("Error fetching created articles:", error);
          set({
            createdArticles: [],
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

      refreshAuthToken: async () => {
        console.log("=== Starting token refresh ===");
        try {
          const response = await authService.refreshToken();
          console.log("Refresh token response:", response);

          if (response?.accessToken) {
            set({ token: response.accessToken });
            console.log("Auth token refreshed successfully");
            return true;
          }
          console.log("No access token in refresh response");
          return false;
        } catch (error) {
          console.error("Failed to refresh auth token:", error);
          // Clear tokens if refresh fails
          if (typeof window !== "undefined") {
            localStorage.removeItem("coursewave_access_token");
            localStorage.removeItem("refreshToken");
          }
          set({ token: null });
          return false;
        }
      },
    }),
    {
      name: "Coursewave-User-Store",
    }
  )
);

// Initialize auth state
useUserStore.getState().checkAuthToken();
